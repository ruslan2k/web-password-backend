import { DataTypes } from 'sequelize'

import { sequelize } from "../modules/db/sql.js"
import { User } from "./user.js"

export const Session = sequelize.define('Session', {
    iv: {
        type: DataTypes.STRING,
        allowNull: false
    },
    encryptedUserKey: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    // Other model options go here
});

Session.belongsTo(User);


