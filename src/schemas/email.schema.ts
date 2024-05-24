import { object, string, TypeOf } from "zod";

export const emailConfirmVerifyTokenSchema = object({
  params: object({
    token: string({
      required_error: "Parâmetro 'token' obrigatório!",
    }),
  }),
});

export type ConfirmVerifyTokenInput = {
  params: TypeOf<typeof emailConfirmVerifyTokenSchema>["params"];
};
