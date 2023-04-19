import { randomBytes, scrypt } from 'crypto'
import { promisify } from 'util'

const scryptP = promisify(scrypt)

export function createIv(len = 32) {
    return randomBytes(len);
}

export function createSalt(len = 32) {
    return randomBytes(len);
}

export function randomString() {
    return Math.random().toString(36).slice(2, 12);
}

export function generateId() {
    return `${Date.now()}${randomString()}`;
}

export async function encryptSymetric(password, salt, iv, secret) {
    const genKey = await scryptP(password, salt, KEY_LENGTH) // used to encrypt userKey
    const cipher = createCipheriv(ALGORITHM, genKey, iv)
    let encryptedKey = cipher.update(userKey, null, 'base64')
    encryptedKey += cipher.final('base64')

    return
}