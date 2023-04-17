import { addGroup } from './service.js'

export async function createGroup(_parent, args, ctx) {
    const { user: { id: userId } } = ctx
    const { name } = args

    return addGroup(name, userId)
}

export async function getGroups(_parent, args, ctx) {
    const { user: { id: userId, userKey } } = ctx

    return getItemsByUserId(userId, userKey)
}

