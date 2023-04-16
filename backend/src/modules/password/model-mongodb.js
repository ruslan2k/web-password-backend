import { Schema, model } from 'mongoose'
import { promisify } from 'util'
import { scrypt, randomBytes, createCipheriv, createDecipheriv } from 'crypto'
import { ALGORITHM, KEY_LENGTH } from '../config.js'

const scryptP = promisify(scrypt)

const schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    salt: String,
    iv: String,
    encryptedKey: String
}, { timestamps: true })

schema.virtual('id').get(function () { return this._id.toString() })
schema.virtual('userId').get(function () { return this.user._id.toString() })
schema.set('toJSON', { virtuals: true })
schema.set('toObject', { virtuals: true })

const Model = model('Password', schema)

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

    return Model.create({
        user: userId,
        salt: salt.toString('base64'),
        iv: iv.toString('base64'),
        encryptedKey
    })
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

/**
 * @param {object} obj
 */
async function findOne(obj) {
    return Model.findOne(obj)
}

export const Password = {
    create,
    decrypt,
    findOne
}

