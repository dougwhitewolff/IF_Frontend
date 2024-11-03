export interface Question {
  id: string;
  category: string;
  difficulty: 'mild' | 'medium' | 'spicy';
  hint: string;
  answer: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

export const categories: Category[] = [
  {
    id: 'gaming',
    name: 'Gaming',
    description: 'Decode messages about popular video games and gaming culture',
  },
  {
    id: 'sports',
    name: 'Sports',
    description: 'Test your knowledge of athletes and sports',
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    description: 'Music, movies, and social media stars',
  },
  {
    id: 'memes',
    name: 'Memes & Internet',
    description: 'Popular memes and internet culture',
  }
];

export const questions: Question[] = [
  // Gaming Category - Mild
  {
    id: 'gaming-mild-1',
    category: 'gaming',
    difficulty: 'mild',
    hint: 'This blocky game lets you build anything you can imagine',
    answer: 'MINECRAFT'
  },
  {
    id: 'gaming-mild-2',
    category: 'gaming',
    difficulty: 'mild',
    hint: 'Epic battle royale game where you can also attend virtual concerts',
    answer: 'FORTNITE'
  },
  {
    id: 'gaming-mild-3',
    category: 'gaming',
    difficulty: 'mild',
    hint: 'Sus crewmates complete tasks in this space-themed game',
    answer: 'AMONG US'
  },
  
  // Gaming Category - Medium
  {
    id: 'gaming-medium-1',
    category: 'gaming',
    difficulty: 'medium',
    hint: 'This RPG series features creatures you can catch and battle',
    answer: 'POKEMON SCARLET'
  },
  {
    id: 'gaming-medium-2',
    category: 'gaming',
    difficulty: 'medium',
    hint: 'Post-apocalyptic game where you explore a wasteland with your trusty Pip-Boy',
    answer: 'FALLOUT'
  },
  {
    id: 'gaming-medium-3',
    category: 'gaming',
    difficulty: 'medium',
    hint: 'Open-world game with dragons and the famous line "I used to be an adventurer like you"',
    answer: 'SKYRIM'
  },

  // Gaming Category - Spicy
  {
    id: 'gaming-spicy-1',
    category: 'gaming',
    difficulty: 'spicy',
    hint: 'This challenging action RPG series is known for saying "YOU DIED" a lot',
    answer: 'DARK SOULS'
  },
  {
    id: 'gaming-spicy-2',
    category: 'gaming',
    difficulty: 'spicy',
    hint: 'Cyberpunk ninja action game featuring a character named Raiden',
    answer: 'METAL GEAR RISING'
  },
  {
    id: 'gaming-spicy-3',
    category: 'gaming',
    difficulty: 'spicy',
    hint: 'This indie game about depression features a mountain climb',
    answer: 'CELESTE'
  },

  // Sports Category - Mild
  {
    id: 'sports-mild-1',
    category: 'sports',
    difficulty: 'mild',
    hint: 'Lakers superstar who wears #23 and is called "King"',
    answer: 'LEBRON JAMES'
  },
  {
    id: 'sports-mild-2',
    category: 'sports',
    difficulty: 'mild',
    hint: 'KC Chiefs quarterback known for amazing throws',
    answer: 'PATRICK MAHOMES'
  },
  {
    id: 'sports-mild-3',
    category: 'sports',
    difficulty: 'mild',
    hint: 'US Women\'s Soccer star with pink hair who fights for equal pay',
    answer: 'MEGAN RAPINOE'
  },

  // Entertainment - Mild
  {
    id: 'entertainment-mild-1',
    category: 'entertainment',
    difficulty: 'mild',
    hint: 'Singer of "Anti-Hero" who released her version of her old albums',
    answer: 'TAYLOR SWIFT'
  },
  {
    id: 'entertainment-mild-2',
    category: 'entertainment',
    difficulty: 'mild',
    hint: 'Creator who became famous for gaming videos and now does charity',
    answer: 'MISTER BEAST'
  },
  {
    id: 'entertainment-mild-3',
    category: 'entertainment',
    difficulty: 'mild',
    hint: 'Singer of "Bad Guy" known for baggy clothes and dark hair with green roots',
    answer: 'BILLIE EILISH'
  },

  // Memes Category - Mild
  {
    id: 'memes-mild-1',
    category: 'memes',
    difficulty: 'mild',
    hint: 'This doge became famous for saying "much wow"',
    answer: 'SHIBA INU'
  },
  {
    id: 'memes-mild-2',
    category: 'memes',
    difficulty: 'mild',
    hint: 'Cat meme that says "I can has..."',
    answer: 'CHEEZBURGER'
  },
  {
    id: 'memes-mild-3',
    category: 'memes',
    difficulty: 'mild',
    hint: 'This is fine dog sits in...',
    answer: 'BURNING HOUSE'
  }

  // Note: More questions can be added following the same pattern
];