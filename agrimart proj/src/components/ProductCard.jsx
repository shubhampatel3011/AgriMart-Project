import { MapPin, User } from "lucide-react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => (
  <Link to={`/products/${product.id}`}>
    <div className="bg-card rounded-xl overflow-hidden shadow-md card-hover cursor-pointer h-full flex flex-col transition-all duration-300 hover:shadow-lg">
      <div className="h-48 overflow-hidden">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-heading font-bold text-lg text-foreground">{product.name}</h3>
          <span className="bg-primary/10 text-primary font-bold text-sm px-2 py-1 rounded">₹ {product.price}/Kg</span>
        </div>
        <p className="text-muted-foreground text-sm mb-3 flex-1">{product.description}</p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><User className="w-3 h-3" />{product.farmer}</span>
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{product.location}</span>
        </div>
      </div>
    </div>
  </Link>
);

export default ProductCard;
