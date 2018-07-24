module.exports = function(sequelize, Sequelize) {

    var podCast = sequelize.define('podCast', {

        id: {
            primaryKey: true,
            type: Sequelize.INTEGER,
            allowNull: false,
            notEmpty: true,
            autoIncrement: true
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false,
            notEmpty: true
        },
        author: {
            type: Sequelize.STRING,
            allowNull: false,
            notEmpty: true
        },
        description: {
          type: Sequelize.STRING,
          allowNull: false,
          notEmpty: true
        }
    },
    {
      timestamps: true,
      paranoid: false,
      tableName: 'podCast'
    });

    return podCast;

}
