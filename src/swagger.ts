require("dotenv").config();
import config from "config";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application } from "express";

const port = config.get<number>("port");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Main API",
      version: "1.0.0",
      description: "API documentation using Swagger",
    },

    servers: [
      {
        url: `http://localhost:${port}`,
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwaggerDocs = (app: Application) => {
  app.use("/api/main/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
