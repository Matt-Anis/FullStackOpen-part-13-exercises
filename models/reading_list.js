const { Model, DataTypes } = require("sequelize");

const { sequelize } = require("../util/db");

class ReadingList extends Model {}

ReadingList.init(
  {
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
  },
  {
    sequelize,
    underscored: true,
    modelName: "reading_list",
  },
);

module.exports = ReadingList;
