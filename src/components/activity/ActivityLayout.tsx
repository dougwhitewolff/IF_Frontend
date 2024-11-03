'use client';

import React, { useEffect } from 'react';
import styled from 'styled-components';
import { usePathname } from 'next/navigation';
import { getActivityInfo } from '@/config/activities';
import { useActivityContext } from '@/hooks/useActivityContext';

const PageWrapper = styled.div`
  min-height: calc(100vh - 120px);
  padding: 2rem;
  position: relative;
`;

const Header = styled.header`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: ${props => props.theme.colors?.primary || '#333'};
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  font-size: 1.1rem;
  color: ${props => props.theme.colors?.secondary || '#666'};
  margin-bottom: 1.5rem;
`;

const DifficultyBadge = styled.div<{ difficulty: 'mild' | 'medium' | 'spicy' }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  background-color: ${({ difficulty }) => {
    switch (difficulty) {
      case 'mild': return '#4ade80';
      case 'medium': return '#fbbf24';
      case 'spicy': return '#ef4444';
      default: return '#6b7280';
    }
  }};
  color: white;
  margin-bottom: 1rem;
`;

const ProgressIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: ${props => props.theme.colors?.secondary || '#666'};
`;

const ContentWrapper = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
`;

interface ActivityLayoutProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

const ActivityLayout: React.FC<ActivityLayoutProps> = ({
  title,
  description,
  children
}) => {
  const pathname = usePathname();
  const { 
    progress, 
    updateProgress,
    recordAttempt,
    adjustDifficulty 
  } = useActivityContext(pathname || '');
  
  const activityInfo = getActivityInfo(pathname || '');

  // Update current activity when pathname changes
  useEffect(() => {
    if (activityInfo?.activity && progress && progress.currentActivity !== activityInfo.activity.id) {
      updateProgress({ 
        currentActivity: activityInfo.activity.id,
        lastActivityTimestamp: new Date().toISOString()
      });
    }
  }, [pathname, progress, updateProgress, activityInfo]);

  // Calculate progress percentage
  const progressPercentage = progress ? 
    (progress.completedQuestions.length / 10) * 100 : 0;

  return (
    <PageWrapper>
      <Header>
        <Title>{title}</Title>
        <Description>{description}</Description>
        
        {progress && (
          <>
            <DifficultyBadge difficulty={progress.difficulty}>
              {progress.difficulty.charAt(0).toUpperCase() + progress.difficulty.slice(1)} Difficulty
            </DifficultyBadge>
            
            <ProgressIndicator>
              <span>Progress: {progressPercentage.toFixed(0)}%</span>
              <span>•</span>
              <span>Score: {progress.score}</span>
              {progress.streakCount > 0 && (
                <>
                  <span>•</span>
                  <span>Streak: {progress.streakCount} 🔥</span>
                </>
              )}
            </ProgressIndicator>
          </>
        )}
      </Header>

      <ContentWrapper>
        {children}
      </ContentWrapper>
    </PageWrapper>
  );
};

export default ActivityLayout;