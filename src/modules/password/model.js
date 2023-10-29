import { promisify } from 'util'
import _ from 'lodash'
import { scrypt, randomBytes, createCipheriv, createDecipheriv } from 'crypto'
import { generateId } from '../utils.js'
import { ALGORITHM, KEY_LENGTH } from '../config.js'

const scryptP = promisify(scrypt)

/**
 * @param {Buffer} userKey
 * @param {string} password
 * @param {string} userId
 */
async function create(userKey, password, userId) {
    const iv = randomBytes(16)
    const salt = randomBytes(16)

    const genKey = await scryptP(password, salt, KEY_LENGTH) // used to encrypt userKey
    const cipher = createCipheriv(ALGORITHM, genKey, iv)
    let encryptedKey = cipher.update(userKey, null, 'base64')
    encryptedKey += cipher.final('base64')

    const passwordObj = {
        id: generateId(),
        userId,
        salt: salt.toString('base64'),
        iv: iv.toString('base64'),
        encryptedKey
    }

    db.data.passwords.push(passwordObj)
    await db.write()

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

async function findOne(obj) {
    return _.find(db.data.passwords, obj)
}

export const Model = {
    create,
    decrypt,
    findOne
}

