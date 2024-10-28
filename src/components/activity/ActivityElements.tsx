'use client';

import styled, { keyframes } from 'styled-components';

const focusRing = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(0, 119, 181, 0.4) }
  100% { box-shadow: 0 0 0 4px rgba(0, 119, 181, 0.1) }
`;

export const InteractiveArea = styled.div`
  background-color: ${props => props.theme.current?.colors.background || '#F8F9FA'};
  border-radius: ${props => props.theme.current?.ui.borderRadius || '0.75rem'};
  padding: ${props => props.theme.current?.ui.spacing.lg || '1.5rem'};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: ${props => props.theme.current?.ui.spacing.md || '1rem'};
  border: 1px solid rgba(0, 0, 0, 0.05);
`;

export const ActivityButton = styled.button`
  background-color: ${props => props.theme.current?.colors.primary || props.theme.colors?.primary};
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9375rem;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus-visible {
    outline: none;
    animation: ${focusRing} 0.3s ease forwards;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const InputField = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1.5px solid ${props => props.theme.current?.colors.secondary || '#E2E8F0'};
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s ease;
  background-color: white;
  color: ${props => props.theme.current?.colors.text || '#1A202C'};

  &::placeholder {
    color: #A0AEC0;
  }

  &:hover {
    border-color: ${props => props.theme.colors?.accent || '#0077B5'};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors?.accent || '#0077B5'};
    box-shadow: 0 0 0 3px rgba(0, 119, 181, 0.1);
  }

  &:disabled {
    background-color: #F7FAFC;
    cursor: not-allowed;
  }
`;

export const ActivityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${props => props.theme.current?.ui.spacing.lg || '1.5rem'};
  margin: ${props => props.theme.current?.ui.spacing.md || '1rem'} 0;
`;

export const Section = styled.section`
  background-color: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  
  > h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: ${props => props.theme.current?.colors.secondary || '#2D3748'};
  }
`;

export const FeedbackText = styled.p<{ $isError?: boolean; $isSuccess?: boolean }>`
  color: ${props => {
    if (props.$isError) return '#E53E3E';
    if (props.$isSuccess) return '#38A169';
    return props.theme.current?.colors.text || '#2D3748';
  }};
  font-size: ${props => props.theme.current?.ui.fontSize.sm || '0.875rem'};
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    flex-shrink: 0;
  }
`;

export const LoadingSpinner = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid #E2E8F0;
  border-top-color: ${props => props.theme.colors?.accent || '#0077B5'};
  border-radius: 50%;
  animation: spin 0.6s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg) }
  }
`;