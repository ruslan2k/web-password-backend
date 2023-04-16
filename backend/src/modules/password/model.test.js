import { scrypt, randomBytes, createCipheriv, createDecipheriv } from 'crypto'
import { promisify } from 'util'

import { Password } from './model.js'
import { KEY_LENGTH } from '../config.js'


(async () => {
    const password = 'a'
    const userKey = randomBytes(KEY_LENGTH) // used to encrypt items
    const passwordObj = await Password.create(userKey, password, 'userId')
    const decrypted1 = await Password.decrypt(passwordObj, password)
   
    console.log(`${userKey.toString('base64')} === ${decrypted1}`, userKey.toString('base64') === decrypted1)
})()


