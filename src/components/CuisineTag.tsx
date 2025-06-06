import React from 'react';
import { Badge } from '@/components/ui/badge'; // Using Badge as a base for styling
import { cn } from '@/lib/utils';

interface CuisineTagProps {
  cuisineName: string;
  isActive?: boolean;
  onClick?: (cuisineName: string) => void;
  className?: string;
}

const CuisineTag: React.FC<CuisineTagProps> = ({ cuisineName, isActive = false, onClick, className }) => {
  console.log("Rendering CuisineTag:", cuisineName, "IsActive:", isActive);

  const handleClick = () => {
    if (onClick) {
      onClick(cuisineName);
    }
  };

  return (
    <Badge
      variant={isActive ? 'default' : 'secondary'}
      onClick={handleClick}
      className={cn(
        "cursor-pointer transition-all hover:opacity-80 text-sm px-3 py-1",
        isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
        className
      )}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      {cuisineName}
    </Badge>
  );
};

export default CuisineTag;