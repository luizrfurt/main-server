import AppError from "../utils/appError";
import { AppDataSource } from "../utils/dataSource";
import { ContextApplication } from "../entities/contextApplication.entity";
import { getContextByIdService } from "./context.service";

const contextApplicationRepository =
  AppDataSource.getRepository(ContextApplication);

// Get

export const getContextApplicationsByContextIdService = async (
  contextId: number
) => {
  try {
    const contextApplications = await contextApplicationRepository.find({
      where: { context: { id: contextId } },
    });

    return contextApplications;
  } catch (err: any) {
    throw new AppError(
      500,
      `Erro ao carregar contextos de aplicativos: ${err.message}`
    );
  }
};

// Create

// Update

// Delete

// Custom

export const enableContextApplicationService = async (
  contextId: number,
  applicationId: number
) => {
  try {
    await contextApplicationRepository.update(
      { context: { id: contextId }, application: { id: applicationId } },
      { contracted: true }
    );

    const contextApplication = await getContextByIdService(contextId);

    return contextApplication;
  } catch (err: any) {
    throw new AppError(
      500,
      `Erro ao ativar aplicativo do contexto: ${err.message}`
    );
  }
};

export const disableContextApplicationService = async (
  contextId: number,
  applicationId: number
) => {
  try {
    await contextApplicationRepository.update(
      { context: { id: contextId }, application: { id: applicationId } },
      { contracted: false }
    );

    const contextApplication = await getContextByIdService(contextId);

    return contextApplication;
  } catch (err: any) {
    throw new AppError(
      500,
      `Erro ao desativar aplicativo do contexto: ${err.message}`
    );
  }
};
