import AppError from "../utils/appError";
import { AppDataSource } from "../utils/dataSource";
import { Context } from "../entities/context.entity";
import { User } from "../entities/user.entity";
import { getApplicationsService } from "./application.service";
import { ContextApplication } from "../entities/contextApplication.entity";
import { getContextApplicationsByContextIdService } from "./contextApplication.service";

const contextRepository = AppDataSource.getRepository(Context);

// Get

export const getContextByIdService = async (contextId: number) => {
  try {
    const contextsWithApplications = [];
    const context = await contextRepository.findOneBy({ id: contextId });

    if (context) {
      const contextApplications =
        await getContextApplicationsByContextIdService(context.id);

      const filteredApplications = contextApplications.map((reg) => ({
        id: reg.application.id,
        contracted: reg.contracted,
      }));

      contextsWithApplications.push({
        ...context,
        applications: filteredApplications,
      });
    } else {
      return null;
    }

    return contextsWithApplications;
  } catch (err: any) {
    throw new AppError(500, `Erro ao carregar contextos: ${err.message}`);
  }
};

export const getContextsService = async () => {
  try {
    const contexts = await contextRepository.find();

    const contextsWithApplications = [];

    for (const context of contexts) {
      const contextApplications =
        await getContextApplicationsByContextIdService(context.id);

      const filteredApplications = contextApplications.map((reg) => ({
        id: reg.application.id,
        contracted: reg.contracted,
      }));

      contextsWithApplications.push({
        ...context,
        applications: filteredApplications,
      });
    }

    return contextsWithApplications;
  } catch (err: any) {
    throw new AppError(500, `Erro ao carregar contextos: ${err.message}`);
  }
};

// Create

// Update

// Delete

// Custom

export const initContextService = async (user: User) => {
  try {
    const newContext = new Context();

    newContext.code = "001";
    newContext.description = "Contexto I";
    newContext.user = user;

    await newContext.save();

    const applications = await getApplicationsService();
    for (const application of applications) {
      const newContextApplication = new ContextApplication();
      newContextApplication.contracted = false;
      newContextApplication.context = newContext;
      newContextApplication.application = application;
      newContextApplication.user = user;
      await newContextApplication.save();
    }

    const context = await getContextByIdService(newContext.id);

    return context;
  } catch (err: any) {
    throw new AppError(500, `Erro ao criar context: ${err.message}`);
  }
};
