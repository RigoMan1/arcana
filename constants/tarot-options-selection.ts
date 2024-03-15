const chainedReadingExample = {
  type: 'chained-reading',
  current_step: 0,
  steps: [
    // ThreeCardClusterSpread Example:
    // 1. "Universe" will pick the theme, with user selected 3 cards
    {
      type: 'theme-reading',
      prompt: 'What is the theme of the reading?',
    },
    // 3. fortune teller will respond with the theme
    // 4. user will pick three cards (past,present,future)(ThreeCardClusterSpread)
    {
      type: 'card-spread-reading',
      prompt: '',
    },
    // 5. fortune teller will respond with the the reading of the three cards
    // 6. behind the scenes: user message will be sent to chatgpt to generate a "pick-3" response
    {
      type: 'pick-3',
      content: [
        // 3 questions relevant to the theme
      ],
    },
    // 7. fortune teller will respond with the pick-3 response
    // 8. done with the chained reading, send farewell message
    {
      type: 'farewell',
      prompt: 'bid farewell to the user',
    },
  ],
};

// component will hold relevant data:
// eg. selected cards, theme, pick-3 questions

// export const chainedReadingSample = {
//   type: 'chained-reading',
//   current_step: 0,
//   steps: [
//     // 1. pick 3 cards for theme reading
//     {
//       type: 'card-select', // deterimes the type of component to render
//       spread: 'three-card-cluster', // deterimes the type of spread component to render
//       // ? might have to set the spread state in the component
//     },
//     // -> watcher will nextStep() when the user has selected 3 cards

//     // 2. onSubmit: send prompt to chatgpt to generate a theme
//     // fortune teller will respond with the theme, and prompt user to pick 3 cards for their reading
//     // ui: user will click "submit" button to send the selected cards and call `nextStep()`
//     {
//       type: 'theme-reading',
//       prompt: 'What theme did the universe pick for this reading?',
//       // TODO: Convert this to an array after finishing the chained reading feature.
//       selectedCards: {
//         name: 'Three Card Cluster',
//         options: ['past', 'present', 'future'],
//         past: null,
//         present: null,
//         future: null,
//       },
//     },
//     // {
//     //   type: 'theme-assign',
//     //   theme: 'Love', //example: chat gpt will provide a theme which we will get from a themes collection in the database
//     // },
//     // 3. user will pick three cards (past,present,future)
//     {
//       type: 'card-select',
//       spread: 'three-card-cluster',
//     },
//     {
//       type: 'card-spread-reading',
//       prompt: 'What is my past, present, and future reading',
//       action: null,
//     },
//     // no prompt or action: autoamtically go to the next step
//     // {
//     //   type: 'pick-3',
//     //   prompt: 'generate pick-3 questions based on the theme',
//     //   content: [
//     //     // example: 3 questions relevant to the theme
//     //     'What insights does the past card offer?',
//     //     'How does the present card influence the theme?',
//     //     'What potential does the future card hold in relation to the theme?',
//     //   ],
//     // },
//     // {
//     //   type: 'pick-3-reading',
//     //   prompt: 'What insights does the past card offer?',
//     //   action: null,
//     // },
//     {
//       type: 'farewell',
//       prompt: 'bid farewell to the querent',
//     },
//   ],
// };

// very simple chain reading for testing
export const chainedReadingSample = {
  type: 'chained-reading',
  current_step: 0,
  steps: [
    {
      type: 'card-select',
      spread: 'three-card-cluster',
    },
    {
      type: 'theme-reading',
      prompt: 'What theme did the universe pick for this reading?',

      selectedCards: {
        name: 'Three Card Cluster',
        options: ['past', 'present', 'future'],
        past: null,
        present: null,
        future: null,
      },
    },
    {
      type: 'card-select',
      spread: 'three-card-cluster',
    },
    {
      type: 'card-spread-reading',
      prompt: 'What is my past, present, and future reading',
      selectedCards: {
        name: 'Three Card Cluster',
        options: ['past', 'present', 'future'],
        past: null,
        present: null,
        future: null,
      },
    },
    {
      type: 'farewell',
      prompt: 'bid farewell to the querent',
    },
  ],
};
