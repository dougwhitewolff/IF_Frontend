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

const InverseOperations: React.FC = () => {
  const [number, setNumber] = useState('');
  const [result, setResult] = useState('');
  
  return (
    <ActivityLayout
      title="Inverse Operations Activity"
      description="In this activity, you'll explore inverse operations and how they undo each other."
    >
      <AnimatedSection>
        <InteractiveArea>
          <ActivityGrid>
            <AnimatedContent>
              <h3>Apply Inverse Operation</h3>
              <InputField
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="Enter a number"
              />
              <ActivityButton>
                Apply
              </ActivityButton>
            </AnimatedContent>
            <AnimatedContent>
              <h3>Result</h3>
              <FeedbackText>
                {result || 'The result will appear here'}
              </FeedbackText>
            </AnimatedContent>
          </ActivityGrid>
        </InteractiveArea>
      </AnimatedSection>
    </ActivityLayout>
  );
};

export default InverseOperations;