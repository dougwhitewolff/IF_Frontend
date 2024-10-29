export interface Activity {
    path: string;
    title: string;
    shortTitle?: string;
    description: string;
    order: number;
  }
  
  export const ACTIVITIES: Activity[] = [
    {
      path: '/quick-check',
      title: 'Quick Check for Understanding',
      shortTitle: 'Quick Check',
      description: 'Quickly gauge your understanding of inverse operations and functions.',
      order: 1
    },
    {
      path: '/additive-inverses',
      title: 'Additive Inverses',
      description: 'Explore how numbers can cancel each other out through addition.',
      order: 2
    },
    {
      path: '/multiplicative-inverses',
      title: 'Multiplicative Inverses',
      description: 'Learn about reciprocals and their role in inverse operations.',
      order: 3
    },
    {
      path: '/coded-messages',
      title: 'Coded Messages',
      description: "Explore how coding and decoding messages relate to inverse functions.",
      order: 4
    },
    {
      path: '/currency-exchange',
      title: 'Currency Exchange',
      description: 'Explore inverse functions through real-world currency conversion examples.',
      order: 5
    },
    {
      path: '/inverse-operations',
      title: 'Inverse Operations',
      description: 'Learn about inverse operations and how they relate to solving equations.',
      order: 6
    },
    {
      path: '/solving-equations',
      title: 'Solving Equations',
      description: 'Use inverse operations to solve increasingly complex equations.',
      order: 7
    },
    {
      path: '/real-world-examples',
      title: 'Real World Examples',
      description: 'See how inverse functions appear in everyday situations.',
      order: 8
    },
    {
      path: '/interactive-exploration',
      title: 'Interactive Exploration',
      description: 'Manipulate graphs and functions to understand inverse relationships.',
      order: 9
    },
    {
      path: '/practice-problems',
      title: 'Practice Problems',
      description: 'Apply your understanding of inverse functions to solve various problems.',
      order: 10
    }
  ];
  
  export const getActivityInfo = (currentPath: string) => {
    const activity = ACTIVITIES.find(a => a.path === currentPath);
    return {
      current: activity?.order || 1,
      total: ACTIVITIES.length,
      activity
    };
  };
  
  export const getNextActivity = (currentPath: string) => {
    const currentActivity = ACTIVITIES.find(a => a.path === currentPath);
    if (!currentActivity) return ACTIVITIES[0];
    return ACTIVITIES.find(a => a.order === currentActivity.order + 1);
  };
  
  export const getPreviousActivity = (currentPath: string) => {
    const currentActivity = ACTIVITIES.find(a => a.path === currentPath);
    if (!currentActivity) return ACTIVITIES[0];
    return ACTIVITIES.find(a => a.order === currentActivity.order - 1);
  };