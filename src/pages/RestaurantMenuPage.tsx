import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NavigationMenu from '@/components/layout/NavigationMenu';
import Footer from '@/components/layout/Footer';
import MenuItem from '@/components/MenuItem';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Star, Clock, ShoppingBag, Utensils } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';


// Mock data - in a real app, this would come from an API
const mockRestaurantData = {
  '1': {
    name: 'Pizza Paradise',
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60',
    rating: 4.5,
    deliveryTime: '25-35 min',
    cuisine: 'Italian',
    menu: {
      appetizers: [
        { id: 'a1', name: 'Garlic Bread', description: 'Crusty bread with garlic butter and herbs.', price: 5.99, imageUrl: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Z2FybGljJTIwYnJlYWR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=300&q=60' },
        { id: 'a2', name: 'Caprese Salad', description: 'Fresh mozzarella, tomatoes, and basil.', price: 7.50, imageUrl: 'https://images.unsplash.com/photo-1579299809029-f89146003a6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FwcmVzZSUyMHNhbGFkfGVufDB8fDB8fHww&auto=format&fit=crop&w=300&q=60' },
      ],
      main_courses: [
        { id: 'm1', name: 'Margherita Pizza', description: 'Classic cheese and tomato pizza.', price: 12.99, imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGl6emF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=300&q=60' },
        { id: 'm2', name: 'Pepperoni Pizza', description: 'Pizza with spicy pepperoni slices.', price: 14.50, imageUrl: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGVwcGVyb25pJTIwcGl6emF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=300&q=60' },
        { id: 'm3', name: 'Spaghetti Carbonara', description: 'Pasta with creamy egg sauce, pancetta, and parmesan.', price: 15.00, imageUrl: 'https://images.unsplash.com/photo-1588013273468-31508b26a30d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c3BhZ2hldHRpJTIwY2FyYm9uYXJhfGVufDB8fDB8fHww&auto=format&fit=crop&w=300&q=60' },
      ],
      desserts: [
        { id: 'd1', name: 'Tiramisu', description: 'Classic Italian coffee-flavored dessert.', price: 6.50, imageUrl: 'https://images.unsplash.com/photo-1571672000480-9005735259c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dGlyYW1pc3V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=300&q=60' },
      ]
    }
  },
  // Add more restaurants if needed
};

type MenuItemData = { id: string; name: string; description?: string; price: number; imageUrl?: string; };
type MenuCategory = keyof typeof mockRestaurantData['1']['menu'];

interface CartItem extends MenuItemData {
  quantity: number;
}

const RestaurantMenuPage = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const [restaurant, setRestaurant] = useState<typeof mockRestaurantData['1'] | null>(null);
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  console.log(`RestaurantMenuPage loaded for restaurant ID: ${restaurantId}`);

  useEffect(() => {
    if (restaurantId && mockRestaurantData[restaurantId as keyof typeof mockRestaurantData]) {
      setRestaurant(mockRestaurantData[restaurantId as keyof typeof mockRestaurantData]);
    } else {
      // Handle restaurant not found, e.g., redirect or show error
      console.error('Restaurant not found');
    }
  }, [restaurantId]);

  const handleAddToCart = (itemId: string | number, quantity: number) => {
    const itemToAdd = Object.values(restaurant?.menu || {}).flat().find(item => item.id === itemId) as MenuItemData | undefined;
    if (!itemToAdd) return;

    setCart(prevCart => {
      const existingItem = prevCart[itemId.toString()];
      const newQuantity = (existingItem ? existingItem.quantity : 0) + quantity;
      toast({
        title: "Item Added!",
        description: `${itemToAdd.name} added to your cart.`,
      });
      return {
        ...prevCart,
        [itemId.toString()]: { ...itemToAdd, quantity: newQuantity }
      };
    });
    console.log(`Added item ${itemId} to cart with quantity ${quantity}. Total in cart: ${cart[itemId.toString()] ? cart[itemId.toString()].quantity + quantity : quantity}`);
  };

  const handleUpdateQuantity = (itemId: string | number, newQuantity: number) => {
    const itemToUpdate = Object.values(restaurant?.menu || {}).flat().find(item => item.id === itemId) as MenuItemData | undefined;
    if (!itemToUpdate) return;

    setCart(prevCart => {
      if (newQuantity <= 0) {
        const { [itemId.toString()]: _, ...restCart } = prevCart; // Remove item if quantity is 0 or less
        toast({
          title: "Item Removed",
          description: `${itemToUpdate.name} removed from your cart.`,
          variant: "destructive"
        });
        return restCart;
      }
      toast({
        title: "Quantity Updated",
        description: `${itemToUpdate.name} quantity updated to ${newQuantity}.`,
      });
      return {
        ...prevCart,
        [itemId.toString()]: { ...itemToUpdate, quantity: newQuantity }
      };
    });
     console.log(`Updated item ${itemId} quantity to ${newQuantity}.`);
  };
  
  const totalCartItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);

  if (!restaurant) {
    return (
      <div className="flex flex-col min-h-screen">
        <NavigationMenu />
        <main className="flex-grow container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-semibold">Restaurant not found.</h1>
        </main>
        <Footer />
      </div>
    );
  }

  const menuCategories = Object.keys(restaurant.menu) as MenuCategory[];

  return (
    <div className="flex flex-col min-h-screen">
      <NavigationMenu cartItemCount={totalCartItems} isLoggedIn={true} />
      <main className="flex-grow">
        {/* Restaurant Header Section */}
        <section className="bg-gray-100 py-8">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-6">
            <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-white shadow-lg">
              <AvatarImage src={restaurant.imageUrl} alt={restaurant.name} />
              <AvatarFallback>{restaurant.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <Label htmlFor="restaurant-name" className="text-xs text-muted-foreground">Restaurant</Label>
              <h1 id="restaurant-name" className="text-3xl md:text-4xl font-bold text-gray-800">{restaurant.name}</h1>
              <div className="flex items-center gap-4 mt-2 text-gray-600">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" /> {restaurant.rating.toFixed(1)}
                </Badge>
                <Badge variant="outline">{restaurant.cuisine}</Badge>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" /> {restaurant.deliveryTime}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Menu Section */}
        <section className="container mx-auto px-4 py-8">
          <Tabs defaultValue={menuCategories[0]} className="w-full">
            <div className="flex justify-between items-center mb-4">
                <TabsList className="flex-wrap h-auto">
                {menuCategories.map(category => (
                    <TabsTrigger key={category} value={category} className="capitalize">
                    {category.replace('_', ' ')}
                    </TabsTrigger>
                ))}
                </TabsList>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline">
                            <ShoppingBag className="mr-2 h-4 w-4" /> View Allergen Info
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                        <DialogTitle>Allergen Information</DialogTitle>
                        </DialogHeader>
                        <p className="text-sm text-muted-foreground py-4">
                        Please inform your server of any allergies or dietary restrictions. Detailed allergen information for each dish can be provided upon request. We take cross-contamination seriously but cannot guarantee a completely allergen-free environment.
                        </p>
                    </DialogContent>
                </Dialog>
            </div>

            {menuCategories.map(category => (
              <TabsContent key={category} value={category}>
                <ScrollArea className="h-auto max-h-[calc(100vh-400px)]"> {/* Adjust max-h as needed */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-1">
                    {(restaurant.menu[category] as MenuItemData[]).map(item => (
                      <MenuItem
                        key={item.id}
                        {...item}
                        onAddToCart={handleAddToCart}
                        quantityInCart={cart[item.id]?.quantity || 0}
                        onUpdateQuantity={handleUpdateQuantity}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default RestaurantMenuPage;