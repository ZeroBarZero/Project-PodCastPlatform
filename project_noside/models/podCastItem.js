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
            type: Sequelize.INTEGER,
            allowNull: false,
            notEmpty: true
        },
        url: {
          type: Sequelize.STRING,
          allowNull: false,
          notEmpty: true
        }
    },
    {
      timestamps: true,
      paranoid: false,
      tableName: 'podCastItem'
    });

    return podCastItem;

}
