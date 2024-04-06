const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define('users', {
      // Model attributes are defined here
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false
      },
      clubs: {
        type: DataTypes.JSON
      },
      activities: {
        type: DataTypes.JSON
      },
      userId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: 'users', // We need to choose the model name
        freezeTableName: true
    });
    
    
    return Users
    
     
    }