import { object, string, TypeOf } from "zod";

export const enabledContextApplicationSchema = object({
  params: object({
    contextId: string({ required_error: "Parâmetro 'contextId' obrigatório!" }),
    applicationId: string({
      required_error: "Parâmetro 'applicationId' obrigatório!",
    }),
  })
    .refine((data) => validParameter(data.contextId) === true, {
      path: ["contextId"],
      message: "Parâmetro 'contextId' inválido ou formato incorreto!",
    })
    .refine((data) => validParameter(data.applicationId) === true, {
      path: ["applicationId"],
      message: "Parâmetro 'applicationId' inválido ou formato incorreto!",
    }),
});

export const disableContextApplicationSchema = object({
  params: object({
    contextId: string({ required_error: "Parâmetro 'contextId' obrigatório!" }),
    applicationId: string({
      required_error: "Parâmetro 'applicationId' obrigatório!",
    }),
  })
    .refine((data) => validParameter(data.contextId) === true, {
      path: ["contextId"],
      message: "Parâmetro 'contextId' inválido ou formato incorreto!",
    })
    .refine((data) => validParameter(data.applicationId) === true, {
      path: ["applicationId"],
      message: "Parâmetro 'applicationId' inválido ou formato incorreto!",
    }),
});

export const validParameter = (value: string) => {
  const isNumeric = !isNaN(Number(value));
  return isNumeric;
};

export type EnableContextApplicationInput = {
  params: TypeOf<typeof enabledContextApplicationSchema>["params"];
};

export type DisableContextApplicationInput = {
  params: TypeOf<typeof disableContextApplicationSchema>["params"];
};
