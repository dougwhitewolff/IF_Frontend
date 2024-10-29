
'use client';

import React, { useState } from 'react';
import ActivityLayout from '../../components/activity/ActivityLayout';
import { 
  InteractiveArea, 
  ActivityButton, 
  InputField, 
  FeedbackText 
} from '../../components/activity/ActivityElements';

const QuickCheck: React.FC = () => {
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isError, setIsError] = useState(false);

  const handleCheck = () => {
    // Example validation - replace with actual logic
    if (answer.trim() === '') {
      setFeedback('Please enter an answer');
      setIsError(true);
    } else {
      setFeedback('Good attempt! Let\'s analyze this together.');
      setIsError(false);
    }
  };

  return (
    <ActivityLayout
      title="Quick Check"
      description="Let's check your understanding of inverse operations and functions."
    >
      <InteractiveArea>
        <InputField 
          placeholder="Enter your answer" 
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
        <ActivityButton onClick={handleCheck}>
          Check Answer
        </ActivityButton>
        {feedback && (
          <FeedbackText $isError={isError}>
            {feedback}
          </FeedbackText>
        )}
      </InteractiveArea>
    </ActivityLayout>
  );
};

export default QuickCheck;