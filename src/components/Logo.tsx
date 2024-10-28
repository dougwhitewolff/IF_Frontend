// src/components/Logo.tsx

'use client';

import Image from 'next/image';
import styled from 'styled-components';

const StyledImage = styled(Image)`
  /* Add any custom styles if necessary */
`;

interface LogoProps {
  variant?: 'black' | 'white';
  width?: number;
  height?: number;
}

const Logo: React.FC<LogoProps> = ({
  variant = 'black',
  width = 200,
  height = 60,
}) => (
  <StyledImage
    src={`/images/logo-${variant}.png`}
    alt='Transformation Math App Logo'
    width={width}
    height={height}
    priority // Prefetches the image for better performance
  />
);

export default Logo;
