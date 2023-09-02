import { DataTypes } from "sequelize"

import { sequelize } from "../modules/db/sql.js"
import { User } from "./user.js"
import { appSecretBuf } from "../modules/config.js"
import {
    createIv,
    encryptWithSymmetricKey,
    decryptWithSymmetricKey
} from "../modules/utils.js"

// const schema = new Schema({
//     user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
//     iv: String,
//     encryptedUserKey: String
// }, { timestamps: true })

const Session = sequelize.define("Session", {
    iv: {
        type: DataTypes.STRING
    },
    encryptedUserKey: {
        type: DataTypes.STRING
    }
}, {});

Session.User = Session.belongsTo(User);

// schema.method("getUserKey", function() {
//     return decryptWithSymmetricKey(
//         appSecretBuf,
//         Buffer.from(this.iv, "base64"),
//         Buffer.from(this.encryptedUserKey, "base64")
//     )
// })

const map1 = new Map()

/**
 * @param {string} userId
 * @param {Buffer} userKey
 */
async function create(userId, userKey) {
    const iv = createIv()
    const encryptedUserKey = encryptWithSymmetricKey(appSecretBuf, iv, userKey)
    const session = await Model.create({
        user: userId,
        iv: iv.toString("base64"),
        encryptedUserKey: encryptedUserKey.toString("base64")
    })

    return session
}

/**
 * @param {string} userId
 * @param {Buffer} userKey
 */
async function createCached(userId, userKey) {
    const session = await create(userId, userKey)
    const id = session._id.toString()
    map1.set(id, { id, createdAt: session.createdAt, userKey })
    
    return { id }
}

/**
 * @param {string} id
 */
// function findById(id) {
//     return Model.findById(id)
// }

/** @param {string} id */
async function findByIdCached(id) {
    const cached = map1.get(id)
    if (cached) { return cached }

    const session = await Model.findById(id)
    if (session) {
        const retVal = {
            id,
            createdAt: session.createdAt,
            userKey: session.getUserKey()
        }
        map1.set(id, retVal)

        return retVal
    }

    return null
}

export const Model = {
    create: createCached,
    findById: findByIdCached
}
