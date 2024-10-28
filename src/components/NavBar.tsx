'use client';

import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, ChevronDown, Menu } from 'lucide-react';
import { ACTIVITIES } from '@/config/activities';

const NavContainer = styled.header`
  background: linear-gradient(to right, #005B8E, #0077B5);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  max-width: ${props => props.theme.globals?.maxWidth || '1200px'};
  margin: 0 auto;
  padding: 0.5rem 2rem;
`;

const TopNav = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const AppTitle = styled(Link)`
  color: ${props => props.theme.current?.colors?.highlight || '#FFAD60'};
  text-decoration: none;
  font-weight: 700;
  font-size: 1.5rem;
  padding: 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.2s ease;
  
  &:hover {
    text-decoration: none;
    color: white;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const NavLinksContainer = styled.div<{ $isOpen?: boolean }>`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.5rem 0;
  
  @media (max-width: 1024px) {
    display: ${props => props.$isOpen ? 'flex' : 'none'};
    flex-direction: column;
    width: 100%;
  }
`;

const NavGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  
  @media (max-width: 1024px) {
    flex-direction: column;
    width: 100%;
  }
`;

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

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.9);
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
  }
  
  @media (max-width: 1024px) {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const NavDivider = styled.div`
  width: 1px;
  height: 24px;
  background-color: rgba(255, 255, 255, 0.1);
  margin: 0 0.5rem;
  
  @media (max-width: 1024px) {
    display: none;
  }
`;

const NavBar: React.FC = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Sort and split activities into two groups
  const { firstGroup, secondGroup } = useMemo(() => {
    const sortedActivities = [...ACTIVITIES].sort((a, b) => a.order - b.order);
    const midpoint = Math.ceil(sortedActivities.length / 2);
    
    return {
      firstGroup: sortedActivities.slice(0, midpoint),
      secondGroup: sortedActivities.slice(midpoint)
    };
  }, []);

  const renderNavLink = (activity: typeof ACTIVITIES[number]) => (
    <NavLink 
      key={activity.path}
      href={activity.path}
      $isActive={pathname === activity.path}
      onClick={() => setIsMenuOpen(false)}
    >
      {activity.shortTitle || activity.title}
      {pathname === activity.path && <ChevronRight size={16} />}
    </NavLink>
  );

  return (
    <NavContainer>
      <Nav>
        <TopNav>
          <AppTitle href="/">Inverse Functions</AppTitle>
          <MenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span>Menu</span>
            {isMenuOpen ? <ChevronDown size={20} /> : <Menu size={20} />}
          </MenuButton>
        </TopNav>
        <NavLinksContainer $isOpen={isMenuOpen}>
          <NavGroup>
            {firstGroup.map(renderNavLink)}
          </NavGroup>
          <NavDivider />
          <NavGroup>
            {secondGroup.map(renderNavLink)}
          </NavGroup>
        </NavLinksContainer>
      </Nav>
    </NavContainer>
  );
};

export default NavBar;