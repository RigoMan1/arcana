export const spreads: ITarotSpreadObject[] = [
  {
    id: 'three-card-cluster',
    name: 'Tree Card Cluster',
    description:
      'A simple and quick spread to get insight into a specific question or situation. Ideal for quick insights into past, present, and future influences.',
    focusAreas: ['Love', 'Career', 'Personal Growth'],
    estimatedTime: '5-10 minutes',
    labels: ['past', 'present', 'future'],
    components: [
      {
        name: 'arm',
        labels: ['past', 'present', 'future'],
      },
    ],
  },
  {
    id: 'celtic-cross',
    name: 'Celtic Cross',
    description:
      'A detailed spread that provides a comprehensive overview of a situation, revealing hidden influences and possible outcomes. Comprehensive spread for in-depth analysis of complex situations',
    focusAreas: ['Life Path', 'Challenges', 'Future Outlook'],
    estimatedTime: '20-30 minutes',
    labels: [
      'past',
      'present',
      'future',
      'challenge',
      'conscious',
      'subconscious',
      'outcome',
      'fears-hopes',
      'influences',
      'advice',
    ],
    components: [
      {
        name: 'arm',
        labels: ['past', 'present', 'future'],
      },
      {
        name: 'vertical',
        labels: ['conscious', 'subconscious', 'present', 'challenge'],
      },
      {
        name: 'staff',
        labels: ['outcome', 'fears-hopes', 'influences', 'advice'],
      },
    ],
  },
  {
    id: 'love-spread',
    name: 'Love Spread',
    description:
      'A spread focused on romantic relationships, providing insights into the dynamics and future of a partnership.',
    focusAreas: ['Love', 'Relationships', 'Emotional Connections'],
    estimatedTime: '15-20 minutes',
    labels: ['you', 'past', 'relationship', 'future', 'partner'],
    components: [
      {
        name: 'arm',
        labels: ['you', 'relationship', 'partner'],
      },
      {
        name: 'vertical',
        labels: ['past', 'relationship', 'future'],
      },
    ],
  },
];
