import { DataTypes } from "sequelize";
import sequelize from "../config/Sequelize.js";

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  favouritePhotos: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []  // Start with empty array
  },
}, {
  tableName: "users",
  timestamps: true
});

export default User;