import { DollarSign, History, Package, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Order } from "@/types/order";

interface StatsDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
}

export const StatsDashboard = ({ isOpen, onClose, orders }: StatsDashboardProps) => {
  const { t } = useLanguage();
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const totalItems = orders.reduce(
    (sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
    0,
  );
  const averageOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const last7Days = orders.filter((order) => {
    const orderDate = new Date(order.date);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return orderDate >= sevenDaysAgo;
  });

  const revenue7Days = last7Days.reduce((sum, order) => sum + order.total, 0);

  const paymentMethodStats = {
    card: orders.filter((o) => o.paymentMethod === "card").length,
    cash: orders.filter((o) => o.paymentMethod === "cash").length,
  };

  const topProducts = orders
    .flatMap((order) => order.items)
    .reduce(
      (acc, item) => {
        const existing = acc.find((p) => p.id === item.id);
        if (existing) {
          existing.quantity += item.quantity;
          existing.revenue += item.price * item.quantity;
        } else {
          acc.push({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            revenue: item.price * item.quantity,
          });
        }
        return acc;
      },
      [] as Array<{ id: string; name: string; quantity: number; revenue: number }>,
    )
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t.statsDashboardTitle}</DialogTitle>
          <DialogDescription>{t.statsDashboardDescription}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t.totalRevenue}</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">{t.allTime}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t.totalOrders}</CardTitle>
                <History className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalOrders}</div>
                <p className="text-xs text-muted-foreground">{t.completed}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t.avgOrderValue}</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${averageOrder.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">{t.perTransaction}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t.itemsSold}</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalItems}</div>
                <p className="text-xs text-muted-foreground">{t.totalUnits}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t.last7Days}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t.ordersLabel}</span>
                  <span className="font-medium">{last7Days.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t.revenueLabel}</span>
                  <span className="font-medium">${revenue7Days.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t.paymentMethods}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t.cardLabel}</span>
                  <span className="font-medium">
                    {paymentMethodStats.card} (
                    {totalOrders > 0
                      ? ((paymentMethodStats.card / totalOrders) * 100).toFixed(0)
                      : 0}
                    %)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t.cashLabel}</span>
                  <span className="font-medium">
                    {paymentMethodStats.cash} (
                    {totalOrders > 0
                      ? ((paymentMethodStats.cash / totalOrders) * 100).toFixed(0)
                      : 0}
                    %)
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t.topProducts}</CardTitle>
            </CardHeader>
            <CardContent>
              {topProducts.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t.noSalesDataYet}</p>
              ) : (
                <div className="space-y-3">
                  {topProducts.map((product, index) => (
                    <div key={product.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{product.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {product.quantity} {t.unitsSold}
                          </p>
                        </div>
                      </div>
                      <span className="font-semibold">${product.revenue.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
