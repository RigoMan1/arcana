import OpenAI from 'openai';
import { createError, defineEventHandler, readBody } from 'h3';
import { defaultOptions } from '../../constants/options';
import {
  MODEL_GPT_TURBO_3_5_0125,
  MODEL_GPT_4_OMNI,
  type IModel,
} from '../../constants/models';
import { modelMap } from '../../utils/model-map';
import { useRuntimeConfig } from '#imports';
import { logitBias } from '../../constants/blacklist';

export default defineEventHandler(async (event) => {
  const { messages, model, options } = await readBody(event);

  // throw an error if the apiKey is not set
  if (!useRuntimeConfig().chatgpt.apiKey) {
    throw createError({
      statusCode: 403,
      message: 'Missing OpenAI API Key',
    });
  }

  // set-up configuration object and apiKEY
  const openai = new OpenAI({
    apiKey: useRuntimeConfig().chatgpt.apiKey,
  });

  try {
    const chatCompletion = await openai.chat.completions.create({
      messages,
      // model: !model ? modelMap[MODEL_GPT_4_OMNI] : modelMap[model as IModel],
      // model: modelMap[MODEL_GPT_TURBO_3_5_0125],
      model: 'gpt-4o-mini',
      ...(options || defaultOptions),
      function_call: 'auto',
      logit_bias: logitBias,
    });

    const message = chatCompletion.choices[0].message;

    return {
      role: message.role,
      content: message.content as string,
      function_call: message.function_call,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Failed to forward request to OpenAI API',
    });
  }
});
