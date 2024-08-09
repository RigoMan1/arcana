export const spreads: ITarotSpreadObject[] = [
  {
    id: 'single-card-draw',
    name: 'Single Card Draw',
    description:
      'A direct and focused spread ideal for daily insights or answering specific questions. This single card draw cuts through complexity to provide clarity and immediate understanding.',
    focusAreas: ['Daily Guidance', 'Decision Making', 'Immediate Insight'],
    estimatedTime: '1 minute',
    positions: [
      {
        name: 'insight',
        description: 'The key insight or guidance for the moment.',
      },
    ],
    components: [
      {
        name: 'single',
        positions: ['insight'],
      },
    ],
  },
  {
    id: 'three-card-cluster',
    name: 'Three Card Cluster',
    description:
      'A simple and quick spread to get insight into a specific question or situation. Ideal for quick insights into past, present, and future influences.',
    focusAreas: ['Love', 'Career', 'Personal Growth'],
    estimatedTime: '1-5 minutes',
    positions: [
      {
        name: 'past',
        description:
          'Influences from the past affecting the current situation.',
      },
      { name: 'present', description: 'Current state or situation.' },
      {
        name: 'future',
        description: 'Potential outcomes or future influences.',
      },
    ],
    components: [
      {
        name: 'arm',
        positions: ['past', 'present', 'future'],
      },
    ],
  },
  {
    id: 'celtic-cross',
    name: 'Celtic Cross',
    description:
      'A detailed spread that provides a comprehensive overview of a situation, revealing hidden influences and possible outcomes. Comprehensive spread for in-depth analysis of complex situations',
    focusAreas: ['Life Path', 'Challenges', 'Future Outlook'],
    estimatedTime: '1-10 minutes',
    positions: [
      { name: 'past', description: 'Influences from the past.' },
      { name: 'present', description: 'Current situation.' },
      { name: 'future', description: 'Possible future outcomes.' },
      { name: 'challenge', description: 'Challenges faced or to be faced.' },
      { name: 'conscious', description: 'Conscious thoughts and focus.' },
      { name: 'subconscious', description: 'Subconscious influences.' },
      { name: 'outcome', description: 'Final outcome of the situation.' },
      {
        name: 'fears-hopes',
        description: 'Hopes and fears related to the situation.',
      },
      {
        name: 'influences',
        description: 'External influences affecting the situation.',
      },
      { name: 'advice', description: 'Guidance or advice for the situation.' },
    ],
    components: [
      {
        name: 'arm',
        positions: ['past', 'present', 'future'],
      },
      {
        name: 'vertical',
        positions: ['conscious', 'subconscious', 'present', 'challenge'],
      },
      {
        name: 'staff',
        positions: ['outcome', 'fears-hopes', 'influences', 'advice'],
      },
    ],
  },
  {
    id: 'love-spread',
    name: 'Love Spread',
    description:
      'A spread focused on romantic relationships, providing insights into the dynamics and future of a partnership.',
    focusAreas: ['Love', 'Relationships', 'Emotional Connections'],
    estimatedTime: '5-10 minutes',
    positions: [
      {
        name: 'you',
        description: 'Your role and perspective in the relationship.',
      },
      { name: 'past', description: 'Past influences on the relationship.' },
      {
        name: 'relationship',
        description: 'Current state of the relationship.',
      },
      { name: 'future', description: 'Potential future of the relationship.' },
      {
        name: 'partner',
        description: 'Your partner’s role and perspective in the relationship.',
      },
    ],
    components: [
      {
        name: 'arm',
        positions: ['you', 'relationship', 'partner'],
      },
      {
        name: 'vertical',
        positions: ['past', 'relationship', 'future'],
      },
    ],
  },
  {
    id: 'dream-interpretation',
    name: 'Dream Interpretation',
    description:
      'A spread designed to delve into the meanings and messages behind your dreams, uncovering subconscious thoughts and future possibilities.',
    focusAreas: ['Dreams', 'Subconscious', 'Future Insights'],
    estimatedTime: '5-10 minutes',
    positions: [
      {
        name: 'subconscious',
        description: 'Subconscious influences revealed by the dream.',
      },
      {
        name: 'trigger',
        description: 'Event or thought that triggered the dream.',
      },
      {
        name: 'core-message',
        description: 'The main message or theme of the dream.',
      },
      {
        name: 'call-to-action',
        description: 'Suggested actions based on the dream.',
      },
    ],
    components: [
      {
        name: 'top',
        positions: ['subconscious', 'trigger'],
      },
      {
        name: 'bottom',
        positions: ['core-message', 'call-to-action'],
      },
    ],
  },
  {
    id: 'yes-no-clarity-spread',
    name: 'Yes/No Clarity Spread',
    description:
      'A five-card spread offering clarity on a yes or no question, providing a direct answer along with insights into underlying factors and additional guidance. It blends traditional yes/no indicators with deeper context.',
    focusAreas: [
      'Decision Making',
      'Clarity',
      'Guidance on Specific Questions',
    ],
    estimatedTime: '3-5 minutes',
    positions: [
      {
        name: 'query-indicator',
        description:
          'The core question or the main energy surrounding the inquiry. This card sets the tone for the reading.',
      },
      {
        name: 'hidden-factors',
        description:
          "Unseen influences or obstacles that may affect the outcome. This card reveals what is hidden from the querent's awareness.",
      },
      {
        name: 'benefits',
        description:
          'The positive aspects or advantages of the situation or decision. This card highlights the good that could come from the scenario.',
      },
      {
        name: 'additional-guidance',
        description:
          'Extra information or advice that the querent should consider. This card offers further insights that could be crucial in decision-making.',
      },
      {
        name: 'yes-no-outcome',
        description:
          "The final card that provides the answer to the question. Major arcana and even-numbered cards indicate 'Yes,' while court cards and odd-numbered cards indicate 'No.'",
      },
    ],
    components: [
      {
        name: 'arm',
        positions: [
          'query-indicator',
          'hidden-factors',
          'benefits',
          'additional-guidance',
          'yes-no-outcome',
        ],
      },
    ],
  },
];

// onboarding tarot spread to get to know the user

export const onboardingSpread: ITarotSpreadObject = {
  id: 'onboarding-spread',
  name: 'Onboarding Spread',
  description:
    'A spread designed to help you get to know yourself better and provide insights into your current state and future potential.',
  focusAreas: ['Self-Discovery', 'Personal Growth', 'Future Insights'],
  estimatedTime: '5-10 minutes',
  positions: [
    {
      name: 'you',
      description:
        'Your current state and perspective. This position reflects how you see yourself and your present mindset.',
    },
    {
      name: 'relationships',
      description: `Your relationships with others. This position highlights the dynamics and health of your interactions with people in your life.
        followup: consider asking about relationship status when the user draws this card
        `,
    },
    {
      name: 'challenges',
      description:
        'Challenges you are facing or will face. This position reveals obstacles that may be hindering your progress or growth.',
    },
    {
      name: 'work',
      description:
        'Potential future outcomes and opportunities in your professional life. This position provides insights into your career trajectory and ambitions.',
    },
    {
      name: 'personality',
      description:
        'Key traits and qualities. This position uncovers your core characteristics and how they influence your actions and decisions.',
      followUpQuestion: `How would you describe your personality, and how do you think it affects your relationships and career?`,
    },
  ],
  components: [],
};
