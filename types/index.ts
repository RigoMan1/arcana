type Arcana = 'major' | 'minor';
type Suit = 'cup' | 'pentacle' | 'sword' | 'wand';
type Court = 'knight' | 'page' | 'queen' | 'king';

interface TarotCard {
  name: string;
  arcana: Arcana;
  number: number | null;
  suit: Suit | null;
  court: Court | null;
  image: string;
}

type Spreads =
  | 'three-card-cluster'
  | 'pentagram-tarot'
  | 'celtic-cross'
  | 'seven-card-horseshoe';

type ThreeCardCluster = 'past' | 'present' | 'future';
type PentagramTarot = 'earth' | 'air' | 'fire' | 'water' | 'spirit';
type CelticCross =
  | 'present'
  | 'challenge'
  | 'past'
  | 'future'
  | 'above'
  | 'below'
  | 'advice'
  | 'outcome';
type SevenCardHorseshoe =
  | 'past'
  | 'present'
  | 'challenge'
  | 'near-future'
  | 'advice'
  | 'outcome'
  | 'future';
