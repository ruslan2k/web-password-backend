import { randomBytes, createCipheriv } from 'crypto'
import _ from 'lodash'

import { generateId } from '../utils.js'
import { db } from '../db/service.js'
import { ALGORITHM } from '../config.js'
import { decrypt as decryptCommon } from '../cipher/index.js'

/**
 * @param {string} name
 * @param {string} value
 * @param {string} secretId
 * @param {Buffer} userKey
 */
async function create(name, value, secretId, userKey) {
    const iv = randomBytes(16)

    let cipher
    cipher = createCipheriv(ALGORITHM, userKey, iv)
    let encryptedName = cipher.update(name, 'utf8', 'base64')
    encryptedName += cipher.final('base64')

    cipher = createCipheriv(ALGORITHM, userKey, iv)
    let encryptedValue = cipher.update(value, 'utf8', 'base64')
    encryptedValue += cipher.final('base64')

    const itemObj = {
        id: generateId(),
        secretId,
        iv: iv.toString('base64'),
        encryptedName,
        encryptedValue
    }

    db.data.items.push(itemObj)
    await db.write()

    return { id: itemObj.id, secretId, name, value }
}

async function find(func) {
    return db.data.items.filter(func)
}

/**
 * @param {object} obj
 * @param {string} obj.iv
 * @param {Buffer} userKey
 */
function decrypt(obj, userKey) {
    const { iv: ivStr, encryptedName, encryptedValue } = obj
    const iv = Buffer.from(ivStr, 'base64')
    const name = decryptCommon(iv, userKey, encryptedName)
    const value = decryptCommon(iv, userKey, encryptedValue)

    return { name, value }
}

export const Item = {
    create,
    find,
    decrypt
}