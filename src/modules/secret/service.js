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
    const secretsObj = secrets.map((secret) => {
        const { name } = secret.decrypt(userKey)
        return { id: secret.id, name, items: [] }
    })
        .reduce((accum, current) => {
            accum[current.id] = current
            return accum
        }, {})

    const items = await Item.find({ secret: secrets.map(({ id }) => id) }).populate('secret')

    items.forEach((item) => {
        const { name, value } = item.decrypt(userKey)
        if (item.secret.id in secretsObj) {
            secretsObj[item.secret.id].items.push({ id: item.id, name: name.toString(), value: value.toString() })
        }
    })

    return Object.values(secretsObj)
}
