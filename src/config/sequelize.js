import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.USER,
  process.env.PASSWORD,
  {
    host: process.env.HOST,
    port: process.env.DBPORT,
    dialect: "postgres",
    logging: false,
    pool: {
      min: 0,
      max: 5,
      idle: 10000,
      acquire: 30000,
    },
    benchmark: false, // Disable query benchmarking
  }
);

export default sequelize;