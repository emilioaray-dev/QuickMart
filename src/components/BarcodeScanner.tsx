import { Scan, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { Product } from "@/types/product";

interface BarcodeScannerProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onProductFound: (product: Product) => void;
}

export const BarcodeScanner = ({
  isOpen,
  onClose,
  products,
  onProductFound,
}: BarcodeScannerProps) => {
  const [barcode, setBarcode] = useState("");
  const [scanning, setScanning] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setBarcode("");
      setScanning(false);
    }
  }, [isOpen]);

  const handleScan = () => {
    if (!barcode.trim()) return;

    setScanning(true);
    const product = products.find((p) => p.barcode === barcode);

    setTimeout(() => {
      setScanning(false);
      if (product) {
        onProductFound(product);
        setBarcode("");
        onClose();
      } else {
        alert(`No product found with barcode: ${barcode}`);
        setBarcode("");
      }
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleScan();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scan className="h-5 w-5" />
            Barcode Scanner
          </DialogTitle>
          <DialogDescription>
            Enter or scan a product barcode to add it to your cart
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="relative">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Scan or enter barcode..."
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-10 text-lg h-14"
              disabled={scanning}
            />
            {barcode && (
              <button
                onClick={() => setBarcode("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <Button onClick={handleScan} disabled={!barcode.trim() || scanning} className="flex-1">
              {scanning ? "Scanning..." : "Scan Product"}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>

          <div className="bg-muted rounded-lg p-4 space-y-2">
            <p className="text-sm font-semibold">Available Test Barcodes:</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {products.slice(0, 6).map((product) => (
                <div key={product.id} className="flex justify-between">
                  <span className="truncate">{product.name}:</span>
                  <code className="font-mono ml-2">{product.barcode}</code>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
