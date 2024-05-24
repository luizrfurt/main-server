import { boolean, object, string, TypeOf } from "zod";
import { cpf } from "cpf-cnpj-validator";

export const getUserSchema = object({
  params: object({
    userId: string({ required_error: "Parâmetro 'userId' obrigatório!" }),
  }).refine((data) => validParameter(data.userId) === true, {
    path: ["userId"],
    message: "Parâmetro 'userId' inválido ou formato incorreto!",
  }),
});

export const createUserSchema = object({
  body: object({
    name: string({
      required_error: "Campo 'name' obrigatório!",
    })
      .min(4, "Campo 'name' deve ter no mínimo 4 caracteres!")
      .max(60, "Campo 'name' deve ter no máximo 60 caracteres!"),
    email: string({
      required_error: "Campo 'email' obrigatório!",
    }).email("Campo 'email' inválido!"),
    login: string({
      required_error: "Campo 'login' obrigatório!",
    })
      .min(8, "Campo 'login' deve ter no mínimo 8 caracteres!")
      .max(20, "Campo 'login' deve ter no máximo 20 caracteres!"),
    password: string({
      required_error: "Campo 'password' obrigatório!",
    })
      .min(8, "Campo 'password' deve ter no mínimo 8 caracteres!")
      .max(32, "Campo 'password' deve ter no máximo 32 caracteres!"),
    leader: boolean({
      required_error: "Campo 'main' obrigatório!",
    }),
  }),
});

export const updateUserSchema = object({
  params: object({
    userId: string({ required_error: "Parâmetro 'userId' obrigatório!" }),
  }).refine((data) => validParameter(data.userId) === true, {
    path: ["userId"],
    message: "Parâmetro 'userId' inválido ou formato incorreto!",
  }),
  body: object({
    name: string({
      required_error: "Campo 'name' obrigatório!",
    })
      .min(4, "Campo 'name' deve ter no mínimo 4 caracteres!")
      .max(60, "Campo 'name' deve ter no máximo 60 caracteres!"),
    email: string({
      required_error: "Campo 'email' obrigatório!",
    }).email("Campo 'email' inválido!"),
    login: string({
      required_error: "Campo 'login' obrigatório!",
    })
      .min(8, "Campo 'login' deve ter no mínimo 8 caracteres!")
      .max(20, "Campo 'login' deve ter no máximo 20 caracteres!"),
    photo: string().nullable().optional(),
    password: string().optional(),
    passwordOld: string()
      .min(8, "Campo 'passwordOld' deve ter no mínimo 8 caracteres!")
      .max(32, "Campo 'passwordOld' deve ter no máximo 32 caracteres!")
      .optional(),
    passwordNew: string()
      .min(8, "Campo 'passwordNew' deve ter no mínimo 8 caracteres!")
      .max(32, "Campo 'passwordNew' deve ter no máximo 32 caracteres!")
      .optional(),
    cpf: string({
      required_error: "Campo 'cpf' obrigatório!",
    }),
    phone: string({
      required_error: "Campo 'phone' obrigatório!",
    }),
    leader: boolean({
      required_error: "Campo 'main' obrigatório!",
    }),
  })
    .refine((data) => validCpf(data.cpf) === true, {
      path: ["cpf"],
      message: "Campo 'cpf' inválido ou formato incorreto!",
    })
    .refine((data) => validPhone(data.phone) === true, {
      path: ["phone"],
      message: "Campo 'phone' inválido ou formato incorreto!",
    }),
});

export const deleteUserSchema = object({
  params: object({
    userId: string({ required_error: "Parâmetro 'userId' obrigatório!" }),
  }).refine((data) => validParameter(data.userId) === true, {
    path: ["userId"],
    message: "Parâmetro 'userId' inválido ou formato incorreto!",
  }),
});

export const validParameter = (value: string) => {
  const isNumeric = !isNaN(Number(value));
  return isNumeric;
};

export const validCpf = (value: string) => {
  const regexp = new RegExp("[0-9]{3}.[0-9]{3}.[0-9]{3}-[0-9]{2}");
  if (!regexp.test(value)) {
    return false;
  }

  return cpf.isValid(value);
};

export const validPhone = (value: string) => {
  const regexpPhone = new RegExp("\\(([0-9]{2})\\) [0-9]{4}-[0-9]{4}");
  const regexpCellPhone = new RegExp("\\(([0-9]{2})\\) 9[0-9]{4}-[0-9]{4}");
  if (!regexpPhone.test(value) && !regexpCellPhone.test(value)) {
    return false;
  }

  return true;
};

export type GetUserInput = {
  params: TypeOf<typeof getUserSchema>["params"];
};

export type CreateUserInput = {
  body: TypeOf<typeof createUserSchema>["body"];
};

export type UpdateUserInput = {
  params: TypeOf<typeof updateUserSchema>["params"];
  body: TypeOf<typeof updateUserSchema>["body"];
};

export type DeleteUserInput = {
  params: TypeOf<typeof deleteUserSchema>["params"];
};
