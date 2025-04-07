import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const CarItems = sequelize.define(
  "CarItem",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "item name is required" },
      },
    },
    car_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "cars",
        key: "id",
      },
    },
  },
  {
    tableName: "cars_items",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

export default CarItems;
