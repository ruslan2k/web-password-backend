import { Sequelize } from "sequelize";

import { sqlDbUri } from "../config.js"

// export const sequelize = new Sequelize(sqlDbUri, {
//     dialectOptions: { connectTimeout: 60000 }
// })

const defaultOptions = {
    dialect: 'sqlite',
    storage: './.data/database.sqlite'
}

export let sequelize = new Sequelize(defaultOptions)

export async function init(options = defaultOptions) {
    sequelize = new Sequelize(options)

    await sequelize.authenticate();
    console.log('Connection has been established successfully.')

    await sequelize.sync({ /* force: true */ });
    console.log("All models were synchronized successfully.");
}

