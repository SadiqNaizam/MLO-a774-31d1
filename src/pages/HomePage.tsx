import React, { useState } from 'react';
import NavigationMenu from '@/components/layout/NavigationMenu';
import Footer from '@/components/layout/Footer';
import CuisineTag from '@/components/CuisineTag';
import RestaurantCard from '@/components/RestaurantCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, MapPin } from 'lucide-react';

const placeholderCuisines = ['Italian', 'Mexican', 'Chinese', 'Indian', 'Japanese', 'Vegan'];
const placeholderRestaurants = [
  { id: '1', name: 'Pizza Paradise', imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGl6emF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60', rating: 4.5, reviewCount: 150, cuisineTypes: ['Italian', 'Pizza'], deliveryTime: '25-35 min', priceRange: '$$' },
  { id: '2', name: 'Taco Fiesta', imageUrl: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dGFjb3N8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60', rating: 4.2, reviewCount: 120, cuisineTypes: ['Mexican'], deliveryTime: '20-30 min', priceRange: '$' },
  { id: '3', name: 'Sushi World', imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c3VzaGl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60', rating: 4.8, reviewCount: 200, cuisineTypes: ['Japanese', 'Sushi'], deliveryTime: '30-40 min', priceRange: '$$$' },
  { id: '4', name: 'Curry House', imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aW5kaWFuJTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60', rating: 4.6, reviewCount: 180, cuisineTypes: ['Indian'], deliveryTime: '35-45 min', priceRange: '$$' },
];

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCuisine, setActiveCuisine] = useState<string | null>(null);
  console.log('HomePage loaded');

  const handleCuisineClick = (cuisineName: string) => {
    setActiveCuisine(prev => prev === cuisineName ? null : cuisineName);
    console.log('Selected cuisine:', cuisineName);
  };

  const filteredRestaurants = placeholderRestaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          restaurant.cuisineTypes.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCuisine = activeCuisine ? restaurant.cuisineTypes.includes(activeCuisine) : true;
    return matchesSearch && matchesCuisine;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <NavigationMenu cartItemCount={3} isLoggedIn={false} />
      <main className="flex-grow">
        {/* Hero/Search Section */}
        <section className="py-12 md:py-20 bg-gradient-to-r from-green-50 to-cyan-50">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Discover Your Next Favorite Meal
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Search for restaurants, browse cuisines, and get food delivered to your doorstep.
            </p>
            <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search restaurants or cuisines..."
                  className="pl-10 pr-4 py-3 w-full h-12 text-base"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button size="lg" className="h-12 text-base">
                <MapPin className="mr-2 h-5 w-5" /> Use Current Location
              </Button>
            </div>
          </div>
        </section>

        {/* Cuisine Filters Section */}
        <section className="py-8 container mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-4 text-center sm:text-left">Or Browse by Cuisine</h2>
          <ScrollArea className="w-full whitespace-nowrap pb-4">
            <div className="flex space-x-3">
              {placeholderCuisines.map(cuisine => (
                <CuisineTag
                  key={cuisine}
                  cuisineName={cuisine}
                  isActive={activeCuisine === cuisine}
                  onClick={handleCuisineClick}
                />
              ))}
            </div>
          </ScrollArea>
        </section>

        {/* Restaurant Listing Section */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">
              {activeCuisine ? `${activeCuisine} Restaurants` : 'Popular Restaurants Nearby'}
            </h2>
            {filteredRestaurants.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredRestaurants.map(restaurant => (
                  <RestaurantCard key={restaurant.id} {...restaurant} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 text-lg">No restaurants found matching your criteria. Try a different search or cuisine!</p>
            )}
            {filteredRestaurants.length > 4 && ( /* Example condition for load more */
                 <div className="mt-12 text-center">
                    <Button variant="outline" size="lg">Load More Restaurants</Button>
                 </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;