const { DataTypes } = require("sequelize");
const db = require("../db");

const Product = db.define(
  "product",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isBanned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: null,
    },
    image_id: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
  },
  {
    timestamps: true,
    createdAt: true,
    updatedAt: false,
  }
);

module.exports = Product;
