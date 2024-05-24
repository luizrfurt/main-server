import AppError from "../utils/appError";
import { AppDataSource } from "../utils/dataSource";
import { Log } from "../entities/log.entity";

const logRepository = AppDataSource.getRepository(Log);

// Get

// Create

export const createLogService = async <T>(
  ip: string,
  user: string,
  route: string,
  data: T[]
) => {
  try {
    const log = await logRepository.save(
      logRepository.create({
        ip,
        user,
        route,
        data: JSON.stringify(data),
      })
    );

    return log;
  } catch (err: any) {
    throw new AppError(500, `Erro ao criar log: ${err.message}`);
  }
};

// Update

// Delete

// Custom
