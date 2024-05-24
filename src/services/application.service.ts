import AppError from "../utils/appError";
import { AppDataSource } from "../utils/dataSource";
import { Application } from "../entities/application.entity";

const applicationRepository = AppDataSource.getRepository(Application);

// Get

export const getApplicationByIdService = async (applicationId: number) => {
  try {
    const application = await applicationRepository.findOneBy({
      id: applicationId,
    });

    return application;
  } catch (err: any) {
    throw new AppError(
      500,
      `Erro ao carregar aplicativo por Id: ${err.message}`
    );
  }
};

export const getApplicationsService = async () => {
  try {
    const applications = await applicationRepository.find();

    return applications;
  } catch (err: any) {
    throw new AppError(500, `Erro ao carregar aplicativos: ${err.message}`);
  }
};

// Create

// Update

// Delete

// Custom
