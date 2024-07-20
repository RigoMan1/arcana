// constants priority values
const PRIORITY_HIGH = -100;
const PRIORITY_MID = -75;
const PRIORITY_LOW = -50;

// foretells a triumphant outcome
const phrase1 = [1348, 83, 6572, 264, 92906, 28022, 15632];

const highPriorityWords = [
  1985,
  2908,
  11410,
  234,
  253,
  19775,
  22651,
  61876,
  70205,
  950,
  68608,
  17401,
  4720,
  70531,
  87435,
  82845,
  1060,
  77,
  62387,
  582,
  25489,
  31087,
  52402,
  958,
  1387,
  74510,
  ...phrase1,
];
const midPriorityWords = [
  12481, 1374, 11879, 31518, 38586, 84911, 4822, 33519, 304, 17102, 47970,
];

const lowPriorityWords = [97112, 25237, 4333, 89986, 13488, 1099, 4535];

export const logitBias: Record<string, number> = {};

highPriorityWords.forEach((tokenId) => (logitBias[tokenId] = PRIORITY_HIGH)); // Strong negative bias
midPriorityWords.forEach((tokenId) => (logitBias[tokenId] = PRIORITY_MID)); // Moderate negative bias
lowPriorityWords.forEach((tokenId) => (logitBias[tokenId] = PRIORITY_LOW)); // Slight negative bias
