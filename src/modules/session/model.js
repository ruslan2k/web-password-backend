import { Schema, model } from 'mongoose'

import { appSecretBuf } from '../config.js'
import { createIv, encryptWithSymmetricKey } from '../utils.js'

const schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    iv: String,
    encryptedUserKey: String
}, { timestamps: true })

schema.virtual('id').get(function() { return this._id.toString() })
schema.set('toJSON', { virtuals: true })
schema.set('toObject', { virtuals: true })

const Model = model('Session', schema)

/**
 * @param {string} userId
 * @param {Buffer} userKey
 */
async function create(userId, userKey) {
    const iv = createIv()
    const encryptedUserKey = encryptWithSymmetricKey(appSecretBuf, iv, userKey)
    const session = await Model.create({
        user: userId,
        iv: iv.toString('base64'),
        encryptedUserKey: encryptedUserKey.toString('base64')
    })

    return { id: session._id }
}

/**
 * @param {string} id
 */
function findById(id) {
    return Model.findById(id)
}

export const Session = {
    create,
    findById
}

