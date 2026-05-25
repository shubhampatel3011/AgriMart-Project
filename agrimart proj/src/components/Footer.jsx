import { Link } from "react-router-dom";
import { Leaf, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const Footer = () => (
  <footer className="bg-primary text-primary-foreground">
    <div className="container mx-auto section-padding">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* About */}
        <div>
          <div className="flex items-center gap-2 font-heading font-bold text-xl mb-4">
            <Leaf className="w-6 h-6" /> AgriMart
          </div>
          <p className="text-sm opacity-80 leading-relaxed">
            Connecting farmers directly to buyers for fresh, affordable agricultural products. Empowering rural communities through technology.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-heading font-bold text-lg mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm opacity-80">
            {["/", "/products", "/about", "/feedback"].map((p) => (
              <li key={p}>
                <Link to={p} className="hover:opacity-100 transition-opacity">
                  {p === "/" ? "Home" : p.slice(1).charAt(0).toUpperCase() + p.slice(2)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-heading font-bold text-lg mb-4">Contact Us</h4>
          <ul className="space-y-3 text-sm opacity-80">
            <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> 123 Farm Road, Agri City</li>
            <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> +91 9427038168</li>
            <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> support@agrimart.com</li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="font-heading font-bold text-lg mb-4">Follow Us</h4>
          <div className="flex gap-3">
            {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
              <a key={i} href="#" className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/30 transition-colors">
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
    <div className="border-t border-primary-foreground/20 py-4 text-center text-sm opacity-70">
      © 2026 AgriMart. All rights reserved. | Farmer to Buyer Marketplace | Developed by Patel Shubham
    </div>
  </footer>
);

export default Footer;
