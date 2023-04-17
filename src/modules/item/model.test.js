import { Item } from './model.js'

export async function test1() {
    const name = 'name'
    const secret = 'secret'
    const userId = '16770945951493dtway93tf2'
    const userKey = '05f74be5bc434bd9ed0eb98b9352e601'
    const item = await Item
        .create(name, secret, userId, userKey)

    console.log('item', item)

    return {
        id: item.id,
        name
    }
}

test1()