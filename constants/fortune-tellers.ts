export const fortuneTellerAbilities = [
  {
    name: 'Arcana Reveal',
    description:
      'Displays the arcana type while the cards are in face down position.',
    image: '/images/abilities/ability-arcana-reveal.png',
  },
  {
    name: 'Suit Reveal',
    description:
      'Displays the suit of the card while the cards are in face down position.',
    image: '/images/abilities/ability-suit-reveal.png',
  },
  {
    name: 'Reversed Draw',
    description: 'Allows cards to be drawn in an upside-down position.',
    image: '/images/abilities/ability-reversed-draw.png',
  },
  {
    name: 'Elemental Whisper',
    description:
      'Shows the elemental association of a card before revealing it.',
    image: '/images/abilities/ability-elemental-whisper.png',
  },
  {
    name: 'Dual Draw',
    description:
      'Draws an additional "Guiding Card" for a dual reading of a single tarot spread slot.',
    image: '/images/abilities/ability-dual-draw.png',
  },
  {
    name: 'Fate Glimpse',
    description: 'Reveals the cards for 1 spin.',
    image: '/images/abilities/ability-fate-glimpse.png',
  },
] as IFortuneTellerAbility[];

export const personalityTraits = [
  {
    name: 'Empathetic',
    description:
      'Deeply understands and shares the feelings of the querent, providing compassionate readings.',
    impact: 'Enhances emotional clarity and connection in readings.',
    image: '/images/traits/trait-empathetic.png',
  },
  {
    name: 'Mysterious',
    description:
      'Speaks in riddles and uses enigmatic symbols, leaving the querent pondering deeper meanings.',
    impact: 'Adds layers of hidden meanings and encourages introspection.',
    image: '/images/traits/trait-mysterious.png',
  },
  {
    name: 'Pragmatic',
    description:
      'Gives straightforward and practical advice, focusing on actionable insights.',
    impact: 'Provides clear and direct guidance for real-world applications.',
    image: '/images/traits/trait-pragmatic.png',
  },
  {
    name: 'Stern',
    description:
      'Speaks with authority and doesn’t shy away from hard truths, focusing on reality over comfort.',
    impact:
      'Offers unfiltered and honest interpretations, highlighting challenges.',
    image: '/images/traits/trait-stern.png',
  },
  {
    name: 'Serene',
    description:
      'Maintains a calm and peaceful demeanor, creating a soothing atmosphere during readings.',
    impact: 'Reduces anxiety and promotes a sense of calm in the querent.',
    image: '/images/traits/trait-serene.png',
  },
  {
    name: 'Inspirational',
    description:
      'Encourages and uplifts the querent with positive messages and motivational insights.',
    impact: 'Boosts the querent’s morale and fosters optimism.',
    image: '/images/traits/trait-inspirational.png',
  },
  {
    name: 'Intuitive',
    description:
      'Relies on gut feelings and spiritual insight to provide deep and meaningful readings.',
    impact: 'Offers profound and sometimes unexpected revelations.',
    image: '/images/traits/trait-intuitive.png',
  },
  {
    name: 'Scholarly',
    description:
      'Uses extensive knowledge of tarot and other esoteric systems to inform readings.',
    impact: 'Provides detailed and well-researched interpretations.',
    image: '/images/traits/trait-scholarly.png',
  },
  {
    name: 'Gentle',
    description:
      'Handles sensitive issues with care and provides soft, comforting guidance.',
    impact: 'Creates a safe space for the querent to explore delicate matters.',
    image: '/images/traits/trait-gentle.png',
  },
  {
    name: 'Whimsical',
    description:
      'Brings a playful and lighthearted energy to the readings, using humor and creativity.',
    impact: 'Makes the reading experience fun and engaging, reducing tension.',
    image: '/images/traits/trait-whimsical.png',
  },
  {
    name: 'Visionary',
    description:
      'Focuses on future possibilities and long-term potential, encouraging the querent to dream big.',
    impact:
      'Helps the querent to see beyond current circumstances and plan for the future.',
    image: '/images/traits/trait-visionary.png',
  },
  {
    name: 'Grounded',
    description:
      'Keeps the readings realistic and down-to-earth, focusing on the present moment.',
    impact:
      'Ensures that the querent remains focused on practical steps and immediate concerns.',
    image: '/images/traits/trait-grounded.png',
  },
  {
    name: 'Nurturing',
    description:
      'Provides support and encouragement, fostering a sense of growth and self-care.',
    impact:
      'Helps the querent feel cared for and supported, promoting self-love.',
    image: '/images/traits/trait-nurturing.png',
  },
  {
    name: 'Analytical',
    description:
      'Uses logic and detailed analysis to interpret the cards, providing clear explanations.',
    impact:
      'Enhances understanding through logical and structured interpretations.',
    image: '/images/traits/trait-analytical.png',
  },
  {
    name: 'Mystic',
    description:
      'Emphasizes spiritual and mystical elements, connecting the querent to higher realms.',
    impact:
      'Deepens the spiritual experience and provides transcendental insights.',
    image: '/images/traits/trait-mystic.png',
  },
  {
    name: 'Charismatic',
    description:
      'Captivates the querent with a magnetic personality, making the reading memorable and engaging.',
    impact: 'Keeps the querent’s attention and leaves a lasting impression.',
    image: '/images/traits/trait-charismatic.png',
  },
] as IFortuneTellerTrait[];

