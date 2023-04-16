import { createDecipheriv, createCipheriv } from 'crypto'
import { ALGORITHM } from '../config.js'

export function encryptSymetryc(key, iv, secret) {
    const cipher = ereateCipheriv(ALGORITHM, key, iv)
    let encrypted = cipher.update(secret, 'utf8', 'hex')
    encrypted += cipher.final('hex')

    return encrypted
}

export function decrypt(iv, key, encrypted) {
    const decipher = createDecipheriv(ALGORITHM, key, iv)
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')

    return decrypted
}