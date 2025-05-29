import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Download, FileText, TrendingUp, Calendar, Package } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { exportToPDF, exportToExcel } from '@/utils/reportExporter';

export const Reports = () => {
  const { toast } = useToast();
  const [reportType, setReportType] = useState('inventory');
  const [dateRange, setDateRange] = useState('week');

  // Sample data for different reports
  const inventoryData = [
    { name: 'Vegetables', current: 245, target: 300, value: 1250 },
    { name: 'Meat', current: 120, target: 150, value: 2400 },
    { name: 'Dairy', current: 85, target: 100, value: 680 },
    { name: 'Grains', current: 300, target: 250, value: 900 },
    { name: 'Spices', current: 45, target: 60, value: 450 }
  ];

  const usageData = [
    { date: '2024-01-08', vegetables: 45, meat: 25, dairy: 15, grains: 35 },
    { date: '2024-01-09', vegetables: 52, meat: 30, dairy: 18, grains: 28 },
    { date: '2024-01-10', vegetables: 38, meat: 28, dairy: 22, grains: 42 },
    { date: '2024-01-11', vegetables: 65, meat: 35, dairy: 25, grains: 38 },
    { date: '2024-01-12', vegetables: 48, meat: 22, dairy: 20, grains: 30 },
    { date: '2024-01-13', vegetables: 72, meat: 40, dairy: 28, grains: 45 },
    { date: '2024-01-14', vegetables: 55, meat: 32, dairy: 24, grains: 35 }
  ];

  const purchaseData = [
    { supplier: 'Fresh Farm Co.', amount: 2500, orders: 12 },
    { supplier: 'Prime Meats Ltd', amount: 4200, orders: 8 },
    { supplier: 'Dairy Fresh', amount: 1800, orders: 15 },
    { supplier: 'Organic Gardens', amount: 1200, orders: 6 },
    { supplier: 'City Market', amount: 900, orders: 4 }
  ];

  const stockStatusData = [
    { name: 'Adequate', value: 75, color: '#22C55E' },
    { name: 'Low', value: 20, color: '#F59E0B' },
    { name: 'Critical', value: 5, color: '#EF4444' }
  ];

  const handleExportReport = (format: 'pdf' | 'excel') => {
    let dataToExport;
    
    switch (reportType) {
      case 'inventory':
        dataToExport = inventoryData;
        break;
      case 'usage':
        dataToExport = usageData;
        break;
      case 'purchases':
        dataToExport = purchaseData;
        break;
      case 'suppliers':
        dataToExport = purchaseData;
        break;
      default:
        dataToExport = inventoryData;
    }

    try {
      if (format === 'pdf') {
        exportToPDF(dataToExport, reportType);
      } else {
        exportToExcel(dataToExport, reportType);
      }
      
      toast({
        title: "Export Successful",
        description: `${format.toUpperCase()} report has been downloaded successfully.`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: `Failed to export ${format.toUpperCase()} report. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const getReportTitle = () => {
    switch (reportType) {
      case 'inventory':
        return 'Inventory Status Report';
      case 'usage':
        return 'Usage Trends Report';
      case 'purchases':
        return 'Purchase Analysis Report';
      case 'suppliers':
        return 'Supplier Performance Report';
      default:
        return 'Inventory Report';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-6 h-6" />
                Reports & Analytics
              </CardTitle>
              <CardDescription>Generate detailed reports and analyze inventory data</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => handleExportReport('pdf')}
                className="bg-red-600 hover:bg-red-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
              <Button 
                onClick={() => handleExportReport('excel')}
                className="bg-green-600 hover:bg-green-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Excel
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Report Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inventory">Inventory Status</SelectItem>
                  <SelectItem value="usage">Usage Trends</SelectItem>
                  <SelectItem value="purchases">Purchase Analysis</SelectItem>
                  <SelectItem value="suppliers">Supplier Performance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Time Period</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Custom Date Range</label>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Select Range
              </Button>
            </div>
          </div>

          {/* Report Content */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">{getReportTitle()}</h3>

            {/* Inventory Status Report */}
            {reportType === 'inventory' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Current Stock vs Target</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={inventoryData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="current" fill="#3B82F6" name="Current Stock" />
                        <Bar dataKey="target" fill="#10B981" name="Target Stock" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Stock Status Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={stockStatusData}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {stockStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Usage Trends Report */}
            {reportType === 'usage' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Daily Usage Trends by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={usageData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="vegetables" stroke="#22C55E" strokeWidth={2} name="Vegetables" />
                      <Line type="monotone" dataKey="meat" stroke="#EF4444" strokeWidth={2} name="Meat" />
                      <Line type="monotone" dataKey="dairy" stroke="#F59E0B" strokeWidth={2} name="Dairy" />
                      <Line type="monotone" dataKey="grains" stroke="#3B82F6" strokeWidth={2} name="Grains" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Purchase Analysis Report */}
            {reportType === 'purchases' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Purchase Analysis by Supplier</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={purchaseData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="supplier" type="category" width={120} />
                      <Tooltip />
                      <Bar dataKey="amount" fill="#3B82F6" name="Purchase Amount ($)" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Supplier Performance Report */}
            {reportType === 'suppliers' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Supplier Order Volume</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={purchaseData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="supplier" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="orders" fill="#10B981" name="Number of Orders" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Supplier Purchase Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={purchaseData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="supplier" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="amount" fill="#8B5CF6" name="Purchase Value ($)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Summary Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Total Items</p>
                      <p className="text-2xl font-bold">342</p>
                    </div>
                    <Package className="w-8 h-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Total Value</p>
                      <p className="text-2xl font-bold">$52,340</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Monthly Usage</p>
                      <p className="text-2xl font-bold">1,245</p>
                    </div>
                    <Package className="w-8 h-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm">Efficiency</p>
                      <p className="text-2xl font-bold">94%</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-orange-200" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
