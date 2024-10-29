'use client';

import React from 'react';
import ActivityLayout from '../../components/activity/ActivityLayout';
import { 
  InteractiveArea,
  ActivityGrid,
  FeedbackText
} from '../../components/activity/ActivityElements';
import { AnimatedSection, AnimatedContent } from '../../components/activity/AnimatedElements';

const RealWorldExamples: React.FC = () => {
  return (
    <ActivityLayout
      title="Real World Examples Activity"
      description="In this activity, you'll explore real-world applications of the mathematical concept."
    >
      <AnimatedSection>
        <InteractiveArea>
          <ActivityGrid>
            <AnimatedContent>
              <h3>Example 1</h3>
              <FeedbackText>
                Description of the first real-world example
              </FeedbackText>
            </AnimatedContent>
            <AnimatedContent>
              <h3>Example 2</h3>
              <FeedbackText>
                Description of the second real-world example
              </FeedbackText>
            </AnimatedContent>
          </ActivityGrid>
        </InteractiveArea>
      </AnimatedSection>
    </ActivityLayout>
  );
};

export default RealWorldExamples;