# Inverse Operations Algebra App (MVP)

This project is a customized [Next.js](https://nextjs.org) application developed to introduce first-year algebra students to the concept of inverse operations in an engaging, choice-driven manner. The app guides students through a series of activities aimed at building foundational knowledge of inverses, enabling deeper understanding and real-world application.

## Overview
The app is designed for high school and Math 105 students to experience learning in a sequential, scaffolded manner with significant user choice. The aim is to promote a joyful learning experience where students have control over activity types, difficulty levels, and, in future versions, even the appearance of the app. With voice interaction and AI-powered guidance, students are supported through each activity to sustain productive struggle without frustration.

## Key Features
- **AI Tutor for Interactive Guidance**: AI-powered tutor that provides:
  - Adaptive hints and suggestions
  - Real-time feedback
  - Progress monitoring
  - Customized difficulty adjustments
- **Choice-Driven Sequential Learning Path**: 
  - Initial understanding check to establish baseline
  - Progressive activity unlocking
  - Multiple difficulty levels (mild, medium, spicy)
  - Various puzzle types and challenges
- **Voice-Activated Commands**:
  - Speech recognition for answers
  - Voice control for navigation
  - AI voice responses
- **Accessibility Features**:
  - Screen reader support
  - Keyboard navigation
  - High contrast options
- **Progress Tracking**:
  - Achievement tracking
  - Performance metrics
  - Learning analytics

## Learning Path
1. **Initial Understanding Check**: Diagnostic activity to establish baseline knowledge
2. **Additive Inverses**: Introduction to the concept of additive inverses
3. **Multiplicative Inverses**: Exploration of multiplicative inverses
4. **Coded Messages**: Puzzle activity that reinforces inverse operations
5. **Currency Exchange**: Real-world applications
6. **Inverse Operations**: Comprehensive practice
7. **Solving Equations**: Application of concepts
8. **Real-World Examples**: Practical applications
9. **Interactive Exploration**: Free-form learning
10. **Practice Problems**: Skill reinforcement

## Technology Stack
- **Frontend**: Next.js 15.0.1
- **Styling**: 
  - Tailwind CSS
  - Styled Components
  - shadcn/ui components
- **State Management**: Zustand
- **AI Integration**: OpenAI GPT-3.5 Turbo
- **Testing**: Jest & React Testing Library

## Setup and Installation

### Prerequisites
- Node.js (Latest LTS version)
- npm or yarn
- OpenAI API key

### Installation
1. Clone the repository:
```bash
git clone [repository-url]
cd inverse-functions-app/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env.local` file with:
```
OPENAI_API_KEY=your_api_key
AI_MODEL=gpt-3.5-turbo
```

4. Start the development server:
```bash
npm run dev
```

## Development Guidelines
- **Error Handling**: All components use appropriate error boundaries
- **Testing**: Components include unit tests
- **Accessibility**: Follow WCAG 2.1 guidelines
- **Code Style**: 
  - TypeScript for type safety
  - 2-space indentation
  - Consistent component structure

## Testing
Run the test suite:
```bash
npm test
```

## Deployment
The application can be deployed using Vercel or similar platforms that support Next.js applications.

## Future Development
- Enhanced AI functionality
- Additional algebra topics
- Expanded customization options
- Mobile app version
- Teacher dashboard

## Contributing
Currently in MVP phase. Contribution guidelines will be added in future versions.

## License
[Add appropriate license]

## Support
For support, please contact Doug Whitewolff via email at doug@transformationmath.com

## Acknowledgments
- OpenAI for AI capabilities
- Zack Lyon has listened to me go on and on about education and AI for hours upon hours.