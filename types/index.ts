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

// Spre3ad Types
type SpreadsTypes =
  | 'three-card-cluster'
  | 'pentagram-tarot'
  | 'celtic-cross'
  | 'seven-card-horseshoe';

// Three Card Cluster
type ThreeCardClusterSlots = 'past' | 'present' | 'future';
interface IThreeCardClusterSpread {
  options: ThreeCardClusterSlots[];
  name: string;
  past: TarotCard | null;
  present: TarotCard | null;
  future: TarotCard | null;
}

// Pentagram Tarot
type PentagramTarotSlots = 'earth' | 'air' | 'fire' | 'water' | 'spirit';
interface IPentagramTarotSpread {
  options: PentagramTarotSlots[];
  name: string;
  earth: TarotCard | null;
  air: TarotCard | null;
  fire: TarotCard | null;
  water: TarotCard | null;
  spirit: TarotCard | null;
}

// Celtic Cross
type CelticCrossSlots =
  | 'present'
  | 'challenge'
  | 'past'
  | 'future'
  | 'above'
  | 'below'
  | 'advice'
  | 'outcome';
interface ICelticCrossSpread {
  options: CelticCrossSlots[];
  name: string;
  present: TarotCard | null;
  challenge: TarotCard | null;
  past: TarotCard | null;
  future: TarotCard | null;
  above: TarotCard | null;
  below: TarotCard | null;
  advice: TarotCard | null;
  outcome: TarotCard | null;
}

// Seven Card Horseshoe
type SevenCardHorseshoeSlots =
  | 'past'
  | 'present'
  | 'challenge'
  | 'near-future'
  | 'advice'
  | 'outcome'
  | 'future';

interface ISevenCardHorseshoeSpread {
  options: SevenCardHorseshoeSlots[];
  name: string;
  past: TarotCard | null;
  present: TarotCard | null;
  challenge: TarotCard | null;
  nearFuture: TarotCard | null;
  advice: TarotCard | null;
  outcome: TarotCard | null;
  future: TarotCard | null;
}

interface ITarotPrompt {
  user: string;
  system: string;
}

interface ITarotSpreadObject {
  id: string;
  name: string;
  description: string;
  focusAreas: string[];
  estimatedTime: string;
  labels: string[];
  components: {
    name: string;
    labels: string[];
  }[];
}

interface IFortuneTeller {
  name: string;
  image: string;
  description: string;
  prompt: string;
  traits: IFortuneTellerTrait[];
  ability: IFortuneTellerAbility;
}

interface IFortuneTellerTrait {
  name: string;
  description: string;
  impact: string;
  image: string;
}

interface IFortuneTellerAbility {
  name: string;
  description: string;
  image: string;
}
