export type SupportedLanguage = "en" | "es" | "fr" | "de";

export interface Translation {
  // Header
  appName: string;
  appSubtitle: string;
  scan: string;
  history: string;
  stats: string;

  // Product Search
  searchPlaceholder: string;
  allCategories: string;
  allProducts: string;
  items: string;
  noProductsFound: string;

  // Cart
  cart: string;
  cartEmpty: string;
  subtotal: string;
  discount: string;
  total: string;
  proceedToPayment: string;
  addToCart: string;

  // Coupon
  enterCouponCode: string;
  apply: string;
  remove: string;
  invalidCoupon: string;
  couponApplied: string;
  couponRemoved: string;

  // Checkout
  selectPaymentMethod: string;
  paymentSuccessful: string;
  thankYou: string;
  creditDebitCard: string;
  cardDescription: string;
  cash: string;
  cashDescription: string;
  totalAmount: string;
  completePayment: string;
  processing: string;
  discountApplied: string;

  // Barcode Scanner
  barcodeScanner: string;
  barcodeScannerDescription: string;
  scanOrEnterBarcode: string;
  scanProduct: string;
  scanning: string;
  cancel: string;
  availableTestBarcodes: string;
  noProductFoundWithBarcode: string;

  // Order History
  orderHistory: string;
  noOrdersYet: string;
  order: string;
  printReceipt: string;
  paymentMethod: string;
  card: string;

  // Stats Dashboard
  salesAnalytics: string;
  overviewOfPerformance: string;
  totalRevenue: string;
  allTime: string;
  totalOrders: string;
  completed: string;
  avgOrderValue: string;
  perTransaction: string;
  itemsSold: string;
  totalUnits: string;
  last7Days: string;
  orders: string;
  revenue: string;
  paymentMethods: string;
  topProducts: string;
  noSalesDataYet: string;
  unitsSold: string;

  // Toasts
  addedToCart: string;
  addedAnotherToCart: string;
  itemRemoved: string;
  cartCleared: string;
  cartIsEmpty: string;
  purchaseComplete: string;

  // Categories
  fruits: string;
  dairy: string;
  bakery: string;
  beverages: string;
  meatSeafood: string;
  vegetables: string;
  snacks: string;
  frozenFoods: string;
  pantry: string;

  // Barcode Scanner
  barcodeScannerTitle: string;
  barcodeScannerDescription: string;
  scanProductButton: string;
  scanningState: string;
  cancel: string;
  availableTestBarcodes: string;
  noBarcodeFound: string;

  // Coupon Input
  couponLabel: string;
  availableCoupons: string;

  // Product Card
  priceLabel: string;

  // Product Search
  categoryPlaceholder: string;

  // Order History
  orderHistoryTitle: string;
  orderHistoryDescription: string;
  noOrdersYet: string;
  orderPrefix: string;
  paymentMethodCard: string;
  paymentMethodCash: string;
  discountLabel: string;
  printReceipt: string;

  // Stats Dashboard
  statsDashboardTitle: string;
  statsDashboardDescription: string;
  totalRevenue: string;
  allTime: string;
  totalOrders: string;
  completed: string;
  avgOrderValue: string;
  perTransaction: string;
  itemsSold: string;
  totalUnits: string;
  last7Days: string;
  ordersLabel: string;
  revenueLabel: string;
  paymentMethods: string;
  cardLabel: string;
  cashLabel: string;
  topProducts: string;
  noSalesDataYet: string;
  unitsSold: string;
}
