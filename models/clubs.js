const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

module.exports = (sequelize, DataTypes) => {
    const Club = sequelize.define('clubs', {
      // Model attributes are defined here
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false
      },
      activities: {
        type: DataTypes.JSON
      },
      ClubId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false
      },
      admins: {
        type: DataTypes.JSON,
        allowNull: false
      }
    }, {
      // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: 'clubs', // We need to choose the model name
        freezeTableName: true
    });
    
    
    return Club
    
     
    }