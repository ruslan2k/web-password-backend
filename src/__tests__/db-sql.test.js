import { Sequelize, DataTypes } from 'sequelize'

const sequelize = new Sequelize('sqlite::memory:') // Example for sqlite

const User = sequelize.define('User', {
    // Model attributes are defined here
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING
        // allowNull defaults to true
    },
}, {
    // Other model options go here
});

User.prototype.hello = function() {
    return "Hello " + this.firstName;
}

const user = new User({ firstName: "John" })
// console.log(user)
console.log(user.hello())

try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}