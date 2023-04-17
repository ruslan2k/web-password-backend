import { db } from '../db/service.js'

export async function get() {
    //db.data.users.push({ username: 'x' })
    //await db.write()

    return db.data.users
}
