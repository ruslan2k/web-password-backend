import { DataTypes } from 'sequelize'

import { sequelize } from "../modules/db/sql.js"

export const User = sequelize.define('User', {
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    salt: {
        type: DataTypes.STRING,
        allowNull: false
    },
    passwordHash: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    // Other model options go here
});
