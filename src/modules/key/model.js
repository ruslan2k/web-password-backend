import {
    randomBytes,
    createCipheriv,
    scryptSync,
    createDecipheriv
} from 'crypto'

const algorithm = 'aes-192-cbc';

/**
 * @param {string} password
*/
export async function create(password) {
    const randomKey = randomBytes(16)

    const salt = randomBytes(16).toString('hex')
    const derivedKey = scryptSync(password, salt, 24)

    const iv = randomBytes(16)
    const cipher = createCipheriv(algorithm, derivedKey, iv)
    const ciphertext = cipher.update(randomKey)
    cipher.final()

    return {
        salt,
        iv: iv.toString('hex'),
        ciphertext: ciphertext.toString('hex')
    }
}

/**
 * @param {string} password
 * @param {string} salt
 * @param {string} iv
 * @param {string} encrypted
 */
export async function getRandomKey(
    password,
    salt,
    encrypted
) {
    const derivedKey = scryptSync(password, salt, 24)
    const iv = Buffer.alloc(16, 0);
    const decipher = createDecipheriv(algorithm, derivedKey, iv)
    
    let decrypted = decipher.update(encrypted, 'hex')
    decrypted += decipher.final()
    return decrypted
}

