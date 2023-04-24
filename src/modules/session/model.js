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

schema.method('getUserKey', function() => {
    throw new Error('TODO') // TODO:
})

const Model = model('Session', schema)

const map1 = new Map()

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

    return session
}

/**
 * @param {string} userId
 * @param {Buffer} userKey
 */
async function createCached(userId, userKey) {
    const session = await create(userId, userKey)
    const id = session._id.toString()
    map1.set(id, { id, createdAt: session.createdAt, userKey })
    
    return { id }
}

/**
 * @param {string} id
 */
function findById(id) {
    return Model.findById(id)
}

/** @param {string} id */
async function findByIdCached(id) {
    const cached = map1.get(id)
    if (cached) { return cached }

    const session = await Model.findById(id)
    if (session) {
        const retVal = {
            id,
            createdAt: session.createdAt,
            userKey: session.getUserKey()
        }
        map1.set(id, retVal)

        return retVal
    }

    return null
}

export const Session = {
    create: createCached,
    findById
}

