require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
import config from "config";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import nodemailer from "nodemailer";
import { AppDataSource } from "./utils/dataSource";
import { sendResponse } from "./utils/sendResponse";
import AppError from "./utils/appError";
import router from "./router";
import { setupSwaggerDocs } from "./swagger";

AppDataSource.initialize()
  .then(async () => {
    // Initialize data sources
    // ...

    const app = express();

    // TEMPLATE ENGINE
    app.set("view engine", "pug");
    app.set("views", `${__dirname}/views`);

    // MIDDLEWARE

    // Body parser
    app.use(express.json({ limit: "100mb" }));
    app.use(express.urlencoded({ extended: false }));

    // Logger
    if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

    // Cookies
    app.use(cookieParser());

    // Cors
    app.use(
      cors({
        origin: config.get<Array<string>>("origin"),
        credentials: true,
      })
    );

    // ROUTER
    app.use(router);

    // Setup Swagger Docs
    setupSwaggerDocs(app);

    // Mailer
    try {
      const credentials = await nodemailer.createTestAccount();
      console.log(credentials);
    } catch (error) {
      console.log(`Mailer error: ${error}`);
    }

    // HEALTH CHECKER
    app.get("/", async (_, res: Response) => {
      const message = `Server working — ${new Date()}`;

      const htmlResponse = `
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Health Checker</title>
    </head>
    <body>
      <div style="background-color: black">
        <h4 style="color: white; font-family: Arial, sans-serif">${message}</h4>
      </div>
    </body>
    </html>
  `;

      res.status(200).send(htmlResponse);
    });

    // UNHANDLED ROUTE
    app.all("*", (req: Request, res: Response, next: NextFunction) => {
      return sendResponse(
        req,
        res,
        404,
        `Rota ${req.originalUrl} não encontrada!`,
        []
      );
    });

    // GLOBAL ERROR HANDLER
    app.use(
      (error: AppError, req: Request, res: Response, next: NextFunction) => {
        error.status = error.status || "error";
        error.statusCode = error.statusCode || 500;

        return sendResponse(req, res, error.statusCode, error.message, []);
      }
    );

    const port = config.get<number>("port");
    app.listen(port);

    console.log(`Server started on port: ${port}`);
  })
  .catch((error) => console.log(error));
