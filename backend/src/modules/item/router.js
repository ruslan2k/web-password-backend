import { addItem, getItemsByUserId } from './service.js'

export async function createItem(_parent, args, ctx) {
    const { user: { id: userId, userKey } } = ctx
    const { name, secret } = args

    return addItem(name, secret, userId, userKey)
}

export async function getItems(_parent, args, ctx) {
    const { user: { id: userId, userKey } } = ctx

    return getItemsByUserId(userId, userKey)
}
