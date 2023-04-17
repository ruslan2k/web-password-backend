import mongoose from 'mongoose'
import { mongodbUri } from '../config.js'

export function init() {
    return mongoose.connect(mongodbUri)
}

//init().then(() => console.log('Success connect to MongoDB'))


