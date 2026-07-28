const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable("users", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: {
            msg: "username must be a valid email address",
          },
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
    await queryInterface.createTable("blogs", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      author: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      title: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      url: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          isUrl: true,
        },
      },
      likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable("blogs");
    await queryInterface.dropTable("users");
  },
};
