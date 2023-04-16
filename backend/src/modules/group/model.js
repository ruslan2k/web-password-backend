import { promisify } from 'util'
import { generateKeyPair, randomBytes, publicEncrypt } from 'crypto'
import { db } from '../db/service.js'
import { generateId } from '../utils.js'
import { KEY_LENGTH } from '../config.js'

const generateKeyPairP = promisify(generateKeyPair)

/**
 * @param {string} name
 * @param {string} userId 
 * @param {buffer} userKey
 */
async function create(name, userId, userKey) {
    const { publicKey, privateKey } = await genKeyPair()
    const symmetricKey = randomBytes(KEY_LENGTH) // used to encrypt items

    const groupObj = {
        id: generateId(),
        name,
        publicKey,
        encSymmetricKey: publicEncrypt(publicKey, symmetricKey).toString('hex')
    }
    const groupUserObj = {
        id: generateId(),
        groupId: groupObj.id,
        userId,
        isOwner: true,
        privateKey
    }
    db.data.groups.push(groupObj)
    db.data.groups_users.push(groupUserObj)
    await db.write()

    return createGroupDto(groupObj)
}

function createGroupDto({ id, name }) {
    return { id, name };
}

export function genKeyPair() {
    return generateKeyPairP('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem',
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
            cipher: 'aes-256-cbc',
            passphrase: '',
        },
    })
}

export const Group = {
    create
}

