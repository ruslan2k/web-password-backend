import { randomBytes, createCipheriv, createDecipheriv } from 'crypto'
import { ALGORITHM } from './config.js'

export function createIv(len = 16) {
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

//export async function encryptSymetric(password, salt, iv, secret) {
//    const genKey = await scryptP(password, salt, KEY_LENGTH) // used to encrypt userKey
//    const cipher = createCipheriv(ALGORITHM, genKey, iv)
//    let encrypted = cipher.update(secret, null, 'base64')
//    encrypted += cipher.final('base64')
//
//    return encrypted
//}

/**
 * @param {Buffer} key
 * @param {Buffer} iv
 * @param {Buffer} secret
 */
export function encryptWithSymmetricKey(key, iv, secret) {
    const cipher = createCipheriv(ALGORITHM, key, iv)
    const encrypted = Buffer.concat([cipher.update(secret), cipher.final()])

    return encrypted
}

/**
 * @param {Buffer} key
 * @param {Buffer} iv
 * @param {Buffer} encrypted
 */
export function decryptWithSymmetricKey(key, iv, encrypted) {
    const decipher = createDecipheriv(ALGORITHM, key, iv)
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()])

    return decrypted
}

