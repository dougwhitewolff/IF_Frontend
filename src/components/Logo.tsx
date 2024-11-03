import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  variant?: 'black' | 'white';
  width?: number;
  height?: number;
  href?: string;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({
  variant = 'black',
  width = 200,
  height = 60,
  href = '/',
  className = '',
}) => {
  const Component = href ? Link : 'div';
  const logoSrc = `/images/logo-${variant}.png`;
  
  return (
    <Component 
      href={href} 
      className={`inline-block ${className}`}
      aria-label="Transformation Math Home"
    >
      <Image
        src={logoSrc}
        alt="Transformation Math Logo"
        width={width}
        height={height}
        priority
        className="transform hover:scale-105 transition-transform duration-200"
      />
    </Component>
  );
};

export default Logo;
