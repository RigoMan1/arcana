export const MODEL_TEXT_DAVINCI_002 = 'text-davinci-002';
export const MODEL_TEXT_DAVINCI_003 = 'text-davinci-003';
export const MODEL_GPT_TURBO_3_5 = 'gpt-3.5-turbo';
export const MODEL_GPT_TURBO_3_5_0301 = 'gpt-3.5-turbo-0301';
export const MODEL_GPT_TURBO_3_5_1106 = 'gpt-3.5-turbo-1106';
export const MODEL_GPT_TURBO_3_5_0125 = 'gpt-3.5-turbo-0125'; // newest
export const MODEL_GPT_4 = 'gpt-4';
export const MODEL_GPT_4_0314 = 'gpt-4-0314';
export const MODEL_GPT_4_0613 = 'gpt-4-0613';
export const MODEL_GPT_4_32k = 'gpt-4-32k';
export const MODEL_GPT_4_32k_0314 = 'gpt-4-32k-0314';
export const MODEL_GPT_4_32k_0613 = 'gpt-4-32k-0613';
// --- new models ---
export const MODEL_GPT_4_1106_VISION_PREVIEW = 'gpt-4-1106-vision-preview';
export const MODEL_GPT_4_VISION_PREVIEW = 'gpt-4-vision-preview';
export const MODEL_GPT_4_1106_PREVIEW = 'gpt-4-1106-preview';
export const MODEL_GPT_4_TURBO_PREVIEW = 'gpt-4-turbo-preview';
export const MODEL_GPT_4_0125_PREVIEW = 'gpt-4-0125-preview';
export const MODEL_GPT_4_OMNI = 'gpt-4o'; // newest

export type IModel =
  | typeof MODEL_TEXT_DAVINCI_002
  | typeof MODEL_TEXT_DAVINCI_003
  | typeof MODEL_GPT_TURBO_3_5
  | typeof MODEL_GPT_TURBO_3_5_0301
  | typeof MODEL_GPT_TURBO_3_5_1106
  | typeof MODEL_GPT_TURBO_3_5_0125
  | typeof MODEL_GPT_4
  | typeof MODEL_GPT_4_0314
  | typeof MODEL_GPT_4_0613
  | typeof MODEL_GPT_4_32k
  | typeof MODEL_GPT_4_32k_0314
  | typeof MODEL_GPT_4_32k_0613
  | typeof MODEL_GPT_4_1106_VISION_PREVIEW
  | typeof MODEL_GPT_4_VISION_PREVIEW
  | typeof MODEL_GPT_4_1106_PREVIEW
  | typeof MODEL_GPT_4_TURBO_PREVIEW
  | typeof MODEL_GPT_4_0125_PREVIEW
  | typeof MODEL_GPT_4_OMNI;
