import { object, string, TypeOf } from "zod";

export const validateSessionSubSchema = object({
  body: object({
    accessToken: string({
      required_error: "Campo 'accessToken' obrigatório!",
    }),
  }),
});

export type ValidateSessionSubInput = {
  body: TypeOf<typeof validateSessionSubSchema>["body"];
};
