import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CouponInput } from "@/components/CouponInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";
import type { CartItem } from "@/types/product";
import { getProductName } from "@/utils/translateProduct";

interface CartSidebarProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, change: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
  subtotal: number;
  discount: number;
  total: number;
  onApplyCoupon: (code: string, discount: number) => void;
  onRemoveCoupon: () => void;
  currentCoupon?: string;
}

export const CartSidebar = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  subtotal,
  discount,
  total,
  onApplyCoupon,
  onRemoveCoupon,
  currentCoupon,
}: CartSidebarProps) => {
  const { t, language } = useLanguage();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Card className="h-full flex flex-col border-2 shadow-lg">
      <CardHeader className="pb-4 bg-gradient-to-r from-primary/5 to-primary/10 border-b-2 border-primary/20">
        <CardTitle className="flex items-center gap-2 text-primary">
          <div className="bg-primary/10 p-2 rounded-lg">
            <ShoppingCart className="h-5 w-5 text-primary" />
          </div>
          <span className="font-bold">
            {t.cart} ({itemCount})
          </span>
        </CardTitle>
      </CardHeader>
      <Separator className="bg-primary/20" />
      <ScrollArea className="flex-1 px-6">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">{t.cartEmpty}</p>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors border border-border/50"
              >
                <img
                  src={item.image}
                  alt={getProductName(item, language)}
                  className="w-16 h-16 object-cover rounded-lg shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm truncate">
                    {getProductName(item, language)}
                  </h4>
                  <p className="text-sm font-bold text-primary">${item.price.toFixed(2)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-7 w-7"
                      onClick={() => onUpdateQuantity(item.id, -1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-7 w-7"
                      onClick={() => onUpdateQuantity(item.id, 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 ml-auto text-destructive hover:text-destructive"
                      onClick={() => onRemoveItem(item.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
      <Separator />
      <CardContent className="pt-4 space-y-4">
        <CouponInput
          onApplyCoupon={onApplyCoupon}
          currentCoupon={currentCoupon}
          onRemoveCoupon={onRemoveCoupon}
        />

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{t.subtotal}</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>{t.discount}</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between items-center text-lg font-bold">
            <span>{t.total}</span>
            <span className="text-2xl text-primary">${total.toFixed(2)}</span>
          </div>
        </div>

        <Button
          className="w-full h-14 text-base font-bold bg-gradient-to-r from-secondary to-secondary/90 hover:from-secondary/90 hover:to-secondary shadow-lg hover:shadow-xl transition-all"
          disabled={items.length === 0}
          onClick={onCheckout}
        >
          {t.proceedToPayment}
        </Button>
      </CardContent>
    </Card>
  );
};
