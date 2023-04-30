import Joi from 'joi'

import { Secret } from './model-mongodb.js'

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

    return secrets.map((secret) => {
        const { name, items } = secret.decrypt(userKey)

        return { id: secret.id, name, items }
    })
}
