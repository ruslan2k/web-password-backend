import { DataTypes } from 'sequelize'

import { sequelize } from "../modules/db/sql.js"

export const Password = sequelize.define('Password', {
    userId: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    salt: {
        type: DataTypes.STRING,
        allowNull: false
    },
    iv: {
        type: DataTypes.STRING,
        allowNull: false
    },
    encryptedKey: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    // Other model options go here
});
