import config from "config";
import bcrypt from "bcryptjs";
import AppError from "../utils/appError";
import { AppDataSource } from "../utils/dataSource";
import { signJwt } from "../utils/jwt";
import { User } from "../entities/user.entity";

const userRepository = AppDataSource.getRepository(User);

// Get

export const getUserByIdService = async (userId: number) => {
  try {
    const user = await userRepository.findOneBy({ id: userId });

    return user;
  } catch (err: any) {
    throw new AppError(500, `Erro ao carregar usuário por Id: ${err.message}`);
  }
};

export const getUserByQueryService = async (query: Object) => {
  try {
    const user = await userRepository.findOneBy(query);

    return user;
  } catch (err: any) {
    throw new AppError(500, `Erro ao carregar usuário: ${err.message}`);
  }
};

export const getUsersService = async () => {
  try {
    const users = await userRepository.find();

    return users;
  } catch (err: any) {
    throw new AppError(500, `Erro ao carregar usuários: ${err.message}`);
  }
};

// Create

export const createUserService = async (input: Partial<User>) => {
  try {
    const user = await userRepository.save(userRepository.create({ ...input }));

    return user;
  } catch (err: any) {
    throw new AppError(500, `Erro ao criar usuário: ${err.message}`);
  }
};

// Update

export const updateUserService = async (
  updated: User,
  input: Partial<User>
) => {
  try {
    await userRepository.update(updated.id, input);

    const user = await getUserByIdService(updated.id);

    return user;
  } catch (err: any) {
    throw new AppError(500, `Erro ao atualizar usuário: ${err.message}`);
  }
};

// Delete

export const deleteUserService = async (deleted: User) => {
  try {
    await userRepository.update(deleted.id, { active: false });

    const user = await getUserByIdService(deleted.id);

    return user;
  } catch (err: any) {
    throw new AppError(500, `Erro ao inativar usuário: ${err.message}`);
  }
};

// Custom

// Sign access and Refresh Tokens
export const signTokensService = async (user: User) => {
  try {
    // Create Access and Refresh tokens
    const accessTokenExpiresInMinutes = config.get<number>(
      "accessTokenExpiresIn"
    );
    const accessTokenExpiresIn = new Date();
    accessTokenExpiresIn.setMinutes(
      accessTokenExpiresIn.getMinutes() + accessTokenExpiresInMinutes
    );
    const accessToken = signJwt({ sub: user.id }, "accessTokenPrivateKey", {
      expiresIn: `${accessTokenExpiresInMinutes}m`,
    });

    let refreshTokenExpiresInMinutes = config.get<number>(
      "refreshTokenExpiresIn"
    );
    const refreshTokenExpiresIn = new Date();
    refreshTokenExpiresIn.setMinutes(
      refreshTokenExpiresIn.getMinutes() + refreshTokenExpiresInMinutes
    );
    const refreshToken = signJwt({ sub: user.id }, "refreshTokenPrivateKey", {
      expiresIn: `${refreshTokenExpiresInMinutes}m`,
    });

    const tokens = {
      accessToken,
      accessTokenExpiresIn,
      refreshToken,
      refreshTokenExpiresIn,
    };

    return tokens;
  } catch (err: any) {
    throw new AppError(500, `Erro ao assinar tokens: ${err.message}`);
  }
};

export const formatDateExpiresInService = async (date: Date) => {
  try {
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);

    const currentDateTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;

    return currentDateTime;
  } catch (err: any) {
    throw new AppError(500, `Erro ao formatar data: ${err.message}`);
  }
};

export const comparePasswords = async (
  candidatePassword: string,
  hashedPassword: string
) => {
  return await bcrypt.compare(candidatePassword, hashedPassword);
};
