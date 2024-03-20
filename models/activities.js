const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

module.exports = (sequelize, DataTypes) => {
    const activities = sequelize.define('activities', {
      // Model attributes are defined here
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false
      },
      club: {
        type: DataTypes.STRING,
        allowNull: false
      },
      organizers: {
        type: DataTypes.JSON,
        allowNull: false
      },
      users: {
        type: DataTypes.JSON
      },
      activityId: {
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
        modelName: 'activities', // We need to choose the model name
        freezeTableName: true
    });
    
    
    return activities
    
     
    }