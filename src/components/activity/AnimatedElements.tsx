'use client';

import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideIn = keyframes`
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

export const AnimatedSection = styled.div<{ $delay?: string }>`
  animation: ${fadeIn} 0.5s ease-out;
  animation-delay: ${props => props.$delay || '0s'};
  animation-fill-mode: both;
`;

export const AnimatedContent = styled.div`
  animation: ${slideIn} 0.5s ease-out;
`;

export const AnimatedFeedback = styled.div`
  animation: ${slideIn} 0.3s ease-out;
`;