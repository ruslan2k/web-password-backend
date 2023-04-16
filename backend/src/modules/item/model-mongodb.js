import { randomBytes, createCipheriv } from 'crypto'
import { Schema, model } from 'mongoose'

import { ALGORITHM } from '../config.js'
import { decrypt as decryptCommon } from '../cipher/index.js'

const schema = new Schema({
    secret: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    iv: String,
    encryptedName: String,
    encryptedValue: String,
}, { timestamps: true })

schema.virtual('id').get(function () { return this._id.toString() })
schema.virtual('secretId').get(function () { return this.secret._id.toString() })
schema.set('toJSON', { virtuals: true })
schema.set('toObject', { virtuals: true })

const Model = model('Item', schema)

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

    return Model.create({
        secret: secretId,
        iv: iv.toString('base64'),
        encryptedName,
        encryptedValue
    })
}

/**
 * @param {object} obj
 */
export function find(obj) {
    return Model.find(obj)
}

/**
 * @param {object} obj
 * @param {string} obj.iv
 * @param {string} obj.encryptedName
 * @param {string} obj.encryptedValue
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

