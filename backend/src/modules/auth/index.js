import jwt from 'jsonwebtoken'
import { randomBytes } from 'crypto'

import { User } from '../user/model.mongodb.js'
import { Password } from '../password/model-mongodb.js'
import { generateId } from '../utils.js'

import { appSecret, KEY_LENGTH } from '../config.js'
const authSessions = {}

export async function register(_parent, args, _ctx) {
    const { email, password } = args
    const user = await User.create(email, password)
    const userKey = randomBytes(KEY_LENGTH) // used to encrypt items
    await Password.create(userKey, password, user.id)

    const sessionId = generateId()
    authSessions[sessionId] = userKey
    const token = jwt.sign({ sessionId, userId: user.id }, appSecret)

    return { token }
}

export async function login(_parent, args, _ctx) {
    const { email, password } = args
    const user = await User.login(email, password)
    const passwordObj = await Password.findOne({ user: user.id })
    const userKey = await Password.decrypt(passwordObj, password)

    const sessionId = generateId()
    authSessions[sessionId] = userKey
    const token = jwt.sign({ sessionId, userId: user.id }, appSecret)

    return { token }
}

export function getUserIdAndKey(token) {
    try {
        const { userId: id, sessionId } = jwt.verify(token, appSecret)
        return { id, userKey: authSessions[sessionId] }
    } catch (ex) {
        return null
    }
}

export function checkAuth(_parent, _args, ctx) {
    const { user } = ctx
    if (!user?.userKey) {
        return { isAuthenticated: false }
    }

    return { isAuthenticated: true }
}

