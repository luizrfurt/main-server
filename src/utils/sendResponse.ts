import { Request, Response } from "express";
import { createLogService } from "../services/log.service";

export const sendResponse = async <T>(
  req: Request,
  res: Response,
  statusCode: number,
  message: string,
  data: T[]
) => {
  let status;
  if (`${statusCode}`.startsWith("5")) {
    status = "error";
  } else if (`${statusCode}`.startsWith("4")) {
    status = "fail";
  } else if (`${statusCode}`.startsWith("2")) {
    status = "success";
  } else {
    status = "unknown";
  }

  // IP do cliente
  const clientAddress: string | string[] | undefined =
    req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  let ip: string = "";
  if (Array.isArray(clientAddress)) {
    ip = clientAddress[0];
  } else if (typeof clientAddress === "string") {
    ip = clientAddress;
  }
  if (ip === "::1") {
    ip = "127.0.0.1";
  } else {
    ip = ip.slice(7);
  }

  // Current datetime
  const now = new Date();

  /***
   * Log
   */
  const ipRequest = ip;
  const userRequest =
    req.originalUrl.indexOf("auth") > 1 ? data[0] : res.locals.user;
  const routeAccesed = req.originalUrl;
  const dataRequest = data;

  // Salva log
  const log = await createLogService(
    ipRequest,
    userRequest,
    routeAccesed,
    dataRequest
  );

  res.status(statusCode).json({
    status,
    message,
    data,
    meta: { ip, now },
  });
};
