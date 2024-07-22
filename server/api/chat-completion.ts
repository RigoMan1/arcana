import OpenAI from 'openai';
import { createError, defineEventHandler, readBody } from 'h3';
import { defaultOptions } from '../../constants/options';
import { MODEL_GPT_4_OMNI_MINI } from '../../constants/models';
import { useRuntimeConfig } from '#imports';
import { logitBias } from '../../constants/blacklist';

export default defineEventHandler(async (event) => {
  const { messages, model, options } = await readBody(event);

  if (!useRuntimeConfig().chatgpt.apiKey) {
    throw createError({
      statusCode: 403,
      message: 'Missing OpenAI API Key',
    });
  }

  const openai = new OpenAI({
    apiKey: useRuntimeConfig().chatgpt.apiKey,
  });

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: model || MODEL_GPT_4_OMNI_MINI,
      messages,
      logit_bias: logitBias,
      ...(options || defaultOptions),
    });

    const message = chatCompletion.choices[0].message;

    return {
      role: message.role,
      content: message.content as string,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Failed to forward request to OpenAI API',
    });
  }
});
