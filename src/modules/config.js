import * as dotenv from 'dotenv'

dotenv.config()

const {
    APP_SECRET,
    MY_SITE,
    MONGODB_URI,
    SQL_DB_URI,
} = process.env

if (!APP_SECRET) {
    throw new Error('Unknown Env var APP_SECRET')
}

export const appSecretBuf = Buffer.from(APP_SECRET, 'base64')

if (appSecretBuf.length !== 32) {
    throw new Error('APP_SECRET should be 32 bytes length, base64 encodded # require("crypto").randomBytes(32).toString("base64")')
}

export const appSecret = APP_SECRET
export const mySite = MY_SITE

//export const ALGORITHM = 'aes-192-cbc'
//export const KEY_LENGTH = 24
export const ALGORITHM = 'aes-256-cbc'
export const KEY_LENGTH = 32

export const mongodbUri = MONGODB_URI
export const sqlDbUri = SQL_DB_URI
export const NODE_ENV = process.env.NODE_ENV
