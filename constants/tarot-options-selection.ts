import { efficientCommunication, testPrompt } from '@/constants/systemPrompts';

// very simple chain reading for testing
export const chainedReadingSample = {
  type: 'chained-reading',
  current_step: 0,
  steps: [
    {
      type: 'card-select',
      spread: 'universal-guidance-spread',
    },
    {
      type: 'tarot-reading',
      prompt: {
        system: efficientCommunication,
        user: 'I am open to receiving the guidance and wisdom the universe has for me. provide me with a theme for this reading',
      },
      isTypingMessage:
        'Take a few deep breaths to clear your mind of any specific questions or preconceived ideas. Allow your thoughts to settle, creating a space of openness and receptivity.',
    },
    {
      type: 'card-select',
      spread: 'three-card-cluster',
    },
    {
      type: 'tarot-reading',
      prompt: {
        system: testPrompt,
        user: 'What is my past, present, and future reading',
      },
    },
    // {
    //   type: 'pick-3',
    //   prompt: {
    //     system: 'generate pick-3 questions based on the theme',
    //     user: '',
    //   },
    //   content: [
    //     // example: 3 questions relevant to the theme
    //     'What insights does the past card offer?',
    //     'How does the present card influence the theme?',
    //     'What potential does the future card hold in relation to the theme?',
    //   ],
    // },
    {
      type: 'farewell',
      prompt: {
        system: 'bid farewell to the querent',
        user: 'Goodbye',
      },
    },
  ],
};
