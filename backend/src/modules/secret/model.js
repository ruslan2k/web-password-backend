import { randomBytes, createCipheriv } from 'crypto'
import _ from 'lodash'
import { generateId } from '../utils.js'
import { db } from '../db/service.js'
import { Item } from '../item/model.js'
import { ALGORITHM } from '../config.js'
import { decrypt as decryptCommon } from '../cipher/index.js'

/**
 * @param {string} userId
 * @param {Buffer} userKey
 * @param {string} name
 * @param {object[]} items
 */
async function create(userId, userKey, name, items) {
    const iv = randomBytes(16)
    const cipher = createCipheriv(ALGORITHM, userKey, iv)
    let encryptedName = cipher.update(name, 'utf8', 'base64')
    encryptedName += cipher.final('base64')

    const secretObj = {
        id: generateId(),
        userId,
        iv: iv.toString('base64'),
        encryptedName
    }
    db.data.secrets.push(secretObj)
    await db.write()
    if (items?.length) {
        const dbItems = await Promise.all(items.map(({ name, value }) => {
            // TODO: createMany
            return Item.create(name, value, secretObj.id, userKey)
        }))
        secretObj.items = dbItems
    } else {
        secretObj.items = []
    }

    return { id: secretObj.id, name, items }
}

async function find(func) {
    return db.data.secrets.filter(func)
}

function decrypt(obj, userKey) {
    throw new Error('TODO')
}

export const Secret = {
    create,
    find,
    decrypt
}

