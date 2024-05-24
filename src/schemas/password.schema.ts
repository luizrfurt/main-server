import { object, string, TypeOf } from "zod";

export const passwordResetSendSchema = object({
  body: object({
    email: string({
      required_error: "Campo 'email' obrigatório!",
    }).email("Campo 'email' inválido!"),
  }),
});

export const passwordResetVerifyTokenSchema = object({
  params: object({
    token: string({
      required_error: "Parâmetro 'token' obrigatório!",
    }),
  }),
});

export const passwordResetChangeSchema = object({
  params: object({
    token: string({
      required_error: "Parâmetro 'token' obrigatório!",
    }),
  }),
  body: object({
    password: string({
      required_error: "Campo 'password' obrigatório!",
    })
      .min(8, "Campo 'password' deve ter no mínimo 8 caracteres!")
      .max(32, "Campo 'password' deve ter no máximo 32 caracteres!"),
  }),
});

export type ResetSendSchemaInput = {
  body: TypeOf<typeof passwordResetSendSchema>["body"];
};
export type ResetVerifyTokenInput = {
  params: TypeOf<typeof passwordResetVerifyTokenSchema>["params"];
};
export type ResetChangeInput = {
  params: TypeOf<typeof passwordResetChangeSchema>["params"];
  body: TypeOf<typeof passwordResetChangeSchema>["body"];
};
