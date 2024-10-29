'use client';

import React, { useState } from 'react';
import ActivityLayout from '../../components/activity/ActivityLayout';
import { 
  InteractiveArea,
  ActivityButton,
  InputField,
  ActivityGrid,
  FeedbackText
} from '../../components/activity/ActivityElements';
import { AnimatedSection, AnimatedContent } from '../../components/activity/AnimatedElements';

const SolvingEquations: React.FC = () => {
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  
  return (
    <ActivityLayout
      title="Solving Equations Activity"
      description="In this activity, you'll practice solving equations step by step."
    >
      <AnimatedSection>
        <InteractiveArea>
          <ActivityGrid>
            <AnimatedContent>
              <h3>Enter an Equation</h3>
              <InputField
                value={equation}
                onChange={(e) => setEquation(e.target.value)}
                placeholder="Enter an equation"
              />
              <ActivityButton>
                Solve
              </ActivityButton>
            </AnimatedContent>
            <AnimatedContent>
              <h3>Solution</h3>
              <FeedbackText>
                {solution || 'The step-by-step solution will appear here'}
              </FeedbackText>
            </AnimatedContent>
          </ActivityGrid>
        </InteractiveArea>
      </AnimatedSection>
    </ActivityLayout>
  );
};

export default SolvingEquations;