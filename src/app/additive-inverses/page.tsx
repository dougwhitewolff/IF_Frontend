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

const AdditiveInverses: React.FC = () => {
  const [number, setNumber] = useState('');
  const [result, setResult] = useState('');
  
  return (
    <ActivityLayout
      title="Additive Inverses"
      description="Explore how numbers can cancel each other out through addition."
    >
      <AnimatedSection>
        <InteractiveArea>
          <ActivityGrid>
            <AnimatedContent>
              <h3>Find the Additive Inverse</h3>
              <InputField
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="Enter a number"
              />
              <ActivityButton>
                Find Inverse
              </ActivityButton>
            </AnimatedContent>
            <AnimatedContent>
              <h3>Result</h3>
              <FeedbackText>
                {result || 'Enter a number to find its additive inverse'}
              </FeedbackText>
            </AnimatedContent>
          </ActivityGrid>
        </InteractiveArea>
      </AnimatedSection>
    </ActivityLayout>
  );
};

export default AdditiveInverses;