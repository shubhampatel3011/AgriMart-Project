import { Leaf, Users, ShieldCheck, TrendingUp, Heart } from "lucide-react";
import hero2 from "@/assets/hero-2.jpg";

const About = () => {
  const stats = [
    { label: "Farmers Empowered", value: "5,000+", icon: Leaf },
    { label: "Happy Customers", value: "20,000+", icon: Users },
    { label: "Products Delivered", value: "50,000+", icon: ShoppingBag },
  ];

  const values = [
    {
      title: "Direct Connection",
      description: "We eliminate middlemen, ensuring farmers get better prices and consumers get fresher products.",
      icon: Users,
    },
    {
      title: "Quality Assurance",
      description: "Every product on AgriMart undergoes quality checks to ensure you receive only the best produce.",
      icon: ShieldCheck,
    },
    {
      title: "Sustainable Growth",
      description: "We promote sustainable farming practices that benefit both the environment and the farming community.",
      icon: TrendingUp,
    },
    {
      title: "Built with Heart",
      description: "Our platform is designed to support the backbone of our country—our hardworking farmers.",
      icon: Heart,
    },
  ];

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <div className="relative h-[400px] flex items-center justify-center text-center px-4 overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${hero2})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        </div>
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-block px-4 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 font-bold text-sm mb-4 animate-fade-in">
            OUR MISSION
          </span>
          <h1 className="text-4xl md:text-6xl font-heading font-extrabold text-white mb-6 animate-slide-up">
            Empowering Farmers, <br />
            <span className="text-primary text-glow">Feeding the Future</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 leading-relaxed animate-slide-up delay-100">
            AgriMart is a direct-to-consumer marketplace designed to bridge the gap between rural farmers and urban consumers.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16 relative z-20">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {[
            { label: "Farmers Joined", value: "2,500+", color: "text-emerald-500" },
            { label: "Cities Covered", value: "15+", color: "text-blue-500" },
            { label: "Fresh Orders", value: "10,000+", color: "text-orange-500" },
          ].map((stat, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-8 shadow-xl text-center transform hover:-translate-y-2 transition-transform duration-300">
              <div className={`text-4xl font-heading font-black mb-2 ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-muted-foreground font-semibold uppercase tracking-wider text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Our Story */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
          <div>
            <h2 className="section-title text-left mb-6">
              Our <span className="text-primary italic">Story</span>
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
              <p>
                Founded in 2026, AgriMart started with a simple observation: farmers were working harder than ever but earning less, while consumers were paying more for produce that wasn't always fresh.
              </p>
              <p>
                We realized that the traditional supply chain was broken, with multiple intermediaries each taking a cut while providing little value to either the farmer or the buyer.
              </p>
              <p className="font-medium text-foreground italic border-l-4 border-primary pl-4 py-2">
                "Our goal was to create a digital bridge that brings the farm directly to the kitchen table."
              </p>
              <p>
                Today, AgriMart serves thousands of families in Gujarat, providing them with farm-fresh vegetables, fruits, and grains while ensuring our farmer partners receive fair, transparent pricing.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-primary/10 rounded-2xl rotate-3 -z-10" />
            <img 
              src={hero2} 
              alt="Farmers" 
              className="rounded-2xl shadow-2xl w-full h-[500px] object-cover"
            />
          </div>
        </div>

        {/* Our Values */}
        <div className="text-center mb-16">
          <h2 className="section-title">
            The <span className="text-primary">AgriMart</span> Values
          </h2>
          <p className="section-subtitle">What drives us every single day</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
          {values.map((v, i) => (
            <div key={i} className="bg-card border border-border p-8 rounded-2xl hover:border-primary/50 transition-colors group">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <v.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{v.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {v.description}
              </p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="bg-primary rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl shadow-primary/30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
          
          <h2 className="text-3xl md:text-5xl font-heading font-black mb-6 relative z-10">
            Ready to taste the <span className="italic">freshness</span>?
          </h2>
          <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto relative z-10">
            Join thousands of smart consumers who buy directly from the source. Support local farmers and eat healthier.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <a href="/products" className="px-10 py-4 bg-white text-primary font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-lg shadow-black/10">
              Browse Products
            </a>
            <a href="/register" className="px-10 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-colors">
              Join as Farmer
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Missing Lucide icons from imports above */
import { ShoppingBag } from "lucide-react";

export default About;
