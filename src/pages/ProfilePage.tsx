import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import NavigationMenu from '@/components/layout/NavigationMenu';
import Footer from '@/components/layout/Footer';
import OrderStatusStepper from '@/components/OrderStatusStepper';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Package, User, MapPinIcon, CreditCardIcon, Settings, PlusCircle } from 'lucide-react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from '@/components/ui/use-toast';

// Schemas for forms
const accountSettingsSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
});
type AccountSettingsFormData = z.infer<typeof accountSettingsSchema>;

const addressSchema = z.object({
  id: z.string().optional(),
  type: z.enum(["Home", "Work", "Other"]),
  street: z.string().min(5, "Street is required"),
  city: z.string().min(2, "City is required"),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code"),
});
type AddressFormData = z.infer<typeof addressSchema>;


// Placeholder data
const userProfile = {
  fullName: 'Jane Foodie',
  email: 'jane.foodie@example.com',
  phone: '555-123-4567',
};

const orderHistory = [
  { 
    id: 'ORD123', date: '2023-10-26', total: 45.50, status: 'delivered', 
    currentStepId: 'delivered',
    items: [{name: 'Pepperoni Pizza', qty: 1}, {name: 'Coke', qty: 4}],
    restaurant: 'Pizza Planet' 
  },
  { 
    id: 'ORD456', date: '2023-10-28', total: 22.00, status: 'preparing', 
    currentStepId: 'preparing',
    items: [{name: 'Chicken Noodles', qty: 2}],
    restaurant: 'Noodle House' 
  },
];

const savedAddresses: AddressFormData[] = [
  { id: 'addr1', type: 'Home', street: '123 Main St', city: 'Foodville', zipCode: '12345' },
  { id: 'addr2', type: 'Work', street: '456 Business Ave', city: 'Worktown', zipCode: '67890' },
];

const savedPaymentMethods = [
  { id: 'pm1', type: 'Visa', last4: '4242', expiry: '12/25' },
  { id: 'pm2', type: 'MasterCard', last4: '5555', expiry: '06/26' },
];

const ProfilePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressFormData | null>(null);
  
  console.log('ProfilePage loaded');

  const activeTab = searchParams.get('tab') || 'orders';
  const setActiveTab = (tab: string) => {
    setSearchParams({ tab });
  };

  const accountForm = useForm<AccountSettingsFormData>({
    resolver: zodResolver(accountSettingsSchema),
    defaultValues: userProfile,
  });

  const addressForm = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: { type: "Home" }
  });

  const onAccountSubmit = (data: AccountSettingsFormData) => {
    console.log('Account settings updated:', data);
    toast({ title: "Success", description: "Account settings updated." });
  };

  const onAddressSubmit = (data: AddressFormData) => {
    console.log('Address saved:', data);
    if (editingAddress) {
      // Update logic for savedAddresses
      toast({ title: "Success", description: "Address updated." });
    } else {
      // Add logic for savedAddresses
      toast({ title: "Success", description: "Address added." });
    }
    setEditingAddress(null);
    setIsAddressDialogOpen(false);
    addressForm.reset({ type: "Home", street: "", city: "", zipCode: "" });
  };

  const openAddressDialog = (address?: AddressFormData) => {
    if (address) {
      setEditingAddress(address);
      addressForm.reset(address);
    } else {
      setEditingAddress(null);
      addressForm.reset({ type: "Home", street: "", city: "", zipCode: "" });
    }
    setIsAddressDialogOpen(true);
  };


  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavigationMenu cartItemCount={0} isLoggedIn={true} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
            <User className="h-10 w-10 mr-3 text-primary" />
            <h1 className="text-3xl font-bold">My Profile</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
            <TabsTrigger value="orders"><Package className="inline-block mr-2 h-4 w-4" />Order History</TabsTrigger>
            <TabsTrigger value="addresses"><MapPinIcon className="inline-block mr-2 h-4 w-4" />Saved Addresses</TabsTrigger>
            <TabsTrigger value="payments"><CreditCardIcon className="inline-block mr-2 h-4 w-4" />Payment Methods</TabsTrigger>
            <TabsTrigger value="settings"><Settings className="inline-block mr-2 h-4 w-4" />Account Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>View your past and current orders.</CardDescription>
              </CardHeader>
              <CardContent>
                {orderHistory.length === 0 ? <p>No orders yet.</p> : (
                  <Accordion type="single" collapsible className="w-full">
                    {orderHistory.map(order => (
                      <AccordionItem value={order.id} key={order.id}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex justify-between w-full pr-4">
                            <span>Order #{order.id} ({order.restaurant})</span>
                            <span className="text-sm text-muted-foreground">{order.date} - ${order.total.toFixed(2)}</span>
                            <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-4 pb-2">
                          <p className="font-semibold mb-2">Items:</p>
                          <ul className="list-disc list-inside text-sm text-muted-foreground mb-4">
                            {order.items.map(item => <li key={item.name}>{item.name} (x{item.qty})</li>)}
                          </ul>
                          {order.status !== 'delivered' && order.status !== 'cancelled' && (
                            <div className="mb-4">
                                <h4 className="font-semibold mb-2 text-sm">Order Status:</h4>
                                <OrderStatusStepper currentStepId={order.currentStepId} />
                            </div>
                          )}
                           <Button variant="outline" size="sm" onClick={() => navigate(`/restaurants/${order.restaurant.toLowerCase().replace(/\s+/g, '-')}`)}>Reorder from {order.restaurant}</Button>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="addresses">
            <Card>
              <CardHeader className="flex flex-row justify-between items-center">
                <div>
                    <CardTitle>Saved Addresses</CardTitle>
                    <CardDescription>Manage your delivery addresses.</CardDescription>
                </div>
                <Button onClick={() => openAddressDialog()}><PlusCircle className="mr-2 h-4 w-4"/>Add New Address</Button>
              </CardHeader>
              <CardContent>
                {savedAddresses.length === 0 ? <p>No saved addresses.</p> : (
                  <div className="space-y-4">
                    {savedAddresses.map(addr => (
                      <Card key={addr.id} className="p-4 flex justify-between items-center">
                        <div>
                          <p className="font-semibold">{addr.type} - {addr.street}</p>
                          <p className="text-sm text-muted-foreground">{addr.city}, {addr.zipCode}</p>
                        </div>
                        <div>
                            <Button variant="outline" size="sm" className="mr-2" onClick={() => openAddressDialog(addr)}>Edit</Button>
                            <Button variant="destructive" size="sm">Delete</Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader className="flex flex-row justify-between items-center">
                <div>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>Manage your saved payment methods.</CardDescription>
                </div>
                 <Button><PlusCircle className="mr-2 h-4 w-4"/>Add New Card</Button>
              </CardHeader>
              <CardContent>
                 {savedPaymentMethods.length === 0 ? <p>No saved payment methods.</p> : (
                  <div className="space-y-4">
                    {savedPaymentMethods.map(pm => (
                      <Card key={pm.id} className="p-4 flex justify-between items-center">
                        <div>
                          <p className="font-semibold">{pm.type} ending in •••• {pm.last4}</p>
                          <p className="text-sm text-muted-foreground">Expires: {pm.expiry}</p>
                        </div>
                        <Button variant="destructive" size="sm">Remove</Button>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Update your personal information.</CardDescription>
              </CardHeader>
              <Form {...accountForm}>
                <form onSubmit={accountForm.handleSubmit(onAccountSubmit)}>
                  <CardContent className="space-y-4">
                     <FormField control={accountForm.control} name="fullName" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                     <FormField control={accountForm.control} name="email" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl><Input type="email" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField control={accountForm.control} name="phone" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone Number (Optional)</FormLabel>
                            <FormControl><Input type="tel" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                  </CardContent>
                  <CardFooter>
                    <Button type="submit">Save Changes</Button>
                  </CardFooter>
                </form>
              </Form>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Address Dialog */}
        <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{editingAddress ? 'Edit Address' : 'Add New Address'}</DialogTitle>
                </DialogHeader>
                <Form {...addressForm}>
                    <form onSubmit={addressForm.handleSubmit(onAddressSubmit)} className="space-y-4 py-4">
                        <FormField control={addressForm.control} name="type" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Address Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="Home">Home</SelectItem>
                                        <SelectItem value="Work">Work</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}/>
                         <FormField control={addressForm.control} name="street" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Street Address</FormLabel>
                                <FormControl><Input placeholder="123 Main St" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={addressForm.control} name="city" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl><Input placeholder="Anytown" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                            <FormField control={addressForm.control} name="zipCode" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>ZIP Code</FormLabel>
                                    <FormControl><Input placeholder="12345" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                            <Button type="submit">Save Address</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>

      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;