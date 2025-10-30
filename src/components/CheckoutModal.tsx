import { CheckCircle, CreditCard, Wallet } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import type { CartItem } from "@/types/product";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
  discount?: number;
  onComplete: (paymentMethod: "card" | "cash") => void;
}

export const CheckoutModal = ({
  isOpen,
  onClose,
  items,
  total,
  discount,
  onComplete,
}: CheckoutModalProps) => {
  const { t } = useLanguage();
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash" | null>(null);
  const [processing, setProcessing] = useState(false);
  const [complete, setComplete] = useState(false);

  const handlePayment = async () => {
    if (!paymentMethod) return;

    setProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setProcessing(false);
    setComplete(true);

    setTimeout(() => {
      onComplete(paymentMethod);
      setComplete(false);
      setPaymentMethod(null);
      onClose();
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{complete ? t.paymentSuccessful : t.selectPaymentMethod}</DialogTitle>
        </DialogHeader>

        {complete ? (
          <div className="flex flex-col items-center justify-center py-8">
            <CheckCircle className="h-20 w-20 text-primary mb-4" />
            <p className="text-lg font-semibold">{t.thankYou}</p>
            <p className="text-muted-foreground">
              {t.total} ${total.toFixed(2)}
            </p>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <button
                onClick={() => setPaymentMethod("card")}
                className={cn(
                  "w-full p-6 rounded-lg border-2 transition-all flex items-center gap-4 hover:border-primary",
                  paymentMethod === "card" ? "border-primary bg-accent" : "border-border",
                )}
              >
                <CreditCard className="h-8 w-8" />
                <div className="text-left">
                  <p className="font-semibold">{t.creditDebitCard}</p>
                  <p className="text-sm text-muted-foreground">{t.cardDescription}</p>
                </div>
              </button>

              <button
                onClick={() => setPaymentMethod("cash")}
                className={cn(
                  "w-full p-6 rounded-lg border-2 transition-all flex items-center gap-4 hover:border-primary",
                  paymentMethod === "cash" ? "border-primary bg-accent" : "border-border",
                )}
              >
                <Wallet className="h-8 w-8" />
                <div className="text-left">
                  <p className="font-semibold">{t.cash}</p>
                  <p className="text-sm text-muted-foreground">{t.cashDescription}</p>
                </div>
              </button>
            </div>

            <div className="space-y-2 p-4 bg-muted rounded-lg">
              {discount && discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>{t.discountApplied}</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="font-semibold">{t.totalAmount}</span>
                <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
              </div>
            </div>

            <Button
              className="w-full h-12 text-base font-semibold"
              disabled={!paymentMethod || processing}
              onClick={handlePayment}
            >
              {processing ? t.processing : t.completePayment}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
