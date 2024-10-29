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

const MultiplicativeInverses: React.FC = () => {
  const [number, setNumber] = useState('');
  const [result, setResult] = useState('');
  
  return (
    <ActivityLayout
      title="Multiplicative Inverses"
      description="Learn about reciprocals and their role in inverse operations."
    >
      <AnimatedSection>
        <InteractiveArea>
          <ActivityGrid>
            <AnimatedContent>
              <h3>Find the Multiplicative Inverse</h3>
              <InputField
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="Enter a non-zero number"
              />
              <ActivityButton>
                Find Inverse
              </ActivityButton>
            </AnimatedContent>
            <AnimatedContent>
              <h3>Result</h3>
              <FeedbackText>
                {result || 'Enter a number to find its multiplicative inverse (reciprocal)'}
              </FeedbackText>
            </AnimatedContent>
          </ActivityGrid>
        </InteractiveArea>
      </AnimatedSection>
    </ActivityLayout>
  );
};

export default MultiplicativeInverses;