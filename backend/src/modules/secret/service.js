import Joi from 'joi'

import { Secret } from './model-mongodb.js'
import { Item } from '../item/model-mongodb.js'

const addSecretSchema = Joi.object({
    userId: Joi.string().required(),
    userKey: Joi.binary().required(),
    name: Joi.string().required(),
    items: Joi.array().items(
        Joi.object({
            name: Joi.string().required(),
            value: Joi.string()
        })
    )
})
export async function addSecret(userId, userKey, name, items) {
    await addSecretSchema.validateAsync({ userId, userKey, name, items })

    return Secret.create(userId, userKey, name, items)
}

/**
 * @param {string} userId
 * @param {Buffer} userKey
 */
export async function getSecretsByUserId(userId, userKey) {
    const secrets = await Secret.find({ user: userId })

    const items = await Item.find({ secret: secrets.map(({ id }) => id) })

    throw new Error('TODO')

    return items
        .map((item) => {
            const { name, secret } = Item.decrypt(item, userKey)

            return { ...item, name, secret }
        })
        .map(({ id, name, secret }) => ({ id, name, secret }))
}


