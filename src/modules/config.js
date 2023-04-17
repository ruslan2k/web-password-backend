import * as dotenv from 'dotenv'

dotenv.config()

const {
    APP_SECRET,
    MY_SITE,
    MONGODB_URI
} = process.env

if (!APP_SECRET) {
    throw new Error(`Env var APP_SECRET=${APP_SECRET}`)
}

export const appSecret = APP_SECRET
export const mySite = MY_SITE
export const ALGORITHM = 'aes-192-cbc'
export const KEY_LENGTH = 24
export const mongodbUri = MONGODB_URI

