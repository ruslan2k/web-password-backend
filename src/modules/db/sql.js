import { Sequelize } from "sequelize";

import { sqlDbUri } from "../config.js"

export const sequelize = new Sequelize(sqlDbUri, {
    dialectOptions: { connectTimeout: 60000 }
})

export async function init() {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.')

    await sequelize.sync({ force: true });
    console.log("All models were synchronized successfully.");
}


