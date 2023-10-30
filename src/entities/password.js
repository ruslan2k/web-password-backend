import { DataTypes } from 'sequelize'

import { sequelize } from "../modules/db/sql.js"
import { User } from "./user.js"

export const Password = sequelize.define('Password', {
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

Password.User = Password.belongsTo(User);
