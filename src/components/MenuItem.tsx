import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"; // Option 1: Card based
import { PlusCircle, MinusCircle } from 'lucide-react'; // For quantity adjustment

interface MenuItemProps {
  id: string | number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string; // Optional image
  onAddToCart: (id: string | number, quantity: number) => void;
  // Optional: for displaying current quantity in cart
  quantityInCart?: number;
  onUpdateQuantity?: (id: string | number, newQuantity: number) => void;
  className?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({
  id,
  name,
  description,
  price,
  imageUrl,
  onAddToCart,
  quantityInCart = 0,
  onUpdateQuantity,
  className,
}) => {
  console.log("Rendering MenuItem:", name, "Price:", price, "Qty in cart:", quantityInCart);

  const handleAddToCart = () => {
    onAddToCart(id, 1); // Add one item
  };

  const handleIncreaseQuantity = () => {
    if (onUpdateQuantity) {
      onUpdateQuantity(id, quantityInCart + 1);
    }
  };

  const handleDecreaseQuantity = () => {
    if (onUpdateQuantity && quantityInCart > 0) {
      onUpdateQuantity(id, quantityInCart - 1);
    }
  };

  return (
    <Card className={`flex flex-col sm:flex-row overflow-hidden ${className}`}>
      {imageUrl && (
        <div className="sm:w-1/3 md:w-1/4 flex-shrink-0">
          <img
            src={imageUrl}
            alt={name}
            className="object-cover w-full h-32 sm:h-full"
            onError={(e) => (e.currentTarget.style.display = 'none')} // Hide if image fails
          />
        </div>
      )}
      <div className="flex flex-col justify-between flex-grow p-4">
        <div>
          <CardTitle className="text-md font-semibold">{name}</CardTitle>
          {description && <CardDescription className="text-xs text-muted-foreground mt-1 line-clamp-2">{description}</CardDescription>}
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-md font-bold text-primary">${price.toFixed(2)}</span>
          {quantityInCart > 0 && onUpdateQuantity ? (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={handleDecreaseQuantity} aria-label="Decrease quantity">
                <MinusCircle className="h-4 w-4" />
              </Button>
              <span className="w-6 text-center font-medium">{quantityInCart}</span>
              <Button variant="outline" size="icon" onClick={handleIncreaseQuantity} aria-label="Increase quantity">
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button size="sm" onClick={handleAddToCart}>
              Add to Cart
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default MenuItem;