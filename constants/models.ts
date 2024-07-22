export const MODEL_GPT_TURBO_3_5_0125 = 'gpt-3.5-turbo-0125';
export const MODEL_GPT_4_OMNI = 'gpt-4o';
export const MODEL_GPT_4_OMNI_MINI = 'gpt-4o-mini';

export type IModel =
  | typeof MODEL_GPT_TURBO_3_5_0125
  | typeof MODEL_GPT_4_OMNI
  | typeof MODEL_GPT_4_OMNI_MINI;
