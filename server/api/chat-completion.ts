import OpenAI from 'openai';
import { createError, defineEventHandler, readBody } from 'h3';
import { defaultOptions } from '../../constants/options';
import { MODEL_GPT_TURBO_3_5_0125, type IModel } from '../../constants/models';
import { modelMap } from '../../utils/model-map';
import { useRuntimeConfig } from '#imports';

export default defineEventHandler(async (event) => {
  // destructing the data that comes from the request
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

  /**
   * Create request options object
   * @description if the model is not defined by the user it will be used the default one - gpt-3.5-turbo
   */
  const requestOptions = {
    messages,
    model: !model
      ? modelMap[MODEL_GPT_TURBO_3_5_0125]
      : modelMap[model as IModel],
    ...(options || defaultOptions),
  };

  /**
   * @return response
   */
  try {
    const chatCompletion = await openai.chat.completions.create(requestOptions);
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
