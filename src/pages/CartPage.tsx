import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavigationMenu from '@/components/layout/NavigationMenu';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

const initialCartItems: CartItem[] = [
  { id: 'm1', name: 'Margherita Pizza', price: 12.99, quantity: 1, imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGl6emF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=100&q=60' },
  { id: 'a1', name: 'Garlic Bread', price: 5.99, quantity: 2, imageUrl: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Z2FybGljJTIwYnJlYWR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=100&q=60' },
];

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const navigate = useNavigate();
  console.log('CartPage loaded');

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return; // Or remove item if 0
    setCartItems(items => items.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
    toast({ description: "Item quantity updated." });
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
    toast({ title: "Item Removed", description: "Item removed from your cart.", variant: "destructive" });
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? 5.00 : 0; // Example fee
  const taxes = subtotal * 0.08; // Example tax rate
  const total = subtotal + deliveryFee + taxes;
  
  const totalCartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);


  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavigationMenu cartItemCount={totalCartItemsCount} isLoggedIn={true} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="max-w-3xl mx-auto shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-bold text-center">Your Shopping Cart</CardTitle>
          </CardHeader>
          <CardContent>
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600 mb-4">Your cart is empty.</p>
                <Button onClick={() => navigate('/')}>Start Shopping</Button>
              </div>
            ) : (
              <div className="space-y-6">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                    {item.imageUrl && (
                      <img src={item.imageUrl} alt={item.name} className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-md" />
                    )}
                    <div className="flex-grow">
                      <h3 className="font-semibold text-md md:text-lg">{item.name}</h3>
                      <p className="text-sm text-primary font-medium">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleQuantityChange(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                        className="w-12 h-9 text-center"
                        min="1"
                      />
                      <Button variant="outline" size="icon" onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                ))}
                <Separator />
                <div className="space-y-2 text-md">
                  <div className="flex justify-between">
                    <Label>Subtotal:</Label>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <Label>Delivery Fee:</Label>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <Label>Taxes (est.):</Label>
                    <span>${taxes.toFixed(2)}</span>
                  </div>
                  <Separator className="my-2"/>
                  <div className="flex justify-between font-bold text-lg">
                    <Label>Total:</Label>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          {cartItems.length > 0 && (
            <CardFooter className="flex justify-end pt-6">
              <Button size="lg" className="w-full sm:w-auto" onClick={() => navigate('/checkout')}>
                Proceed to Checkout
              </Button>
            </CardFooter>
          )}
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;