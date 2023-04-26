import { Schema, model } from 'mongoose'
import { randomBytes, createCipheriv } from 'crypto'

import { Item } from '../item/model-mongodb.js'
import { ALGORITHM } from '../config.js'
import { decryptWithSymmetricKey } from '../utils.js'

const schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    iv: String,
    encryptedName: String
}, { timestamps: true })

schema.virtual('id').get(function() { return this._id.toString() })
schema.virtual('userId').get(function() { return this.user._id.toString() })
schema.set('toJSON', { virtuals: true })
schema.set('toObject', { virtuals: true })
schema.method('decrypt', function(userKey) {
    const iv = Buffer.from(this.iv, 'base64')
    const encryptedName = Buffer.from(this.encryptedName, 'base64')
    const name = decryptWithSymmetricKey(userKey, iv, encryptedName).toString()

    return { name }
})

const Model = model('Secret', schema)

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

    const secret = await Model.create({
        user: userId,
        iv: iv.toString('base64'),
        encryptedName
    })

    if (items?.length) {
        await Promise.all(items.map(({ name, value }) => {
            // TODO: createMany
            return Item.create(name, value, secret.id, userKey)
        }))
    }

    return { id: secret.id, name, items }
}

async function find(obj) {
    return Model.find(obj)
}

function decrypt(obj, userKey) {
    throw new Error('TODO')
}

export const Secret = {
    create,
    find,
    decrypt
}

