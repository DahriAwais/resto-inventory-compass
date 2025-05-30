
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  ShoppingCart, 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  Plus
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DashboardStats {
  totalItems: number;
  lowStockItems: number;
  totalSuppliers: number;
  monthlyUsage: number;
}

interface LowStockItem {
  name: string;
  current: number;
  minimum: number;
  unit: string;
}

interface StockMovement {
  type: string;
  item: string;
  quantity: number;
  time: string;
}

const RestaurantInventoryDashboard = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats>({
    totalItems: 0,
    lowStockItems: 0,
    totalSuppliers: 0,
    monthlyUsage: 0
  });
  const [lowStockItems, setLowStockItems] = useState<LowStockItem[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<StockMovement[]>([]);
  const [stockData, setStockData] = useState<any[]>([]);
  const [usageData, setUsageData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch total items count
      const { count: totalItems } = await supabase
        .from('inventory_items')
        .select('*', { count: 'exact', head: true });

      // Fetch low stock items
      const { data: lowStockData } = await supabase
        .from('inventory_items')
        .select('name, current_stock, minimum_stock, unit')
        .filter('current_stock', 'lte', 'minimum_stock');

      // Fetch suppliers count
      const { count: totalSuppliers } = await supabase
        .from('suppliers')
        .select('*', { count: 'exact', head: true });

      // Fetch recent stock movements
      const { data: movements } = await supabase
        .from('stock_movements')
        .select(`
          movement_type,
          quantity,
          created_at,
          inventory_items(name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch category distribution for pie chart
      const { data: categoryData } = await supabase
        .from('inventory_items')
        .select(`
          categories(name),
          current_stock
        `);

      // Calculate monthly usage (stock out movements from last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: monthlyMovements } = await supabase
        .from('stock_movements')
        .select('quantity')
        .eq('movement_type', 'out')
        .gte('created_at', thirtyDaysAgo.toISOString());

      const monthlyUsage = monthlyMovements?.reduce((sum, movement) => sum + Number(movement.quantity), 0) || 0;

      // Process data for charts
      const categoryDistribution = processCategoryData(categoryData || []);
      const weeklyUsage = processWeeklyUsage();
      const lowStock = processLowStockItems(lowStockData || []);
      const recentActivity = processRecentMovements(movements || []);

      setStats({
        totalItems: totalItems || 0,
        lowStockItems: lowStock.length,
        totalSuppliers: totalSuppliers || 0,
        monthlyUsage
      });

      setLowStockItems(lowStock);
      setRecentTransactions(recentActivity);
      setStockData(categoryDistribution);
      setUsageData(weeklyUsage);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const processCategoryData = (data: any[]) => {
    const categoryMap = new Map();
    
    data.forEach(item => {
      const categoryName = item.categories?.name || 'Uncategorized';
      const currentStock = Number(item.current_stock) || 0;
      
      if (categoryMap.has(categoryName)) {
        categoryMap.set(categoryName, categoryMap.get(categoryName) + currentStock);
      } else {
        categoryMap.set(categoryName, currentStock);
      }
    });

    const colors = ['#22C55E', '#EF4444', '#F59E0B', '#3B82F6', '#8B5CF6', '#EC4899'];
    
    return Array.from(categoryMap.entries()).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length]
    }));
  };

  const processWeeklyUsage = () => {
    // Generate mock weekly data - in a real app, you'd calculate this from actual movements
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => ({
      name: day,
      usage: Math.floor(Math.random() * 100) + 50 // Mock data for now
    }));
  };

  const processLowStockItems = (data: any[]): LowStockItem[] => {
    return data.map(item => ({
      name: item.name,
      current: Number(item.current_stock),
      minimum: Number(item.minimum_stock),
      unit: item.unit
    }));
  };

  const processRecentMovements = (data: any[]): StockMovement[] => {
    return data.map(movement => ({
      type: movement.movement_type === 'in' ? 'Stock In' : 'Stock Out',
      item: movement.inventory_items?.name || 'Unknown Item',
      quantity: Number(movement.quantity),
      time: new Date(movement.created_at).toLocaleString()
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Overview of your restaurant inventory management</p>
        </div>

        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white transform hover:scale-105 transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                <Package className="h-5 w-5" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalItems}</div>
                <p className="text-xs text-blue-100">Items in inventory</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white transform hover:scale-105 transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
                <AlertTriangle className="h-5 w-5" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.lowStockItems}</div>
                <p className="text-xs text-red-100">Needs immediate attention</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white transform hover:scale-105 transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Suppliers</CardTitle>
                <Users className="h-5 w-5" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalSuppliers}</div>
                <p className="text-xs text-green-100">Active partnerships</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white transform hover:scale-105 transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Usage</CardTitle>
                <TrendingUp className="h-5 w-5" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.monthlyUsage}</div>
                <p className="text-xs text-purple-100">Units consumed</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Stock Distribution by Category</CardTitle>
                <CardDescription>Current inventory breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                {stockData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={stockData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {stockData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-500">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Weekly Usage Trend</CardTitle>
                <CardDescription>Items consumed this week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={usageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="usage" stroke="#3B82F6" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Low Stock Alerts & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="w-5 h-5" />
                  Low Stock Alerts
                </CardTitle>
                <CardDescription>Items that need restocking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {lowStockItems.length > 0 ? (
                    lowStockItems.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                        <div>
                          <p className="font-medium text-red-800">{item.name}</p>
                          <p className="text-sm text-red-600">
                            {item.current} {item.unit} left (Min: {item.minimum} {item.unit})
                          </p>
                        </div>
                        <Badge variant="destructive">Critical</Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No low stock alerts
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest stock movements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentTransactions.length > 0 ? (
                    recentTransactions.map((transaction, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          {transaction.type === 'Stock In' ? (
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <Plus className="w-4 h-4 text-green-600" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                              <Package className="w-4 h-4 text-red-600" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium">{transaction.item}</p>
                            <p className="text-sm text-gray-600">{transaction.type} - {transaction.quantity} units</p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">{transaction.time}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No recent activity
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantInventoryDashboard;
