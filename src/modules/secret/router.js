import { GraphQLError } from 'graphql'
import { addSecret, getSecretsByUserId } from './service.js'

export async function createSecret(_parent, args, ctx) {
    if (!ctx.user?.userKey) {
        throw new GraphQLError('Auth required', { extensions: { code: 'FORBIDDEN' } })
    }
    const { user: { id: userId, userKey } } = ctx
    const { name, items } = args

    return addSecret(userId, userKey, name, items)
}

export async function getSecrets(_parent, args, ctx) {
    if (!ctx.user?.userKey) {
        throw new GraphQLError('Auth required', { extensions: { code: 'FORBIDDEN' } })
    }
    const { user: { id: userId, userKey } } = ctx

    return getSecretsByUserId(userId, userKey)
}

