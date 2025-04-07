import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Cars = sequelize.define(
  "Cars",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "brand is required" },
      },
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "model is required" },
      },
    },
    plate: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: "car already registered",
      },
      validate: {
        notEmpty: { msg: "plate is required" },
        isValidPlate(value) {
          const plateRegex = /^[A-Z]{3}-[0-9][A-J0-9][0-9]{2}$/;
          if (!plateRegex.test(value)) {
            throw new Error("plate must be in the correct format ABC-1C34");
          }
        },
      },
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: "year is required" },
        isValidYear(value) {
          const nextYear = new Date().getFullYear() + 1;
          if (value < nextYear - 10 || value > nextYear) {
            throw new Error(
              "year must be between " + (nextYear - 10) + " and " + nextYear
            );
          }
        },
      },
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "cars",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

export default Cars;
