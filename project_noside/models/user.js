module.exports = function(sequelize, Sequelize) {

    var User = sequelize.define('user', {

        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        username: {
            type: Sequelize.STRING,
            validate: {
                isEmail: true
            },
            allowNull: false,
            notEmpty: true,
            unique: true
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            notEmpty: true
        },
        from: {
          type: Sequelize.STRING,
          allowNull: false,
          notEmpty: true,
          defaultValue: 'local'
        },
        isVerificated: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        }
    },
    {
      timestamps: true,
      paranoid: true,
      tableName: 'users'
    });

    return User;

}
