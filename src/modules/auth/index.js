import jwt from 'jsonwebtoken'
import { randomBytes } from 'crypto'

import { Model as User } from '../user/model.js'
import { Model as Session } from '../session/model.js'
import { Model as Password } from '../password/model.js'
import { appSecret, KEY_LENGTH } from '../config.js'

export async function register(_parent, args, _ctx) {
    const { email, password } = args
    const { id: userId } = await User.create(email, password)
    const userKey = randomBytes(KEY_LENGTH) // used to encrypt items
    await Password.create(userKey, password, userId)
    const { id: sessionId } = await Session.create(userId, userKey)

    const token = jwt.sign({ sessionId, userId }, appSecret)

    return { token }
}

export async function login(_parent, args, _ctx) {
    const { email, password } = args
    const { id: userId } = await User.login(email, password)
    const passwordObj = await Password.findOne({ userId: userId })

    console.error("passwordObj", passwordObj) // = await Password.findOne({ userId: userId })

    const userKey = await Password.decrypt(passwordObj, password)

    const { id: sessionId } = await Session.create(userId, userKey)
    const token = jwt.sign({ sessionId, userId }, appSecret)

    return { token }
}

export async function getUserIdAndKey(token) {
    try {
        const { userId: id, sessionId } = jwt.verify(token, appSecret)

        const session = await Session.findById(sessionId)
        if (session) {
            return { id, userKey: session.userKey }
        }

        return { id, userKey: null }
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

