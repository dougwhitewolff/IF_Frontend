import React from 'react';
import Image from 'next/image';

interface ActivityIconProps {
  type: 'kettlebell' | 'balloon';
  value: '1' | '10';
  size?: number;
  className?: string;
}

const ActivityIcon: React.FC<ActivityIconProps> = ({
  type,
  value,
  size = 64,
  className = '',
}) => {
  const imagePath = `/images/${type}-${value}.png`;
  
  return (
    <div className={`relative inline-block ${className}`}>
      <Image
        src={imagePath}
        alt={`${type} with value ${value}`}
        width={size}
        height={size}
        className="transform hover:scale-110 transition-transform duration-200"
      />
    </div>
  );
};

export default ActivityIcon;