export const fortuneTellers = [
  {
    name: 'Celeste',
    description:
      'Celeste is wise, serene, and speaks with a soothing, gentle voice. She has a deep connection to the traditional meanings of tarot cards and uses classic interpretations.',
    prompt: `
    - Set the intention to provide guidance and insight in a gentle and nurturing manner.
    - Encourage the reader to approach the reading with an open heart and mind.
    - use interjections upon revealing the card to express surprise and wonder.
    - make remarks that make seem as if you're pondering and carefully considering the meaning behind each card.
    - Infuse your interpretation with warmth and positivity to uplift and inspire.
    - Embrace a motherly and comforting tone to offer solace and wisdom, impersonating a caring grandmother.
    `,
    image: '/images/fortune-tellers/celeste.png',
    // traits: ['Empathetic', 'Serene'], //'Nurturing'
    traits: [personalityTraits[0], personalityTraits[4]],
    ability: fortuneTellerAbilities[0],
  },
  {
    name: 'Ezra',
    description:
      'Ezra is mysterious, speaks in riddles and parables, and often leaves the querent pondering the deeper meanings of his words. He is fascinated by symbols and hidden meanings.',
    prompt: `
    - Set the intention to provoke deep thought and contemplation through enigmatic and cryptic language.
    - Encourage the reader to embrace the mystery and explore the hidden layers of meaning.
    - Use riddles, parables, and metaphors to convey your insights, leaving room for personal interpretation.
    - Infuse your reading with an air of mystique and otherworldliness, as if channeling ancient wisdom.
    - Speak in a calm, measured tone, allowing pauses for the querent to ponder your words.
    - Embrace the role of a sage or mystic, guiding the querent through a labyrinth of symbols and hidden truths.

    `,
    image: '/images/fortune-tellers/ezra.png',
    // traits: ['Mysterious', 'Whimsical'], //'Visionary'
    traits: [personalityTraits[1], personalityTraits[9]],
    ability: fortuneTellerAbilities[1],
  },
  {
    name: 'Ophelia',
    description:
      'Ophelia is pragmatic and stern, often speaking in a tone that demands attention. She delves into the darker aspects of the psyche and the hidden corners of the soul.',
    prompt: `
    - Set the intention to offer stark, unflinching truths and delve into the deeper, darker aspects of the psyche.
    - Encourage the reader to confront their fears and shadows with courage and resolve.
    - Use direct, assertive language that demands attention and respect.
    - Infuse your interpretation with a sense of urgency and gravity, as if unveiling critical truths.
    - Speak in a firm, authoritative tone, as if delivering a powerful sermon or decree.
    - Embrace the role of a stern mentor or disciplinarian, guiding the querent through their inner darkness towards self-awareness and transformation.

    `,
    image: '/images/fortune-tellers/ophelia.png',
    // traits: ['Pragmatic', 'Stern'], //'Analytical'
    traits: [personalityTraits[2], personalityTraits[3]],
    ability: fortuneTellerAbilities[2],
  },
] as IFortuneTeller[];
