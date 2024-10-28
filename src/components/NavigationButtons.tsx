'use client';

import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ACTIVITIES } from '@/config/activities';

const NavigationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
`;

const NavButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  background-color: ${props => props.theme.current?.colors.accent || '#0077B5'};
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    background-color: ${props => props.theme.baseColors?.blue.dark || '#005C8F'};
    color: white;
  }

  &:active {
    transform: translateY(0);
  }

  &[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }
`;

const ButtonText = styled.span`
  @media (max-width: 480px) {
    display: none;
  }
`;

const SmallText = styled.span`
  font-size: 0.875rem;
  opacity: 0.8;
  display: block;
`;

const NavigationButtons: React.FC = () => {
  const pathname = usePathname();
  
  // Find current activity and its index
  const sortedActivities = [...ACTIVITIES].sort((a, b) => a.order - b.order);
  const currentIndex = sortedActivities.findIndex(activity => activity.path === pathname);
  
  // Get previous and next activities
  const prevActivity = currentIndex > 0 ? sortedActivities[currentIndex - 1] : null;
  const nextActivity = currentIndex < sortedActivities.length - 1 ? sortedActivities[currentIndex + 1] : null;

  return (
    <NavigationContainer>
      {prevActivity ? (
        <NavButton href={prevActivity.path}>
          <ChevronLeft size={20} />
          <div>
            <SmallText>Previous</SmallText>
            <ButtonText>{prevActivity.shortTitle || prevActivity.title}</ButtonText>
          </div>
        </NavButton>
      ) : (
        <div /> // Empty div to maintain spacing
      )}

      {nextActivity ? (
        <NavButton href={nextActivity.path}>
          <div>
            <SmallText>Next</SmallText>
            <ButtonText>{nextActivity.shortTitle || nextActivity.title}</ButtonText>
          </div>
          <ChevronRight size={20} />
        </NavButton>
      ) : (
        <div /> // Empty div to maintain spacing
      )}
    </NavigationContainer>
  );
};
const NavLink = styled(Link)<{ $isActive?: boolean }>`
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: ${props => props.$isActive ? '600' : '500'};
  background-color: ${props =>
    props.$isActive
      ? 'rgba(255, 255, 255, 0.15)'
      : 'transparent'};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9375rem;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
    color: white;
  }

  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 1024px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const AppTitle = styled(Link)`
  color: ${props => props.theme.current?.colors?.highlight || '#FFAD60'};
  text-decoration: none;
  font-weight: 700;
  font-size: 1.5rem;
  padding: 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  &:hover {
    text-decoration: none;
    opacity: 0.95;
    color: white;
  }
`;

export default NavigationButtons;