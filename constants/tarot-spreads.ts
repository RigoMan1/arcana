export const spreads: ITarotSpreadObject[] = [
  {
    id: 'three-card-cluster',
    name: 'Three Card Cluster',
    description:
      'A simple and quick spread to get insight into a specific question or situation. Ideal for quick insights into past, present, and future influences.',
    focusAreas: ['Love', 'Career', 'Personal Growth'],
    estimatedTime: '1-5 minutes',
    positions: [
      { name: 'past', description: 'Influences from the past affecting the current situation.' },
      { name: 'present', description: 'Current state or situation.' },
      { name: 'future', description: 'Potential outcomes or future influences.' },
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
      { name: 'fears-hopes', description: 'Hopes and fears related to the situation.' },
      { name: 'influences', description: 'External influences affecting the situation.' },
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
      { name: 'you', description: 'Your role and perspective in the relationship.' },
      { name: 'past', description: 'Past influences on the relationship.' },
      { name: 'relationship', description: 'Current state of the relationship.' },
      { name: 'future', description: 'Potential future of the relationship.' },
      { name: 'partner', description: 'Your partner’s role and perspective in the relationship.' },
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
      { name: 'subconscious', description: 'Subconscious influences revealed by the dream.' },
      { name: 'trigger', description: 'Event or thought that triggered the dream.' },
      { name: 'core-message', description: 'The main message or theme of the dream.' },
      { name: 'call-to-action', description: 'Suggested actions based on the dream.' },
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
];
