import { DataTypes } from "sequelize";
import sequelize from "../config/Sequelize.js";

const Auth = sequelize.define(
  "Auth",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profileImage: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    tableName: "Auth",
    timestamps: true,
  }
);

export default Auth;
