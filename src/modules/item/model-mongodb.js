import { Schema, model } from 'mongoose'

import { createIv, decryptWithSymmetricKey, encryptWithSymmetricKey } from '../utils.js'

const schema = new Schema({
    secret: { type: Schema.Types.ObjectId, ref: 'Secret', required: true, index: true },
    iv: String,
    encryptedName: String,
    encryptedValue: String,
}, { timestamps: true })

schema.virtual('id').get(function() { return this._id.toString() })
schema.virtual('secretId').get(function() { return this.secret._id.toString() })
schema.set('toJSON', { virtuals: true })
schema.set('toObject', { virtuals: true })
schema.method('decrypt', function(userKey) {
    const iv = Buffer.from(this.iv, 'base64')

    const name = decryptWithSymmetricKey(userKey, iv, Buffer.from(this.encryptedName, 'base64'))
    const value = decryptWithSymmetricKey(userKey, iv, Buffer.from(this.encryptedValue, 'base64'))

    return { name, value }
})

const Model = model('Item', schema)

/**
 * @param {string} name
 * @param {string} value
 * @param {string} secretId
 * @param {Buffer} userKey
 */
async function create(name, value, secretId, userKey) {
    const iv = createIv()

    const encryptedName = encryptWithSymmetricKey(userKey, iv, Buffer.from(name, 'utf8'))
    const encryptedValue = encryptWithSymmetricKey(userKey, iv, Buffer.from(value, 'utf8'))

    return Model.create({
        secret: secretId,
        iv: iv.toString('base64'),
        encryptedName: encryptedName.toString('base64'),
        encryptedValue: encryptedValue.toString('base64'),
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
/*
function decrypt(obj, userKey) {
    const { iv: ivStr, encryptedName, encryptedValue } = obj
    const iv = Buffer.from(ivStr, 'base64')
    const name = decryptWithSymmetricKey(userKey, iv, Buffer.from(encryptedName, 'base64'))
    const value = decryptWithSymmetricKey(userKey, iv, Buffer.from(encryptedValue, 'base64'))

    return { name, value }
}
*/

export const Item = {
    create,
    find,
    //decrypt
}

