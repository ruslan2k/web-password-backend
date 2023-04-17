import { promisify } from 'util'
import { Schema, model } from 'mongoose'
import { pbkdf2, randomBytes } from 'crypto'

const DEF_5K = 5000
const DEF_64 = 64
const pbkdf2P = promisify(pbkdf2)

const schema = new Schema({
    email: { type: String, required: true, index: true, unique: true },
    salt: String,
    passwordHash: String
}, { timestamps: true })

schema.virtual('id').get(function () { return this._id.toString() })
schema.set('toJSON', { virtuals: true })
schema.set('toObject', { virtuals: true })

const Model = model('User', schema)

async function create(email, password) {
    const salt = randomBytes(16).toString('base64')
    const derivedKey = await pbkdf2P(password, salt, DEF_5K, DEF_64, 'sha512')

    return Model.create({ email, salt, passwordHash: derivedKey.toString('base64') })
}

async function login(email, password) {
    const user = await Model.findOne({ email })
    if (!user) {
        throw new Error('Email or password mismatch')
    }

    const { salt, passwordHash } = user
    const derivedKey = await pbkdf2P(password, salt, DEF_5K, DEF_64, 'sha512')
    if (derivedKey.toString('base64') !== passwordHash) {
        throw new Error('Email or password mismatch')
    }

    return { id: user.id, email }
}

export const User = {
    create,
    login
}

