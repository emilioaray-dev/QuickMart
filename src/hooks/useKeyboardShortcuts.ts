import { useEffect } from "react";

interface KeyboardShortcuts {
  onScanBarcode?: () => void;
  onClearCart?: () => void;
  onCheckout?: () => void;
  onSearch?: () => void;
  onHistory?: () => void;
}

export const useKeyboardShortcuts = ({
  onScanBarcode,
  onClearCart,
  onCheckout,
  onSearch,
  onHistory,
}: KeyboardShortcuts) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + B - Scan Barcode
      if ((event.ctrlKey || event.metaKey) && event.key === "b") {
        event.preventDefault();
        onScanBarcode?.();
      }

      // Ctrl/Cmd + K - Search
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        onSearch?.();
      }

      // Ctrl/Cmd + H - Order History
      if ((event.ctrlKey || event.metaKey) && event.key === "h") {
        event.preventDefault();
        onHistory?.();
      }

      // Ctrl/Cmd + Delete - Clear Cart
      if ((event.ctrlKey || event.metaKey) && event.key === "Delete") {
        event.preventDefault();
        onClearCart?.();
      }

      // Ctrl/Cmd + Enter - Checkout
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        onCheckout?.();
      }

      // F1 - Help (show shortcuts)
      if (event.key === "F1") {
        event.preventDefault();
        // Can be extended to show help modal
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onScanBarcode, onClearCart, onCheckout, onSearch, onHistory]);
};
