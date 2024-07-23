export const PRESET_QUERIES = [
  'What truths are hidden from me?',
  'What is the universe trying to tell me today?',
  // 'What is my purpose in life?',
  // 'How will my week go?',
  // 'What do I need to focus on right now?',
  'What obstacles are in my way?',
  // 'How can I improve my relationships?',
  // 'What should I be aware of in my career?',
  // 'What energies are surrounding my love life?',
  // 'How can I attract abundance and prosperity?',
  // 'What guidance can the cards offer about my health?',
  // 'What can I learn from my past experiences?',
  'What are the key influences in my life at this moment?',
  // 'What should I expect in the coming month?',
  // 'What steps can I take to achieve my personal goals?',
  'How can I improve the energy in my environment?',
  'What do I need to know in order to have a successful day?',

  // ---
  'What should I focus on to improve my personal growth this year?',
  // 'How can I better align with my career aspirations?',
  // 'What are the challenges I might face in my relationships, and how can I overcome them?',
  // 'What can I do to attract abundance and prosperity into my life?',
  // 'What lessons do I need to learn to advance my spiritual journey?',
  // 'What should I know about an upcoming decision or transition in my life?',
  // 'How can I improve my financial situation?',
  // 'What is the state of my health, and what steps should I take to enhance it?',
  // 'How can I foster more meaningful friendships in my life?',
];

// get 4 random queries
export function getRandomQueries(count: number = 4): string[] {
  const randomQueries: string[] = [];
  while (randomQueries.length < count) {
    const query =
      PRESET_QUERIES[Math.floor(Math.random() * PRESET_QUERIES.length)];
    if (!randomQueries.includes(query)) {
      randomQueries.push(query);
    }
  }
  return randomQueries;
}
