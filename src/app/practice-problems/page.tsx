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

const PracticeProblems: React.FC = () => {
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  
  return (
    <ActivityLayout
      title="Practice Problems Activity"
      description="In this activity, you'll solve practice problems to reinforce your understanding of the concept."
    >
      <AnimatedSection>
        <InteractiveArea>
          <ActivityGrid>
            <AnimatedContent>
              <h3>Solve the Problem</h3>
              <p>Problem statement goes here</p>
              <InputField
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Enter your answer"
              />
              <ActivityButton>
                Submit
              </ActivityButton>
            </AnimatedContent>
            <AnimatedContent>
              <h3>Feedback</h3>
              <FeedbackText>
                {feedback || 'Feedback on your answer will appear here'}
              </FeedbackText>
            </AnimatedContent>
          </ActivityGrid>
        </InteractiveArea>
      </AnimatedSection>
    </ActivityLayout>
  );
};

export default PracticeProblems;