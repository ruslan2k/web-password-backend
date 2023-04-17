import { Item } from './model.js'

/**
 * @param {string} name
 * @param {string} secret
 */
export async function addItem(name, secret, userId, userKey) {
    const item = await Item.create(name, secret, userId, userKey)

    return { id: item.id, name }
}

/**
 * @param {string} userId
 * @param {string} userKey
 */
export async function getItemsByUserId(userId, userKey) {
    const items = await Item.find((item) => item.userId === userId)

    return items
        .map((item) => {
            const { name, secret } = Item.decrypt(item, userKey)

            return { ...item, name, secret }
        })
        .map(({ id, name, secret }) => ({ id, name, secret }))
}