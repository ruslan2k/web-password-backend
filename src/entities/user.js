import { DataTypes } from "sequelize"
import { promisify } from "util"
import { pbkdf2, randomBytes } from "crypto"

import { sequelize } from "../modules/db/sql.js"

const DEF_5K = 5000
const DEF_64 = 64
const pbkdf2P = promisify(pbkdf2)

export const User = sequelize.define("User", {
    email: { type: DataTypes.STRING, allowNull: false },

    salt: { type: DataTypes.STRING },

    passwordHash: { type: DataTypes.STRING }
}, {
    indexes: [
        {
            unique: true,
            fields: ["email"]
        },
    ]
});

async function create(email, password) {
    const salt = randomBytes(16).toString("base64")
    const derivedKey = await pbkdf2P(password, salt, DEF_5K, DEF_64, "sha512")

    return User.create({ email, salt, passwordHash: derivedKey.toString("base64") })
}

async function login(email, password) {
    const user = await User.findOne({ where: { email } })
    if (user === null) {
        throw new Error("Email or password mismatch")
    }

    const { salt, passwordHash } = user
    const derivedKey = await pbkdf2P(password, salt, DEF_5K, DEF_64, "sha512")
    if (derivedKey.toString("base64") !== passwordHash) {
        throw new Error("Email or password mismatch")
    }

    return { id: user.id, email }
}

export const Model = {
    create,
    login
}