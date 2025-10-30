import { Tag, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";

interface CouponInputProps {
  onApplyCoupon: (code: string, discount: number) => void;
  currentCoupon?: string;
  onRemoveCoupon: () => void;
}

const VALID_COUPONS = {
  SAVE10: { discount: 0.1, description: "10% off" },
  SAVE20: { discount: 0.2, description: "20% off" },
  FIRST5: { discount: 5, description: "$5 off" },
  WELCOME: { discount: 0.15, description: "15% off" },
};

export const CouponInput = ({ onApplyCoupon, currentCoupon, onRemoveCoupon }: CouponInputProps) => {
  const { t } = useLanguage();
  const [code, setCode] = useState("");
  const [applying, setApplying] = useState(false);

  const handleApply = () => {
    if (!code.trim()) return;

    setApplying(true);
    setTimeout(() => {
      const coupon = VALID_COUPONS[code.toUpperCase() as keyof typeof VALID_COUPONS];

      if (coupon) {
        onApplyCoupon(code.toUpperCase(), coupon.discount);
        toast.success(t.couponApplied);
        setCode("");
      } else {
        toast.error(t.invalidCoupon);
      }
      setApplying(false);
    }, 500);
  };

  if (currentCoupon) {
    return (
      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-2 text-sm">
          <Tag className="h-4 w-4 text-green-600" />
          <span className="font-medium text-green-600">{t.couponLabel} {currentCoupon}</span>
        </div>
        <button
          onClick={onRemoveCoupon}
          className="text-green-600 hover:text-green-700"
          title={t.remove}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t.enterCouponCode}
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyPress={(e) => e.key === "Enter" && handleApply()}
            className="pl-10"
            disabled={applying}
          />
        </div>
        <Button onClick={handleApply} disabled={!code.trim() || applying} variant="outline">
          {applying ? `${t.apply}...` : t.apply}
        </Button>
      </div>
      <div className="text-xs text-muted-foreground">
        <p>{t.availableCoupons}</p>
      </div>
    </div>
  );
};
