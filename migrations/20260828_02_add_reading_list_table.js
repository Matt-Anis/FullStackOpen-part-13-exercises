const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable("reading_list", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      state: {
        type: DataTypes.ENUM("read", "unread"),
        defaultValue: "unread",
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
      },
      blog_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "blogs", key: "id" },
      },
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable("reading_list");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_reading_list_state";',
    );
  },
};
