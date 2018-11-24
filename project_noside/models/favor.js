module.exports = function(sequelize, Sequelize) {

    var Favor = sequelize.define('favor', {
  
        uid: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false,
            notEmpty: true
        },
        pid: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false,
            notEmpty: true
        },
        value: {
            type: Sequelize.INTEGER,
            allowNull: false,
            notEmpty: true
        }
        
    },
    {
      timestamps: true,
      paranoid: false,
      tableName: 'favors'
    });
  
    return Favor;
  
  }