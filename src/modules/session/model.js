import { appSecretBuf } from '../config.js'
import {
    createIv,
    encryptWithSymmetricKey,
    decryptWithSymmetricKey
} from '../utils.js'
import { Session } from "../../entities/session.js"

/**
 * @param {Session} session 
 */
function getUserKey(session) {
    return decryptWithSymmetricKey(
        appSecretBuf,
        Buffer.from(session.iv, 'base64'),
        Buffer.from(session.encryptedUserKey, 'base64')
    )
}

const map1 = new Map()

/**
 * @param {string} userId
 * @param {Buffer} userKey
 */
async function create(userId, userKey) {
    const iv = createIv()
    const encryptedUserKey = encryptWithSymmetricKey(appSecretBuf, iv, userKey)
    const session = await Session.create({
        user: userId,
        iv: iv.toString('base64'),
        encryptedUserKey: encryptedUserKey.toString('base64')
    })

    return session
}

/**
 * @param {string} userId
 * @param {Buffer} userKey
 */
async function createCached(userId, userKey) {
    const session = await create(userId, userKey)
    const id = session.id.toString()
    map1.set(id, { id, createdAt: session.createdAt, userKey })
    
    return { id }
}

/** @param {string} id */
async function findByIdCached(id) {
    const cached = map1.get(id)
    if (cached) { return cached }

    const session = await Session.findByPk(id)
    if (session) {
        const retVal = {
            id,
            createdAt: session.createdAt,
            userKey: getUserKey(session)
        }
        map1.set(id, retVal)

        return retVal
    }

    return null
}

export const Model = {
    create: createCached,
    findById: findByIdCached
}

