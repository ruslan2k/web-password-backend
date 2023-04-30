import { Schema, model } from 'mongoose'
//import { randomBytes, createCipheriv } from 'crypto'

//import { Item } from '../item/model-mongodb.js'
//import { ALGORITHM } from '../config.js'
import { encryptWithSymmetricKey, decryptWithSymmetricKey, createIv, generateId } from '../utils.js'

const schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    iv: String,
    encryptedName: String,
    items: [{
        id: String,
        encryptedName: String,
        encryptedValue: String,
    }]
}, { timestamps: true })

schema.virtual('id').get(function() { return this._id.toString() })
schema.virtual('userId').get(function() { return this.user._id.toString() })
schema.set('toJSON', { virtuals: true })
schema.set('toObject', { virtuals: true })
schema.method('decrypt', function(userKey) {
    const iv = Buffer.from(this.iv, 'base64')
    const encryptedName = Buffer.from(this.encryptedName, 'base64')
    const name = decryptWithSymmetricKey(userKey, iv, encryptedName).toString()

    const items = this.items.map((item) => {
        const encryptedName = Buffer.from(item.encryptedName, 'base64')
        const encryptedValue = Buffer.from(item.encryptedValue, 'base64')
        const name = decryptWithSymmetricKey(userKey, iv, encryptedName).toString()
        const value = decryptWithSymmetricKey(userKey, iv, encryptedValue).toString()

        return { id: item.id, name, value }
    })
    return { name, items }
})

const Model = model('Secret', schema)

/**
 * @param {string} userId
 * @param {Buffer} userKey
 * @param {string} name
 * @param {object[]} items
 */
async function create(userId, userKey, name, items) {
    const iv = createIv()
    const encryptedName = encryptWithSymmetricKey(userKey, iv, Buffer.from(name, 'utf8'))
  
    const secret = await Model.create({
        user: userId,
        iv: iv.toString('base64'),
        encryptedName: encryptedName.toString('base64'),

        items: items.map(({ name, value }) => {
            //const fixedValue = value ? value : ""
            const encryptedName = encryptWithSymmetricKey(userKey, iv, Buffer.from(name, 'utf8'))
            const encryptedValue = encryptWithSymmetricKey(userKey, iv, Buffer.from(value || "", 'utf8'))

            return {
                id: generateId(),
                encryptedName: encryptedName.toString('base64'),
                encryptedValue: encryptedValue.toString('base64'),
            }
        })
    })

    return { id: secret.id }
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

