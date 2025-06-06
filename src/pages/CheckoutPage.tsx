import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationMenu from '@/components/layout/NavigationMenu';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Terminal, CreditCard, AlertCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

// Placeholder schema - replace with actual validation
const checkoutSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code"),
  country: z.string().min(1, "Country is required"),
  paymentMethod: z.enum(["card", "paypal"], { required_error: "Payment method is required"}),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvc: z.string().optional(),
  savePaymentInfo: z.boolean().optional(),
  agreeToTerms: z.boolean().refine(val => val === true, { message: "You must agree to the terms" }),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

// Placeholder order summary
const orderSummary = {
  items: [
    { name: 'Margherita Pizza', quantity: 1, price: 12.99 },
    { name: 'Garlic Bread', quantity: 2, price: 5.99 },
  ],
  subtotal: 24.97,
  deliveryFee: 5.00,
  taxes: 2.00,
  total: 31.97,
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "card",
      savePaymentInfo: false,
      agreeToTerms: false,
    }
  });
  const [showOrderPlacedAlert, setShowOrderPlacedAlert] = React.useState(false);
  console.log('CheckoutPage loaded');

  const onSubmit = (data: CheckoutFormData) => {
    console.log('Checkout form data:', data);
    // Simulate API call
    setShowOrderPlacedAlert(true);
    toast({
      title: "Order Placed!",
      description: "Your order has been successfully placed. You will be redirected shortly.",
    });
    setTimeout(() => {
      navigate('/profile?tab=orders'); // Redirect to profile/order history
    }, 3000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavigationMenu cartItemCount={0} isLoggedIn={true} /> {/* Assuming cart is empty after checkout */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Checkout</h1>
        {showOrderPlacedAlert && (
          <Alert variant="default" className="mb-6 bg-green-100 border-green-400 text-green-700">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Order Placed Successfully!</AlertTitle>
            <AlertDescription>
              Thank you for your order. We're preparing it now. You can track its status in your profile.
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid md:grid-cols-3 gap-8">
            {/* Delivery & Payment Details Column */}
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField control={form.control} name="fullName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField control={form.control} name="address" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl><Input placeholder="123 Main St" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid sm:grid-cols-3 gap-4">
                    <FormField control={form.control} name="city" render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl><Input placeholder="Anytown" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField control={form.control} name="zipCode" render={({ field }) => (
                        <FormItem>
                          <FormLabel>ZIP Code</FormLabel>
                          <FormControl><Input placeholder="12345" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField control={form.control} name="country" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger></FormControl>
                            <SelectContent>
                              <SelectItem value="USA">United States</SelectItem>
                              <SelectItem value="CAN">Canada</SelectItem>
                              <SelectItem value="UK">United Kingdom</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   <FormField control={form.control} name="paymentMethod" render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl><RadioGroupItem value="card" /></FormControl>
                              <FormLabel className="font-normal">Credit/Debit Card</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl><RadioGroupItem value="paypal" /></FormControl>
                              <FormLabel className="font-normal">PayPal</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {form.watch("paymentMethod") === "card" && (
                    <div className="space-y-4 pt-4 border-t">
                      <FormField control={form.control} name="cardNumber" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Card Number</FormLabel>
                            <FormControl><Input placeholder="•••• •••• •••• ••••" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid sm:grid-cols-2 gap-4">
                        <FormField control={form.control} name="cardExpiry" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Expiry Date (MM/YY)</FormLabel>
                              <FormControl><Input placeholder="MM/YY" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField control={form.control} name="cardCvc" render={({ field }) => (
                            <FormItem>
                              <FormLabel>CVC</FormLabel>
                              <FormControl><Input placeholder="•••" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField control={form.control} name="savePaymentInfo" render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>Save payment information for next time</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary Column */}
            <div className="md:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                  <CardDescription>Review your items before placing order.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {orderSummary.items.map(item => (
                    <div key={item.name} className="flex justify-between text-sm">
                      <span>{item.name} (x{item.quantity})</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${orderSummary.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Delivery Fee</span>
                    <span>${orderSummary.deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Taxes</span>
                    <span>${orderSummary.taxes.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${orderSummary.total.toFixed(2)}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex-col items-stretch space-y-4">
                    <FormField control={form.control} name="agreeToTerms" render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            <div className="space-y-1 leading-none">
                            <FormLabel>I agree to the <a href="/terms" target="_blank" className="underline text-primary">Terms and Conditions</a></FormLabel>
                            <FormMessage/>
                            </div>
                        </FormItem>
                        )}
                    />
                  <Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting || showOrderPlacedAlert}>
                    {form.formState.isSubmitting ? 'Processing...' : 'Place Order'}
                  </Button>
                </CardFooter>
              </Card>
              {form.formState.errors.root && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
                </Alert>
              )}
            </div>
          </form>
        </Form>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;