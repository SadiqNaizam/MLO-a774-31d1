import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, Utensils } from 'lucide-react';

const Footer: React.FC = () => {
  console.log("Rendering Footer");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/50 border-t mt-12">
      <div className="container py-8 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Column 1: Brand */}
          <div className="space-y-3">
            <Link to="/" className="flex items-center space-x-2">
              <Utensils className="h-7 w-7 text-primary" />
              <span className="text-xl font-bold">FoodieApp</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your favorite food, delivered fast.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/restaurants" className="text-muted-foreground hover:text-primary">Browse Restaurants</Link></li>
              <li><Link to="/offers" className="text-muted-foreground hover:text-primary">Special Offers</Link></li>
              <li><Link to="/help" className="text-muted-foreground hover:text-primary">Help Center</Link></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-muted-foreground hover:text-primary">About Us</Link></li>
              <li><Link to="/careers" className="text-muted-foreground hover:text-primary">Careers</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-primary">Contact</Link></li>
            </ul>
          </div>

          {/* Column 4: Social Media */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider">Follow Us</h3>
            <div className="flex space-x-3">
              <a href="#" className="text-muted-foreground hover:text-primary"><span className="sr-only">Twitter</span><Twitter className="h-5 w-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-primary"><span className="sr-only">LinkedIn</span><Linkedin className="h-5 w-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-primary"><span className="sr-only">GitHub</span><Github className="h-5 w-5" /></a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t pt-8 text-center md:flex md:justify-between">
          <p className="text-sm text-muted-foreground">&copy; {currentYear} FoodieApp. All rights reserved.</p>
          <div className="text-sm text-muted-foreground mt-2 md:mt-0">
            <Link to="/privacy" className="hover:text-primary">Privacy Policy</Link> | <Link to="/terms" className="hover:text-primary">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;