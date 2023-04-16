import mongoose from 'mongoose'

import { init } from '../modules/db/mongodb.js'

async function main() {
    const connection = await init()

    //await mongoose.connection.db.collection('users').deleteMany({})
    //await mongoose.connection.db.collection('passwords').deleteMany({})

    connection.disconnect()
}

main()

