module.exports = function(sequelize, Sequelize) {

    var podCastItem = sequelize.define('podCastItem', {

        id: {
            primaryKey: true,
            type: Sequelize.INTEGER,
            allowNull: false,
            notEmpty: true
        },
        part: {
            primaryKey: true,
            type: Sequelize.STRING,
            allowNull: false,
            notEmpty: true
        },
        title: {
          type: Sequelize.STRING,
          allowNull: false,
          notEmpty: true
        },
        description: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        url: {
          type: Sequelize.STRING,
          allowNull: false
        }
    },
    {
      timestamps: true,
      paranoid: false,
      tableName: 'podCastItem'
    });

    return podCastItem;

}
