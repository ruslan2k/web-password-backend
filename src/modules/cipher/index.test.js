import { randomBytes, createCipheriv } from 'crypto'
//import { encryptSymetryc } from './index.js'
import { ALGORITHM } from '../config.js'

function encryptSymetryc(key, iv, secret) {
    const cipher = createCipheriv(ALGORITHM, key, iv)

    //let encrypted = cipher.update(secret, 'binary', 'base64')
    //encrypted += cipher.final('base64')
    //return encrypted

    var crypted = Buffer.concat([cipher.update(secret),cipher.final()]);
    return crypted;
}

function test() {
    const iv = randomBytes(16)
    const key = randomBytes(24)
    const secret = randomBytes(32)

    const x = encryptSymetryc(key, iv, secret)

    console.log(Buffer.isBuffer(iv)) 
    console.log(Buffer.isBuffer(x)) 
    console.log('x', x.toString('base64'))
    console.log('x', x.toString('hex'))
}

test()

