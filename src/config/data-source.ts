import "dotenv/config";
import { DataSource } from "typeorm";
import { CategoryEntity } from "../entities/Category.js";
import { ProductEntity } from "../entities/Product.js";

const requireEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
};

export const AppDataSource = new DataSource({
  type: "mssql",
  host: requireEnv("DB_HOST"),
  port: Number(requireEnv("DB_PORT")),
  username: requireEnv("DB_USER"),
  password: requireEnv("DB_PASS"),
  database: requireEnv("DB_NAME"),
  synchronize: true, // creates/updates tables from entities (workshop only)
  entities: [CategoryEntity, ProductEntity],
  options: { encrypt: false, trustServerCertificate: true },
});