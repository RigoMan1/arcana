export function generateId() {
  return Math.random().toString(36).substring(7);
}

export function shuffleCards(
  TarotCards: any[],
  allowReversed: boolean = false
) {
  const shuffled = [...TarotCards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Random index from 0 to i
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
  }

  if (allowReversed) {
    shuffled.forEach((card) => {
      card.reversed = Math.random() >= 0.5; // 50/50 chance to reverse the card
    });
  }

  return shuffled;
}

export function getWorldContext() {
  const now = new Date();
  const hour = now.getHours();
  // prettier-ignore
  const timeOfDay = hour === 0 ? 'midnight' :
                    hour < 6 ? 'early morning' :
                    hour < 12 ? 'morning' :
                    hour === 12 ? 'noon' :
                    hour < 18 ? 'afternoon' :
                    hour < 21 ? 'evening' : 'night';
  return `
    day: ${now.toLocaleDateString('en-US', { weekday: 'long' })},
    date: ${now.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })},
    year: ${now.getFullYear()},
    timeOfDay: ${timeOfDay}
  `;
}
