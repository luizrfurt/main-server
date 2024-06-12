import { object, string, TypeOf } from "zod";

export const getContextSchema = object({
  params: object({
    contextId: string({ required_error: "Parâmetro 'contextId' obrigatório!" }),
  }).refine((data) => validParameter(data.contextId) === true, {
    path: ["userId"],
    message: "Parâmetro 'contextId' inválido ou formato incorreto!",
  }),
});

export const validParameter = (value: string) => {
  const isNumeric = !isNaN(Number(value));
  return isNumeric;
};

export type GetContextInput = {
    params: TypeOf<typeof getContextSchema>["params"];
  };