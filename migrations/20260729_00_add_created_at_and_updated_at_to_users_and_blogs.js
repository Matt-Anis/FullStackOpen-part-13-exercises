const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn("users", "created_at", {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date(),
    });
    await queryInterface.addColumn("users", "updated_at", {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date(),
    });
    await queryInterface.addColumn("blogs", "created_at", {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date(),
    });
    await queryInterface.addColumn("blogs", "updated_at", {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date(),
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn("users", "created_at");
    await queryInterface.removeColumn("users", "updated_at");
  },
};
