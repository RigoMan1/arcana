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
