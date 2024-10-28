// src/components/HomePageContent.tsx

'use client'; // Designates this component as a Client Component

import React from 'react';
import styled from 'styled-components';
import Logo from './Logo';
import NavigationButtons from './NavigationButtons';

const Container = styled.div`
  padding: 20px;
`;

const Title = styled.h1`
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: 20px;
`;

const Description = styled.p`
  font-size: 1.2em;
  margin-bottom: 20px;
`;

const HomePageContent: React.FC = () => (
  <Container>
    <Logo variant='black' width={200} height={60} />
    <Title>Welcome to the Transformation Math App</Title>
    <Description>
      Explore the world of inverse functions through interactive activities and
      real-world applications.
    </Description>
    {/* Add more content or components as needed */}
    {/* Optionally include AIChat or other interactive elements */}

    {/* Navigation Buttons */}
    <NavigationButtons />
  </Container>
);

export default HomePageContent;
