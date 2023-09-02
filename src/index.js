import { expressMiddleware } from '@apollo/server/express4'
import cors from 'cors'
import bodyParser from 'body-parser'
import express from 'express'
import morgan from 'morgan'

import { server, contextFunc } from './app.js'
import { mySite } from './modules/config.js'
import { Model as User } from './entities/user.js'
import { Model as Session } from './entities/session.js'
// import { init as initDb } from './modules/db/mongodb.js'
import { init as initDb } from './modules/db/sql.js'

const PORT = 4000
const app = express()

async function main() {
    await initDb().then(() => console.log('Successfuly connect to DB'))
    await server.start()
    app.use(morgan('combined'))
    app.use('/graphql', cors(), bodyParser.json(), expressMiddleware(server, { context: contextFunc }))
    app.use(express.static('../frontend/dist'))
    app.use((_req, res) => res.redirect(mySite))

    app.listen(PORT, () => {
        console.log(`Example app listening on port ${PORT}`)
    })
}

main()

