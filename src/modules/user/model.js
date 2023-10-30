import { promisify } from 'util'
import { pbkdf2, randomBytes } from 'crypto'
// import { generateId } from '../utils.js'

import { User } from '../../entities/user.js'

const DEF_5K = 5000
const DEF_64 = 64
const pbkdf2P = promisify(pbkdf2)

async function validateCreate(obj) {
    const userExists = await User.findOne({ where: { email: obj.email }})

    if (userExists) {
        throw new Error('Email should be unique')
    }
}

async function create(email, password) {
    await validateCreate({ email, password })
    const salt = randomBytes(16).toString('hex')
    const derivedKey = await pbkdf2P(password, salt, DEF_5K, DEF_64, 'sha512')
    const userObj = {
        email,
        salt,
        passwordHash: derivedKey.toString('hex')
    }

    const user = await User.create(userObj)

    return { id: user.id, email };
}

async function login(email, password) {
    const user = await User.findOne({ where: { email } })
    if (!user) {
        throw new Error('Email or password mismatch')
    }

    const { salt, passwordHash } = user
    const derivedKey = await pbkdf2P(password, salt, DEF_5K, DEF_64, 'sha512')
    if (derivedKey.toString('hex') !== passwordHash) {
        throw new Error('Email or password mismatch')
    }

    return { id: user.id, email }
}

export const Model = {
    create,
    login
}