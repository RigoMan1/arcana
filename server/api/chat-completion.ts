import OpenAI from 'openai';
import { createError, defineEventHandler, readBody } from 'h3';
import { defaultOptions } from '../../constants/options';
import { MODEL_GPT_TURBO_3_5_0125, type IModel } from '../../constants/models';
import { modelMap } from '../../utils/model-map';
import { useRuntimeConfig } from '#imports';

// Define the function schema
const funcGetUsersName = {
  name: 'get_users_name',
  description: `
  - use this function to get the user's name from the conversation
  - always invoke this function if !get_users_name command is present in the prompt.
  `,
  parameters: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'The name of the user',
      },
    },
    required: ['name'],
  },
};

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
      model: !model
        ? modelMap[MODEL_GPT_TURBO_3_5_0125]
        : modelMap[model as IModel],
      ...(options || defaultOptions),
      functions: [funcGetUsersName],
      function_call: 'auto',
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
