export interface Activity {
    path: string;
    id: string;  // Added id field
    title: string;
    shortTitle?: string;
    description: string;
    order: number;
    requiredScore?: number;  // Optional: for activity unlocking
    difficulty?: 'mild' | 'medium' | 'spicy';  // Optional: default difficulty
  }
  
  export const ACTIVITIES: Activity[] = [
    {
      id: 'quick-check',
      path: '/quick-check',
      title: 'Quick Check for Understanding',
      shortTitle: 'Quick Check',
      description: 'Quickly gauge your understanding of inverse operations and functions.',
      order: 1,
      difficulty: 'mild'
    },
    {
      id: 'additive-inverses',
      path: '/additive-inverses',
      title: 'Additive Inverses',
      description: 'Explore how numbers can cancel each other out through addition.',
      order: 2,
      difficulty: 'mild'
    },
    {
      id: 'multiplicative-inverses',
      path: '/multiplicative-inverses',
      title: 'Multiplicative Inverses',
      description: 'Learn about reciprocals and their role in inverse operations.',
      order: 3,
      difficulty: 'medium'
    },
    {
      id: 'coded-messages',
      path: '/coded-messages',
      title: 'Coded Messages',
      description: "Explore how coding and decoding messages relate to inverse functions.",
      order: 4,
      difficulty: 'medium'
    },
    {
      id: 'currency-exchange',
      path: '/currency-exchange',
      title: 'Currency Exchange',
      description: 'Explore inverse functions through real-world currency conversion examples.',
      order: 5,
      difficulty: 'medium'
    },
    {
      id: 'inverse-operations',
      path: '/inverse-operations',
      title: 'Inverse Operations',
      description: 'Learn about inverse operations and how they relate to solving equations.',
      order: 6,
      difficulty: 'spicy'
    },
    {
      id: 'solving-equations',
      path: '/solving-equations',
      title: 'Solving Equations',
      description: 'Use inverse operations to solve increasingly complex equations.',
      order: 7,
      difficulty: 'spicy'
    },
    {
      id: 'real-world-examples',
      path: '/real-world-examples',
      title: 'Real World Examples',
      description: 'See how inverse functions appear in everyday situations.',
      order: 8,
      difficulty: 'spicy'
    },
    {
      id: 'interactive-exploration',
      path: '/interactive-exploration',
      title: 'Interactive Exploration',
      description: 'Manipulate graphs and functions to understand inverse relationships.',
      order: 9,
      difficulty: 'spicy'
    },
    {
      id: 'practice-problems',
      path: '/practice-problems',
      title: 'Practice Problems',
      description: 'Apply your understanding of inverse functions to solve various problems.',
      order: 10,
      difficulty: 'spicy'
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
  
  // Added new helper functions
  export const getActivityById = (id: string): Activity | undefined => {
    return ACTIVITIES.find(a => a.id === id);
  };
  
  export const isActivityUnlocked = (
    activityId: string, 
    completedActivities: string[], 
    currentScore: number
  ): boolean => {
    const activity = getActivityById(activityId);
    if (!activity) return false;
    
    // First activity is always unlocked
    if (activity.order === 1) return true;
    
    // Check if previous activity is completed
    const previousActivity = ACTIVITIES.find(a => a.order === activity.order - 1);
    if (!previousActivity) return true;
    
    const isPreviousCompleted = completedActivities.includes(previousActivity.id);
    const hasRequiredScore = !activity.requiredScore || currentScore >= activity.requiredScore;
    
    return isPreviousCompleted && hasRequiredScore;
  };
  
  export const getAvailableActivities = (
    completedActivities: string[], 
    currentScore: number
  ): Activity[] => {
    return ACTIVITIES.filter(activity => 
      isActivityUnlocked(activity.id, completedActivities, currentScore)
    );
  };
  