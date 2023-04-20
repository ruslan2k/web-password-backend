import { Schema, model } from 'mongoose'
//import { promisify } from 'util'

import { appSecret } from '../config.js'
import { createIv, encryptWithSymmetricKey } from '../utils.js'
//const DEF_5K = 5000
//const DEF_64 = 64
//const pbkdf2P = promisify(pbkdf2)

const schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    iv: String,
    //salt: String,
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
    const encryptedUserKey = encryptWithSymmetricKey(Buffer.from(appSecret), iv, userKey)
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

