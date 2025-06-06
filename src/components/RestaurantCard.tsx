import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Tag } from 'lucide-react';
import { Link } from 'react-router-dom'; // For navigation on click

interface RestaurantCardProps {
  id: string | number;
  name: string;
  imageUrl: string;
  rating: number; // e.g., 4.5
  reviewCount?: number;
  cuisineTypes: string[]; // e.g., ["Italian", "Pizza"]
  deliveryTime?: string; // e.g., "25-35 min"
  priceRange?: string; // e.g., "$$"
  onClick?: (id: string | number) => void; // Optional click handler
  className?: string;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  id,
  name,
  imageUrl,
  rating,
  reviewCount,
  cuisineTypes,
  deliveryTime,
  priceRange,
  onClick,
  className,
}) => {
  console.log("Rendering RestaurantCard:", name);

  const handleCardClick = () => {
    if (onClick) {
      onClick(id);
    }
  };

  const content = (
    <Card className={`w-full overflow-hidden transition-shadow duration-300 hover:shadow-lg ${onClick || id ? 'cursor-pointer' : ''} ${className}`}>
      <CardHeader className="p-0">
        <AspectRatio ratio={16 / 9}>
          <img
            src={imageUrl || '/placeholder.svg'}
            alt={name}
            className="object-cover w-full h-full"
            onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
          />
        </AspectRatio>
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        <CardTitle className="text-lg font-semibold">{name}</CardTitle>
        <div className="flex items-center text-sm text-muted-foreground space-x-2">
          <div className="flex items-center">
            <Star className="h-4 w-4 mr-1 text-yellow-500 fill-yellow-500" />
            <span>{rating.toFixed(1)}</span>
            {reviewCount && <span className="ml-1">({reviewCount})</span>}
          </div>
          {priceRange && <span>• {priceRange}</span>}
        </div>
        {cuisineTypes.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {cuisineTypes.slice(0, 3).map(cuisine => (
              <Badge key={cuisine} variant="outline" className="text-xs">{cuisine}</Badge>
            ))}
          </div>
        )}
      </CardContent>
      {deliveryTime && (
        <CardFooter className="p-4 pt-0 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{deliveryTime}</span>
          </div>
        </CardFooter>
      )}
    </Card>
  );

  if (onClick) {
    return <div onClick={handleCardClick} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}>{content}</div>;
  }
  // If an ID is provided, assume it's a link to a restaurant details page
  return <Link to={`/restaurants/${id}`}>{content}</Link>;
};

export default RestaurantCard;