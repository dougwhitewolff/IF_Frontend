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

const CodedMessages: React.FC = () => {
  const [message, setMessage] = useState('');
  const [encodedMessage, setEncodedMessage] = useState('');
  
  return (
    <ActivityLayout
      title="Coded Messages Activity"
      description="In this activity, you'll explore how coding and decoding messages relate to inverse functions."
    >
      <AnimatedSection>
        <InteractiveArea>
          <ActivityGrid>
            <AnimatedContent>
              <h3>Encode a Message</h3>
              <InputField
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your message"
              />
              <ActivityButton>
                Encode
              </ActivityButton>
            </AnimatedContent>
            <AnimatedContent>
              <h3>Decoded Result</h3>
              <FeedbackText>
                {encodedMessage || 'Your encoded message will appear here'}
              </FeedbackText>
            </AnimatedContent>
          </ActivityGrid>
        </InteractiveArea>
      </AnimatedSection>
    </ActivityLayout>
  );
};

export default CodedMessages;