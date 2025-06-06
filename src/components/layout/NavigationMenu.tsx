import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'; // For mobile menu
import { Menu, ShoppingCart, UserCircle2, Utensils } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
}

interface NavigationMenuProps {
  navItems?: NavItem[];
  cartItemCount?: number;
  isLoggedIn?: boolean;
}

const defaultNavItems: NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/restaurants', label: 'Restaurants' },
  { href: '/offers', label: 'Offers' },
];

const NavigationMenu: React.FC<NavigationMenuProps> = ({
  navItems = defaultNavItems,
  cartItemCount = 0,
  isLoggedIn = false,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderNavLinks = (isMobile: boolean = false) => (
    navItems.map((item) => (
      <Link
        key={item.href}
        to={item.href}
        onClick={() => isMobile && setIsMobileMenuOpen(false)}
        className={`text-sm font-medium transition-colors hover:text-primary ${
          isMobile ? 'block py-2 px-3 rounded-md hover:bg-accent' : 'text-muted-foreground'
        }`}
      >
        {item.label}
      </Link>
    ))
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <Utensils className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block">FoodieApp</span>
        </Link>

        <nav className="hidden gap-6 md:flex">
          {renderNavLinks()}
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <Link to="/cart">
            <Button variant="ghost" size="icon" aria-label="Shopping Cart">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </Link>
          <Link to={isLoggedIn ? "/profile" : "/login"}>
            <Button variant="ghost" size="icon" aria-label="User Profile">
              <UserCircle2 className="h-5 w-5" />
            </Button>
          </Link>

          {/* Mobile Menu Trigger */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4 mt-8">
                  {renderNavLinks(true)}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavigationMenu;