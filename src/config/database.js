import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

if (
  process.env.DB_PASSWORD === "your_database_password" ||
  !process.env.DB_PASSWORD
) {
  console.warn(
    "⚠️ Usando senha padrão para o banco de dados! Altere isso em produção."
  );
}

const sequelize =
  process.env.DB_DIALECT === "mysql"
    ? new Sequelize(
        process.env.DB_NAME || "compasscar",
        process.env.DB_USER || "root",
        process.env.DB_PASSWORD || "",
        {
          host: process.env.DB_HOST || "localhost",
          dialect: process.env.DB_DIALECT || "mysql",
          logging: false,
        }
      )
    : new Sequelize({
        dialect: "sqlite",
        storage: "./dev.sqlite",
        logging: false,
      });

export default sequelize;

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");

    await sequelize.sync({ force: true }); // Create tables if they don't exist
    console.log("Tables created successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

connectDB();
