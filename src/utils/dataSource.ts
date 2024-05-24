require("dotenv").config();
import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";
import config from "config";
import { SeederOptions } from "typeorm-extension";
import { MainSeeder } from "../seeds/main.seed";

const postgresConfig = config.get<{
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  schema: string;
}>("postgresConfig");

const options: DataSourceOptions & SeederOptions = {
  ...postgresConfig,
  type: "postgres",
  synchronize: false,
  logging: false,
  entities: ["src/entities/**/*.entity{.ts,.js}"],
  migrations: ["src/migrations/**/*{.ts,.js}"],
  subscribers: ["src/subscribers/**/*{.ts,.js}"],
  seeds: [MainSeeder],
};

export const AppDataSource = new DataSource(options);
