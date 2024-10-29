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

const CurrencyExchange: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [convertedAmount, setConvertedAmount] = useState('');
  
  return (
    <ActivityLayout
      title="Currency Exchange Activity"
      description="In this activity, you'll explore how currency exchange rates work and practice converting between different currencies."
    >
      <AnimatedSection>
        <InteractiveArea>
          <ActivityGrid>
            <AnimatedContent>
              <h3>Convert Currency</h3>
              <InputField
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
              />
              <ActivityButton>
                Convert
              </ActivityButton>
            </AnimatedContent>
            <AnimatedContent>
              <h3>Converted Amount</h3>
              <FeedbackText>
                {convertedAmount || 'The converted amount will appear here'}
              </FeedbackText>
            </AnimatedContent>
          </ActivityGrid>
        </InteractiveArea>
      </AnimatedSection>
    </ActivityLayout>
  );
};

export default CurrencyExchange;