'use client';

import React, { ReactNode } from 'react';
import styled from 'styled-components';
import Logo from '../Logo';
import NavigationButtons from '../NavigationButtons';
import { useDifficulty } from '../ClientProvider';
import { Award } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { getActivityInfo } from '@/config/activities';

const PageWrapper = styled.div`
  min-height: calc(100vh - 120px);
  background: linear-gradient(to bottom, #F8F9FA, #EDF2F7);
  padding: ${props => props.theme.current?.ui.spacing.md || '20px'};
`;

const Container = styled.div`
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 2rem;
  max-width: ${props => props.theme.globals?.maxWidth || '1200px'};
  margin: 0 auto;
  border: 1px solid rgba(0, 0, 0, 0.05);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

const HeaderRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1rem;
  min-width: 200px;
  
  @media (max-width: 768px) {
    width: 100%;
    align-items: center;
  }
`;

const ContentArea = styled.div`
  flex: 1;
`;

const TitleArea = styled.div`
  display: flex;
  align-items: baseline;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  color: ${props => props.theme.current?.colors.secondary || props.theme.colors?.secondary || '#2D3748'};
  margin: 0;
  font-size: 1.875rem;
  font-weight: 700;
  line-height: 1.2;
`;

const ProgressIndicator = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.current?.colors.accent || '#0077B5'};
  opacity: 0.8;
`;

const Description = styled.p`
  margin: 0;
  font-size: 1.125rem;
  color: ${props => props.theme.current?.colors.text || '#4A5568'};
  line-height: 1.5;
  max-width: 65ch;
`;

const LogoContainer = styled.div`
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DifficultyBadge = styled.div`
  background: white;
  border: 1px solid ${props => props.theme.current?.colors.highlight || '#FFAD60'};
  color: ${props => props.theme.current?.colors.text || '#4A5568'};
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
`;

const MainContent = styled.main`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid ${props => props.theme.current?.colors.background || '#EDF2F7'};
`;

const NavigationSection = styled.footer`
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${props => props.theme.current?.colors.background || '#EDF2F7'};
`;

interface ActivityLayoutProps {
  title: string;
  description: string;
  children?: ReactNode;
}

export const ActivityLayout: React.FC<ActivityLayoutProps> = ({
  title,
  description,
  children,
}) => {
  const { level, preset } = useDifficulty();
  const pathname = usePathname();
  const { current, total } = getActivityInfo(pathname);

  return (
    <PageWrapper>
      <Container>
        <Header>
          <ContentArea>
            <TitleArea>
              <Title>{title}</Title>
              <ProgressIndicator>Activity {current}/{total}</ProgressIndicator>
            </TitleArea>
            <Description>{description}</Description>
          </ContentArea>
          
          <HeaderRight>
            <LogoContainer>
              <Logo variant='black' width={140} height={42} />
            </LogoContainer>
            <DifficultyBadge>
              <Award size={18} />
              <span>Level: {preset} - {level}</span>
            </DifficultyBadge>
          </HeaderRight>
        </Header>

        <MainContent>
          {children}
        </MainContent>

        <NavigationSection>
          <NavigationButtons />
        </NavigationSection>
      </Container>
    </PageWrapper>
  );
};

export default ActivityLayout;