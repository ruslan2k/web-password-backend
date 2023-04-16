import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

// File path
const file = '.data/db.json'

// Configure lowdb to write to JSONFile
const adapter = new JSONFile(file)
export const db = new Low(adapter)

// Read data from JSON file, this will set db.data content
await db.read()

// If db.json doesn't exist, db.data will be null
// Use the code below to set default data
// db.data = db.data || { posts: [] } // For Node < v15.x
db.data = db.data || { 
    users: [],
    secrets: [],
    items: [],
    passwords: []
}

