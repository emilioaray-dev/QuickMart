import type { Order } from "@/types/order";

export const printReceipt = (order: Order) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const receiptHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Receipt - Order #${order.id.slice(0, 8)}</title>
        <style>
          @media print {
            body { margin: 0; }
          }
          body {
            font-family: 'Courier New', monospace;
            max-width: 300px;
            margin: 20px auto;
            padding: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px dashed #000;
            padding-bottom: 10px;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .header p {
            margin: 5px 0;
            font-size: 12px;
          }
          .order-info {
            margin-bottom: 15px;
            font-size: 12px;
          }
          .items {
            margin-bottom: 15px;
          }
          .item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
            font-size: 12px;
          }
          .totals {
            border-top: 2px dashed #000;
            padding-top: 10px;
            margin-top: 10px;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
            font-size: 14px;
          }
          .total-row.grand {
            font-weight: bold;
            font-size: 16px;
            border-top: 1px solid #000;
            padding-top: 5px;
            margin-top: 5px;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            padding-top: 10px;
            border-top: 2px dashed #000;
            font-size: 10px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>QuickMart</h1>
          <p>Self-Checkout Receipt</p>
          <p>Thank you for shopping with us!</p>
        </div>

        <div class="order-info">
          <p><strong>Order ID:</strong> ${order.id.slice(0, 8)}</p>
          <p><strong>Date:</strong> ${formatDate(order.date)}</p>
          <p><strong>Payment:</strong> ${order.paymentMethod === "card" ? "Card" : "Cash"}</p>
        </div>

        <div class="items">
          <p style="margin-bottom: 10px;"><strong>Items:</strong></p>
          ${order.items
            .map(
              (item) => `
            <div class="item">
              <span>${item.quantity}x ${item.name}</span>
              <span>$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          `,
            )
            .join("")}
        </div>

        <div class="totals">
          <div class="total-row">
            <span>Subtotal:</span>
            <span>$${(order.total + (order.discount || 0)).toFixed(2)}</span>
          </div>
          ${
            order.discount && order.discount > 0
              ? `
            <div class="total-row" style="color: green;">
              <span>Discount (${order.couponCode}):</span>
              <span>-$${order.discount.toFixed(2)}</span>
            </div>
          `
              : ""
          }
          <div class="total-row grand">
            <span>TOTAL:</span>
            <span>$${order.total.toFixed(2)}</span>
          </div>
        </div>

        <div class="footer">
          <p>Items Purchased: ${order.items.reduce((sum, item) => sum + item.quantity, 0)}</p>
          <p>---</p>
          <p>Visit us again soon!</p>
          <p>QuickMart - Your Friendly Neighborhood Store</p>
        </div>
      </body>
    </html>
  `;

  // Check if we're in Electron environment
  if (window.electronAPI) {
    // Use Electron's print API
    window.electronAPI.printReceipt(receiptHTML).catch(err => {
      console.error('Error printing receipt:', err);
      // Fallback to browser printing if Electron printing fails
      const printWindow = window.open("", "_blank", "width=400,height=600");
      if (printWindow) {
        printWindow.document.write(receiptHTML);
        printWindow.document.close();
      }
    });
  } else {
    // For browser environment, use window.open approach
    const printWindow = window.open("", "_blank", "width=400,height=600");
    if (printWindow) {
      printWindow.document.write(receiptHTML);
      printWindow.document.close();
      
      // Wait for content to load and then print
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      };
    }
  }
};
