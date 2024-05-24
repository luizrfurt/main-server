import { object, string, TypeOf } from "zod";

export const registerUserSchema = object({
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
  }),
});

export const loginUserSchema = object({
  body: object({
    login: string({
      required_error: "Campo 'login' obrigatório!",
    })
      .min(8, "Campo 'login' deve ter no mínimo 8 caracteres!")
      .max(32, "Campo 'login' deve ter no máximo 32 caracteres!"),
    password: string({
      required_error: "Campo 'password' obrigatório!",
    })
      .min(8, "Campo 'password' deve ter no mínimo 8 caracteres!")
      .max(32, "Campo 'password' deve ter no máximo 32 caracteres!"),
  }),
});

export type RegisterUserInput = {
  body: TypeOf<typeof registerUserSchema>["body"];
};
export type LoginUserInput = {
  body: TypeOf<typeof loginUserSchema>["body"];
};
