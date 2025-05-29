
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Minus, Package, ChefHat, Calendar } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface StockOutTransaction {
  id: number;
  itemName: string;
  quantity: number;
  unit: string;
  usedBy: string;
  purpose: string;
  date: string;
  time: string;
}

export const StockOut = () => {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [transactions, setTransactions] = useState<StockOutTransaction[]>([
    {
      id: 1,
      itemName: "Rice",
      quantity: 15,
      unit: "kg",
      usedBy: "Chef Marco",
      purpose: "Lunch Prep",
      date: "2024-01-15",
      time: "11:30 AM"
    },
    {
      id: 2,
      itemName: "Tomatoes",
      quantity: 8,
      unit: "kg",
      usedBy: "Chef Sarah",
      purpose: "Dinner Service",
      date: "2024-01-14",
      time: "4:45 PM"
    }
  ]);

  const [formData, setFormData] = useState({
    itemName: '',
    quantity: '',
    unit: '',
    usedBy: '',
    purpose: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Sample data - in real app, this would come from inventory
  const availableItems = [
    { name: "Tomatoes", unit: "kg", currentStock: 5 },
    { name: "Onions", unit: "kg", currentStock: 45 },
    { name: "Chicken Breast", unit: "kg", currentStock: 15 },
    { name: "Milk", unit: "L", currentStock: 25 },
    { name: "Rice", unit: "kg", currentStock: 30 },
    { name: "Beef", unit: "kg", currentStock: 12 }
  ];

  const chefs = [
    "Chef Marco",
    "Chef Sarah",
    "Chef David",
    "Chef Lisa",
    "Kitchen Staff"
  ];

  const purposes = [
    "Breakfast Prep",
    "Lunch Prep",
    "Dinner Service",
    "Special Menu",
    "Catering Order",
    "Recipe Testing"
  ];

  const handleAddTransaction = () => {
    if (!formData.itemName || !formData.quantity || !formData.usedBy) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const quantity = Number(formData.quantity);
    const selectedItem = availableItems.find(item => item.name === formData.itemName);
    
    if (selectedItem && quantity > selectedItem.currentStock) {
      toast({
        title: "Error",
        description: `Not enough stock available. Current stock: ${selectedItem.currentStock} ${selectedItem.unit}`,
        variant: "destructive"
      });
      return;
    }

    const newTransaction: StockOutTransaction = {
      id: transactions.length + 1,
      itemName: formData.itemName,
      quantity: quantity,
      unit: formData.unit,
      usedBy: formData.usedBy,
      purpose: formData.purpose,
      date: formData.date,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setTransactions([newTransaction, ...transactions]);
    setFormData({
      itemName: '',
      quantity: '',
      unit: '',
      usedBy: '',
      purpose: '',
      date: new Date().toISOString().split('T')[0]
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Success",
      description: `Stock updated: ${quantity} ${formData.unit} of ${formData.itemName} used`,
    });
  };

  const handleItemSelect = (itemName: string) => {
    const selectedItem = availableItems.find(item => item.name === itemName);
    if (selectedItem) {
      setFormData({
        ...formData,
        itemName: itemName,
        unit: selectedItem.unit
      });
    }
  };

  const totalItemsUsed = transactions.reduce((sum, transaction) => sum + transaction.quantity, 0);

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-6 h-6" />
                Stock Out (Usage)
              </CardTitle>
              <CardDescription>Record kitchen usage and stock consumption</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-red-600 hover:bg-red-700">
                  <Minus className="w-4 h-4 mr-2" />
                  Record Usage
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Record Stock Usage</DialogTitle>
                  <DialogDescription>
                    Record items used in kitchen operations.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="itemName">Item*</Label>
                    <Select onValueChange={handleItemSelect}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select item" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableItems.map((item) => (
                          <SelectItem key={item.name} value={item.name}>
                            {item.name} ({item.currentStock} {item.unit} available)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="quantity">Quantity Used*</Label>
                      <Input
                        id="quantity"
                        type="number"
                        value={formData.quantity}
                        onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                        placeholder="0"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="unit">Unit</Label>
                      <Input
                        id="unit"
                        value={formData.unit}
                        readOnly
                        className="bg-gray-50"
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="usedBy">Used By*</Label>
                    <Select onValueChange={(value) => setFormData({...formData, usedBy: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select chef/staff" />
                      </SelectTrigger>
                      <SelectContent>
                        {chefs.map((chef) => (
                          <SelectItem key={chef} value={chef}>{chef}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="purpose">Purpose</Label>
                    <Select onValueChange={(value) => setFormData({...formData, purpose: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select purpose" />
                      </SelectTrigger>
                      <SelectContent>
                        {purposes.map((purpose) => (
                          <SelectItem key={purpose} value={purpose}>{purpose}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="date">Usage Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
                  {formData.itemName && formData.quantity && (
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <p className="text-sm font-medium text-orange-800">
                        {availableItems.find(item => item.name === formData.itemName)?.currentStock && 
                         Number(formData.quantity) > (availableItems.find(item => item.name === formData.itemName)?.currentStock || 0) ? 
                         "⚠️ Insufficient stock!" : 
                         `✓ Stock will be reduced by ${formData.quantity} ${formData.unit}`}
                      </p>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button onClick={handleAddTransaction}>Record Usage</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-sm">Today's Usage</p>
                    <p className="text-2xl font-bold">
                      {transactions.filter(t => t.date === new Date().toISOString().split('T')[0]).length}
                    </p>
                  </div>
                  <Calendar className="w-8 h-8 text-red-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Total Transactions</p>
                    <p className="text-2xl font-bold">{transactions.length}</p>
                  </div>
                  <ChefHat className="w-8 h-8 text-orange-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Items Used</p>
                    <p className="text-2xl font-bold">{totalItemsUsed}</p>
                  </div>
                  <Package className="w-8 h-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transactions Table */}
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Quantity Used</TableHead>
                  <TableHead>Used By</TableHead>
                  <TableHead>Purpose</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <p className="font-medium">{transaction.date}</p>
                        <p className="text-sm text-gray-500">{transaction.time}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{transaction.itemName}</TableCell>
                    <TableCell>{transaction.quantity} {transaction.unit}</TableCell>
                    <TableCell>{transaction.usedBy}</TableCell>
                    <TableCell>{transaction.purpose}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {transactions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No stock usage recorded yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
