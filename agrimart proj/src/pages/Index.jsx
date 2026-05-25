import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Truck, Leaf, DollarSign, Users, TrendingUp, Upload, Search, ShoppingCart, Star } from "lucide-react";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
import aboutImg from "@/assets/about-farming.jpg";
import ProductCard from "@/components/ProductCard";
import { useUser } from "@/context/UserContext";

const heroSlides = [
  { img: hero1, heading: "Welcome to AgriMart", sub: "Connecting Farmers and Buyers Directly" },
  { img: hero2, heading: "Fresh From the Farm", sub: "Quality Agricultural Products at Fair Prices" },
  { img: hero3, heading: "Empowering Farmers", sub: "A Transparent Marketplace for Everyone" },
];

const features = [
  { icon: Users, title: "Direct Farmer to Buyer", desc: "Eliminate middlemen and connect directly." },
  { icon: ShoppingCart, title: "Easy Product Booking", desc: "Book fresh produce in a few clicks." },
  { icon: ShieldCheck, title: "Secure Marketplace", desc: "Safe and trusted platform." },
  { icon: Leaf, title: "Fresh Products", desc: "Farm-fresh agricultural goods daily." },
  { icon: DollarSign, title: "Transparent Pricing", desc: "Fair prices for both farmers and buyers." },
  { icon: TrendingUp, title: "Farmer Empowerment", desc: "Helping farmers grow their business." },
];

const steps = [
  { icon: Upload, title: "Farmers Upload Products", desc: "List your product with photos and prices." },
  { icon: Search, title: "Buyers Browse Products", desc: "Search and filter from a wide catalog." },
  { icon: Truck, title: "Book & Receive", desc: "Book products and get them delivered." },
];

const testimonials = [
  { name: "Ramesh Verma", role: "Farmer", text: "AgriMart helped me sell directly to buyers. My income has doubled!", rating: 5 },
  { name: "Priya Sharma", role: "Buyer", text: "Fresh vegetables at great prices, delivered to my doorstep.", rating: 5 },
  { name: "Manoj Tiwari", role: "Farmer", text: "The platform is easy to use and I get fair prices for my crops.", rating: 4 },
];

const Index = () => {
  const { products } = useUser();
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % heroSlides.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div>
      {/* Hero Carousel */}
      <section className="relative h-[70vh] md:h-[85vh] overflow-hidden">
        {heroSlides.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${i === slide ? "opacity-100" : "opacity-0"}`}
          >
            <img src={s.img} alt={s.heading} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-foreground/50" />
          </div>
        ))}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold text-primary-foreground mb-4 font-heading animate-fade-in">
            {heroSlides[slide].heading}
          </h1>
          <p className="text-lg md:text-2xl text-primary-foreground/90 mb-8 max-w-2xl animate-fade-in" style={{ animationDelay: "0.2s" }}>
            {heroSlides[slide].sub}
          </p>
          <div className="flex flex-wrap gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <Link to="/products" className="btn-primary text-lg">View Products</Link>
            <Link to="/farmer/login" className="btn-accent text-lg">Join as Farmer</Link>
          </div>
        </div>
        {/* Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {heroSlides.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)} className={`w-3 h-3 rounded-full transition-all ${i === slide ? "bg-primary-foreground w-8" : "bg-primary-foreground/50"}`} />
          ))}
        </div>
      </section>

      {/* About */}
      <section className="section-padding bg-card">
        <div className="container mx-auto">
          <h2 className="section-title text-foreground">About <span className="text-primary">AgriMart</span></h2>
          <p className="section-subtitle">Bridging the gap between farmers and buyers through technology</p>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <img src={aboutImg} alt="About AgriMart" className="rounded-xl shadow-lg w-full" />
            <div className="space-y-4">
              <p className="text-foreground leading-relaxed">
                AgriMart is a revolutionary platform that connects farmers directly with buyers, eliminating middlemen and ensuring fair prices for agricultural products. Our mission is to empower rural communities through accessible digital marketplace technology.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Whether you're a farmer looking to reach more customers or a buyer seeking fresh, quality produce, AgriMart provides a secure and transparent platform for all your agricultural trading needs.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Join thousands of farmers and buyers who trust AgriMart for their daily agricultural commerce.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding">
        <div className="container mx-auto">
          <h2 className="section-title text-foreground">Our <span className="text-primary">Features</span></h2>
          <p className="section-subtitle">Everything you need in an agricultural marketplace</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-card rounded-xl p-6 card-hover text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-heading font-bold text-lg mb-2 text-foreground">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-primary/5">
        <div className="container mx-auto">
          <h2 className="section-title text-foreground">How It <span className="text-primary">Works</span></h2>
          <p className="section-subtitle">Three simple steps to get started</p>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-primary flex items-center justify-center mb-4 shadow-lg">
                  <s.icon className="w-9 h-9 text-primary-foreground" />
                </div>
                <div className="text-3xl font-extrabold text-primary/30 mb-2">0{i + 1}</div>
                <h3 className="font-heading font-bold text-xl mb-2 text-foreground">{s.title}</h3>
                <p className="text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Preview */}
      <section className="section-padding bg-card">
        <div className="container mx-auto">
          <h2 className="section-title text-foreground">Featured <span className="text-primary">Products</span></h2>
          <p className="section-subtitle">Fresh from farms across the country</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.slice(0, 6).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/products" className="btn-primary text-lg">View All Products</Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding">
        <div className="container mx-auto">
          <h2 className="section-title text-foreground">What People <span className="text-primary">Say</span></h2>
          <p className="section-subtitle">Trusted by farmers and buyers alike</p>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-card rounded-xl p-6 shadow-md card-hover">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className={`w-4 h-4 ${j < t.rating ? "text-accent fill-accent" : "text-muted-foreground"}`} />
                  ))}
                </div>
                <p className="text-foreground mb-4 italic">"{t.text}"</p>
                <div className="font-heading font-bold text-foreground">{t.name}</div>
                <div className="text-sm text-muted-foreground">{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
