import { promisify } from 'util'
import { scrypt, randomBytes, createCipheriv, createDecipheriv } from 'crypto'

import { ALGORITHM, KEY_LENGTH } from '../config.js'
import { Password } from '../../entities/password.js'

const scryptP = promisify(scrypt)

/**
 * @param {Buffer} userKey
 * @param {string} password
 * @param {number} userId
 */
async function create(userKey, password, userId) {
    const iv = randomBytes(16)
    const salt = randomBytes(16)

    const genKey = await scryptP(password, salt, KEY_LENGTH) // used to encrypt userKey
    const cipher = createCipheriv(ALGORITHM, genKey, iv)
    let encryptedKey = cipher.update(userKey, null, 'base64')
    encryptedKey += cipher.final('base64')

    const passwordObj = {
        userId,
        salt: salt.toString('base64'),
        iv: iv.toString('base64'),
        encryptedKey
    }

    await Password.create(passwordObj)

    return passwordObj
}

/**
 * @param {object} passwordObj
 * @param {string} openPassword
 * @returns {Buffer} userKey
 */
async function decrypt(passwordObj, openPassword) {
    const { encryptedKey, iv: ivStr, salt: saltStr } = passwordObj
    const salt = Buffer.from(saltStr, 'base64')
    const iv = Buffer.from(ivStr, 'base64')

    const genKey = await scryptP(openPassword, salt, KEY_LENGTH)
    const decipher = createDecipheriv(ALGORITHM, genKey, iv)
    let decrypted = decipher.update(encryptedKey, 'base64', 'base64')
    decrypted += decipher.final('base64')

    return Buffer.from(decrypted, 'base64')
}

function findOne(obj) {
    return Password.findOne({ where: obj })
}

export const Model = {
    create,
    decrypt,
    findOne
}

