import { BarChart3, History, Scan, ShoppingCart } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { BarcodeScanner } from "@/components/BarcodeScanner";
import { CartSidebar } from "@/components/CartSidebar";
import { CheckoutModal } from "@/components/CheckoutModal";
import { LanguageSelector } from "@/components/LanguageSelector";
import { OrderHistory } from "@/components/OrderHistory";
import { ProductCard } from "@/components/ProductCard";
import { ProductSearch } from "@/components/ProductSearch";
import { StatsDashboard } from "@/components/StatsDashboard";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { comprehensiveProducts as products } from "@/data/comprehensiveProducts";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { Order } from "@/types/order";
import type { CartItem, Product } from "@/types/product";
import { printReceipt } from "@/utils/printReceipt";
import { translateCategory } from "@/utils/translateCategory";
import { getProductName } from "@/utils/translateProduct";

const Index = () => {
  const { t, language } = useLanguage();
  const [cart, setCart] = useLocalStorage<CartItem[]>("cart", []);
  const [orders, setOrders] = useLocalStorage<Order[]>("orders", []);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [discount, setDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState<string | undefined>();

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      const productName = getProductName(product, language);
      if (existing) {
        toast.success(`${t.addedAnotherToCart} ${productName}`);
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      toast.success(`${productName} ${t.addedToCart}`);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, change: number) => {
    setCart((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + change } : item,
      );
      return updated.filter((item) => item.quantity > 0);
    });
  };

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    toast.info(t.itemRemoved);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error(t.cartIsEmpty);
      return;
    }
    setCheckoutOpen(true);
  };

  const handleCheckoutComplete = (paymentMethod: "card" | "cash") => {
    const order: Order = {
      id: crypto.randomUUID(),
      items: [...cart],
      total: finalTotal,
      paymentMethod,
      date: new Date().toISOString(),
      discount: discount > 0 ? discount : undefined,
      couponCode: couponCode,
    };

    setOrders((prev) => [order, ...prev]);
    setCart([]);
    setDiscount(0);
    setCouponCode(undefined);
    toast.success(t.purchaseComplete);
  };

  const handleApplyCoupon = (code: string, discountValue: number) => {
    setCouponCode(code);
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const calculatedDiscount =
      discountValue < 1 ? subtotal * discountValue : Math.min(discountValue, subtotal);
    setDiscount(calculatedDiscount);
  };

  const handleRemoveCoupon = () => {
    setCouponCode(undefined);
    setDiscount(0);
    toast.info(t.couponRemoved);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const finalTotal = Math.max(0, subtotal - discount);

  const categories = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.category)));
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        searchQuery === "" ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  useKeyboardShortcuts({
    onScanBarcode: () => setScannerOpen(true),
    onCheckout: handleCheckout,
    onHistory: () => setHistoryOpen(true),
    onClearCart: () => {
      if (cart.length > 0) {
        setCart([]);
        toast.info(t.cartCleared);
      }
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-primary shadow-lg">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl">
                <ShoppingCart className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">{t.appName}</h1>
                <p className="text-sm text-white/90 font-medium">{t.appSubtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setScannerOpen(true)}
                className="shadow-md hover:shadow-lg transition-shadow"
              >
                <Scan className="h-4 w-4 mr-2" />
                {t.scan}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setHistoryOpen(true)}
                className="shadow-md hover:shadow-lg transition-shadow"
              >
                <History className="h-4 w-4 mr-2" />
                {t.history}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setStatsOpen(true)}
                className="shadow-md hover:shadow-lg transition-shadow"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                {t.stats}
              </Button>
              <LanguageSelector />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ProductSearch
              onSearchChange={setSearchQuery}
              onCategoryChange={setSelectedCategory}
              categories={categories}
            />

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">{t.noProductsFound}</p>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-4">
                  {selectedCategory === "all"
                    ? t.allProducts
                    : translateCategory(selectedCategory, t)}
                  <span className="text-muted-foreground text-sm ml-2">
                    ({filteredProducts.length} {t.items})
                  </span>
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <CartSidebar
                items={cart}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeItem}
                onCheckout={handleCheckout}
                subtotal={subtotal}
                discount={discount}
                total={finalTotal}
                onApplyCoupon={handleApplyCoupon}
                onRemoveCoupon={handleRemoveCoupon}
                currentCoupon={couponCode}
              />
            </div>
          </div>
        </div>
      </div>

      <BarcodeScanner
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
        products={products}
        onProductFound={addToCart}
      />

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        items={cart}
        total={finalTotal}
        discount={discount}
        onComplete={handleCheckoutComplete}
      />

      <OrderHistory
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        orders={orders}
        onPrintReceipt={printReceipt}
      />

      <StatsDashboard isOpen={statsOpen} onClose={() => setStatsOpen(false)} orders={orders} />
    </div>
  );
};

export default Index;
