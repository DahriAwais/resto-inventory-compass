
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  FileText,
  Plus,
  Search,
  Filter,
  Download
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { InventoryItems } from '@/components/InventoryItems';
import { StockIn } from '@/components/StockIn';
import { StockOut } from '@/components/StockOut';
import { SupplierManagement } from '@/components/SupplierManagement';
import { Reports } from '@/components/Reports';

const RestaurantInventorySystem = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Sample data for charts
  const stockData = [
    { name: 'Vegetables', value: 45, color: '#22C55E' },
    { name: 'Meat', value: 25, color: '#EF4444' },
    { name: 'Dairy', value: 20, color: '#F59E0B' },
    { name: 'Grains', value: 10, color: '#3B82F6' }
  ];

  const usageData = [
    { name: 'Mon', usage: 120 },
    { name: 'Tue', usage: 150 },
    { name: 'Wed', usage: 180 },
    { name: 'Thu', usage: 165 },
    { name: 'Fri', usage: 200 },
    { name: 'Sat', usage: 250 },
    { name: 'Sun', usage: 180 }
  ];

  const lowStockItems = [
    { name: 'Tomatoes', current: 5, minimum: 10, unit: 'kg' },
    { name: 'Chicken Breast', current: 3, minimum: 8, unit: 'kg' },
    { name: 'Milk', current: 2, minimum: 5, unit: 'L' }
  ];

  const recentTransactions = [
    { type: 'Stock In', item: 'Onions', quantity: 50, time: '2 hours ago' },
    { type: 'Stock Out', item: 'Rice', quantity: 15, time: '4 hours ago' },
    { type: 'Stock In', item: 'Beef', quantity: 20, time: '6 hours ago' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Restaurant Inventory Management</h1>
          <p className="text-gray-600">Manage your kitchen stock efficiently and never run out of ingredients</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:grid-cols-6 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Inventory
            </TabsTrigger>
            <TabsTrigger value="stock-in" className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Stock In
            </TabsTrigger>
            <TabsTrigger value="stock-out" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Stock Out
            </TabsTrigger>
            <TabsTrigger value="suppliers" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Suppliers
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white transform hover:scale-105 transition-all duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                  <Package className="h-5 w-5" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">342</div>
                  <p className="text-xs text-blue-100">+12% from last month</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white transform hover:scale-105 transition-all duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
                  <AlertTriangle className="h-5 w-5" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{lowStockItems.length}</div>
                  <p className="text-xs text-red-100">Needs immediate attention</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white transform hover:scale-105 transition-all duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Suppliers</CardTitle>
                  <Users className="h-5 w-5" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-green-100">Active partnerships</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white transform hover:scale-105 transition-all duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Usage</CardTitle>
                  <TrendingUp className="h-5 w-5" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,245</div>
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
                    {lowStockItems.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                        <div>
                          <p className="font-medium text-red-800">{item.name}</p>
                          <p className="text-sm text-red-600">
                            {item.current} {item.unit} left (Min: {item.minimum} {item.unit})
                          </p>
                        </div>
                        <Badge variant="destructive">Critical</Badge>
                      </div>
                    ))}
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
                    {recentTransactions.map((transaction, index) => (
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
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="inventory">
            <InventoryItems />
          </TabsContent>

          <TabsContent value="stock-in">
            <StockIn />
          </TabsContent>

          <TabsContent value="stock-out">
            <StockOut />
          </TabsContent>

          <TabsContent value="suppliers">
            <SupplierManagement />
          </TabsContent>

          <TabsContent value="reports">
            <Reports />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RestaurantInventorySystem;
