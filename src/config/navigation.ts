// src/config/navigation.ts

interface Page {
  title: string;
  path: string;
  showPrevious?: boolean; // Optional flag to control the "Previous" button
}

const pages: Page[] = [
  { title: 'Home', path: '/', showPrevious: false },
  { title: 'Quick Check', path: '/quick-check', showPrevious: false },
  { title: 'Coded Messages', path: '/coded-messages', showPrevious: true },
  {
    title: 'Currency Exchange',
    path: '/currency-exchange',
    showPrevious: true,
  },
  {
    title: 'Solving Equations',
    path: '/solving-equations',
    showPrevious: true,
  },
  {
    title: 'Real-World Examples',
    path: '/real-world-examples',
    showPrevious: true,
  },
  {
    title: 'Interactive Exploration',
    path: '/interactive-exploration',
    showPrevious: true,
  },
  {
    title: 'Practice Problems',
    path: '/practice-problems',
    showPrevious: true,
  },
  // Add new pages here in the desired order
];

export default pages;
