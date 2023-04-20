import { randomBytes } from 'crypto'

import {
    //generateId,
    encryptWithSymmetricKey,
    decryptWithSymmetricKey,
    createIv
} from './utils.js'
import { KEY_LENGTH } from './config.js'

function test() {
    //console.log(generateId())

    const iv = createIv()
    const key = randomBytes(KEY_LENGTH)
    const secret0 = randomBytes(32)

    const x = encryptWithSymmetricKey(key, iv, secret0)

    console.log(Buffer.isBuffer(x))
    console.log('x', x.toString('base64'))
    console.log('x', x.toString('hex'))

    const secret1 = decryptWithSymmetricKey(key, iv, x)

    console.log('secret0', secret0.toString('base64'))
    console.log('secret1', secret1.toString('base64'))
}

test()

