import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Product } from "@/types/product";
import { translateCategory } from "@/utils/translateCategory";
import { getProductName } from "@/utils/translateProduct";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const { t, language } = useLanguage();

  const handleClick = () => {
    onAddToCart(product);
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group border-2 hover:border-primary/30">
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-muted to-muted/50">
          <img
            src={product.image}
            alt={getProductName(product, language)}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-2 right-2">
            <span className="category-badge shadow-sm">
              {translateCategory(product.category, t)}
            </span>
          </div>
        </div>
        <div className="p-4 space-y-3 bg-card">
          <div className="min-h-[3rem]">
            <h3 className="font-bold text-base leading-tight text-foreground line-clamp-2">
              {getProductName(product, language)}
            </h3>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                {t.priceLabel}
              </span>
              <span className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</span>
            </div>
            <Button
              size="icon"
              onClick={handleClick}
              className="rounded-full h-12 w-12 bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
