import { promisify } from 'util'
import { pbkdf2, randomBytes } from 'crypto'
import { db } from '../db/service.js'
import { generateId } from '../utils.js'

const DEF_5K = 5000
const DEF_64 = 64
const pbkdf2P = promisify(pbkdf2)

function validateCreate(obj) {
    const { users } = db.data
    const userExists = users.find(({ email }) => email === obj.email)
    if (userExists) {
        throw new Error('Email should be unique')
    }
}

async function create(email, password) {
    validateCreate({ email, password })
    const salt = randomBytes(16).toString('hex')
    const derivedKey = await pbkdf2P(password, salt, DEF_5K, DEF_64, 'sha512')
    const user = {
        id: generateId(),
        email,
        salt,
        passwordHash: derivedKey.toString('hex')
    }
    
    db.data.users.push(user)
    await db.write();

    return { id: user.id, email };
}

async function login(email, password) {
    const user = db.data.users.find((user) => user.email === email)
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

export const User = {
    create,
    login
}