import { readFileSync } from 'fs'
import { ApolloServer } from '@apollo/server'

import { register, login, checkAuth, getUserIdAndKey } from './modules/auth/index.js'
import { createSecret, getSecrets } from './modules/secret/router.js'

const typeDefs = readFileSync(new URL('./schema.graphql', import.meta.url)).toString('utf-8')
const resolvers = {
    Query: {
        secrets: getSecrets,
        checkAuth
    },
    Mutation: {
        register,
        login,
        createSecret,
    }
}

export const server = new ApolloServer({
    typeDefs,
    resolvers,
})

export async function contextFunc({ req }) {
    const { authorization } = req.headers
    if (!authorization || authorization === '') {
        return { user: null }
    }

    const user = await getUserIdAndKey(authorization.split(' ')[1])

    return { user }
}

