import AppError from "../utils/appError";
import { AppDataSource } from "../utils/dataSource";
import { Session } from "../entities/session.entity";
import { User } from "../entities/user.entity";

const sessionRepository = AppDataSource.getRepository(Session);

// Get

export const getSessionService = async (query: Object) => {
  try {
    const session = await sessionRepository.findOneBy(query);

    return session;
  } catch (err: any) {
    throw new AppError(500, `Erro ao carregar sessão: ${err.message}`);
  }
};

export const getSessionsService = async (query: Object) => {
  try {
    const sessions = await sessionRepository.find({ where: query });

    return sessions;
  } catch (err: any) {
    throw new AppError(500, `Erro ao carregar sessões: ${err.message}`);
  }
};

// Create

export const createSessionService = async (input: Partial<Session>) => {
  try {
    const session = await sessionRepository.save(
      sessionRepository.create({
        createdAt: new Date(),
        updatedAt: new Date(),
        ...input,
        active: true,
      })
    );

    return session;
  } catch (err: any) {
    throw new AppError(500, `Erro ao criar sessão: ${err.message}`);
  }
};

// Update

// Delete

export const deleteSessionsByUserService = async (user: User) => {
  try {
    const sessions = await getSessionsService({ user, active: true });

    // Atualiza setando active = false com base no id delas
    for (const sess of sessions) {
      await sessionRepository.update(sess.id, {
        active: false,
        updatedAt: new Date(),
      });
    }

    return sessions;
  } catch (err: any) {
    throw new AppError(500, `Erro ao finalizar sessão: ${err.message}`);
  }
};

export const deleteSessionsByAccessTokenService = async (
  accessToken: string
) => {
  try {
    const sessions = await getSessionsService({ accessToken, active: true });

    // Atualiza setando active = false com base no id delas
    for (const sess of sessions) {
      await sessionRepository.update(sess.id, {
        active: false,
        updatedAt: new Date(),
      });
    }

    return sessions;
  } catch (err: any) {
    throw new AppError(500, `Erro ao finalizar sessão: ${err.message}`);
  }
};

export const deleteSessionsService = async (
  user: User,
  accessToken: string
) => {
  try {
    const sessions = await getSessionsService({
      user,
      accessToken,
      active: true,
    });

    // Atualiza setando active = false com base no id delas
    for (const sess of sessions) {
      await sessionRepository.update(sess.id, {
        active: false,
        updatedAt: new Date(),
      });
    }

    return sessions;
  } catch (err: any) {
    throw new AppError(500, `Erro ao finalizar sessão: ${err.message}`);
  }
};

// Custom
