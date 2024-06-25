/* eslint-disable */

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
  reversed?: boolean;
}

interface ITarotPrompt {
  user: string;
  system: string;
}

interface ITarotSpreadObjectPosition {
  name: string;
  description: string;
}
interface ITarotSpreadObject {
  id: string;
  name: string;
  description: string;
  focusAreas: string[];
  estimatedTime: string;
  positions: ITarotSpreadObjectPosition[];
  components: {
    name: string;
    positions: string[];
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
  image: string;
  prompt: string;
}

interface IFortuneTellerAbility {
  name: string;
  description: string;
  image: string;
}
