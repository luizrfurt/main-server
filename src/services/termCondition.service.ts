import AppError from "../utils/appError";
import { AppDataSource } from "../utils/dataSource";
import { TermCondition } from "../entities/termCondition.entity";

const termConditionRepository = AppDataSource.getRepository(TermCondition);

// Get

export const getTermsConditionsService = async () => {
  try {
    const termConditions = await termConditionRepository.find();

    return termConditions;
  } catch (err: any) {
    throw new AppError(
      500,
      `Erro ao carregar termos e condições: ${err.message}`
    );
  }
};

// Create

// Update

// Delete

// Custom
