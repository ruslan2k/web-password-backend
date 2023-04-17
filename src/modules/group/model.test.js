import {
    publicEncrypt,
    randomBytes,
    privateDecrypt
} from 'crypto'
import { Group, genKeyPair } from './model.js'
import { KEY_LENGTH } from '../config.js'

function test0() {
    const x = randomBytes(KEY_LENGTH)
    console.log(x.length)
    console.log(x.toString('base64'))
    console.log(x.toString('base64').length)
    console.log(x.toString('hex'))
    console.log(x.toString('hex').length)
}

async function test1() {
    const group = await Group.create('name', 'userId')
    console.log('group', group)
}

async function test2() {
    //const group = await Group.create('name', 'userId')
    //console.log('group', group)

    const x = '83954fcf632d7751fc5953cf8c927b60b8b8d574e400934a'
    //const x = randomBytes(KEY_LENGTH).toString('hex')
    console.log('x', x)

    const { publicKey, privateKey } = await genKeyPair()

    const enc = publicEncrypt(publicKey, x)//Buffer.from(x))
    //console.log('enc', enc.toString('hex'))

    const y = privateDecrypt({
        key: privateKey,
        passphrase: ''
    }, enc)
    console.log('y', y)//.toString('utf8'))
}

test0()

