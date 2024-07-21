type AstrologicalSign =
  | 'Aries'
  | 'Taurus'
  | 'Gemini'
  | 'Cancer'
  | 'Leo'
  | 'Virgo'
  | 'Libra'
  | 'Scorpio'
  | 'Sagittarius'
  | 'Capricorn'
  | 'Aquarius'
  | 'Pisces';

interface UserBio {
  name: string;
  dateOfBirth: Date;
  astrologicalSign: AstrologicalSign;
  relationshipStatus: string;
  occupation: string;
  interests: string[];
  lifeGoals: string[];
  lang: string[];
  keyLifeEvents: string[];
  summary: string;
}

// Example data
export const userBio: UserBio = {
  name: 'Leslie',
  dateOfBirth: new Date('1990-04-21'), // April 21, 1990
  astrologicalSign: 'Taurus',
  relationshipStatus: 'Single',
  occupation: 'Nurse',
  interests: ['traveling', 'painting', 'sustainable living'],
  lifeGoals: [
    'travel to 50 countries',
    'learn a new language',
    'work in a developing country',
  ],
  lang: ['English', 'Spanish'],
  keyLifeEvents: [
    'graduated from college',
    'moved to a new city',
    'started first major job date: 2015-06-01',
  ],
  summary:
    'Leslie is a compassionate and adventurous nurse with a passion for making a meaningful impact. With a love for traveling and learning, she aspires to combine her profession with her personal interests to improve healthcare in developing countries. Fluent in English and Spanish, Leslie embraces diverse cultures and seeks to broaden her horizons through her journeys and professional experiences.',
};
