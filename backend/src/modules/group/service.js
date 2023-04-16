import { Group } from './model.js'

async function addGroup(name, userId) {
    const group = await Group.create({ name, userId })

    return group
}