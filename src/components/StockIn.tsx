
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, ShoppingCart, Calendar } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface StockTransaction {
  id: number;
  itemName: string;
  quantity: number;
  unit: string;
  supplier: string;
  purchasePrice: number;
  totalCost: number;
  date: string;
  time: string;
}

export const StockIn = () => {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [transactions, setTransactions] = useState<StockTransaction[]>([
    {
      id: 1,
      itemName: "Onions",
      quantity: 50,
      unit: "kg",
      supplier: "Fresh Farm Co.",
      purchasePrice: 2.50,
      totalCost: 125.00,
      date: "2024-01-15",
      time: "10:30 AM"
    },
    {
      id: 2,
      itemName: "Beef",
      quantity: 20,
      unit: "kg",
      supplier: "Prime Meats Ltd",
      purchasePrice: 15.00,
      totalCost: 300.00,
      date: "2024-01-14",
      time: "2:15 PM"
    }
  ]);

  const [formData, setFormData] = useState({
    itemName: '',
    quantity: '',
    unit: '',
    supplier: '',
    purchasePrice: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Sample data - in real app, this would come from inventory
  const availableItems = [
    { name: "Tomatoes", unit: "kg" },
    { name: "Onions", unit: "kg" },
    { name: "Chicken Breast", unit: "kg" },
    { name: "Milk", unit: "L" },
    { name: "Rice", unit: "kg" },
    { name: "Beef", unit: "kg" }
  ];

  const suppliers = [
    "Fresh Farm Co.",
    "Prime Meats Ltd",
    "Dairy Fresh",
    "Organic Gardens",
    "City Market"
  ];

  const handleAddTransaction = () => {
    if (!formData.itemName || !formData.quantity || !formData.supplier) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const quantity = Number(formData.quantity);
    const purchasePrice = Number(formData.purchasePrice) || 0;
    const totalCost = quantity * purchasePrice;

    const newTransaction: StockTransaction = {
      id: transactions.length + 1,
      itemName: formData.itemName,
      quantity: quantity,
      unit: formData.unit,
      supplier: formData.supplier,
      purchasePrice: purchasePrice,
      totalCost: totalCost,
      date: formData.date,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setTransactions([newTransaction, ...transactions]);
    setFormData({
      itemName: '',
      quantity: '',
      unit: '',
      supplier: '',
      purchasePrice: '',
      date: new Date().toISOString().split('T')[0]
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Success",
      description: `Stock updated: ${quantity} ${formData.unit} of ${formData.itemName} added`,
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

  const totalValue = transactions.reduce((sum, transaction) => sum + transaction.totalCost, 0);

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-6 h-6" />
                Stock In (Purchases)
              </CardTitle>
              <CardDescription>Record new stock arrivals and purchases</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Stock In
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Record Stock Purchase</DialogTitle>
                  <DialogDescription>
                    Add new stock arrival to update inventory levels.
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
                            {item.name} ({item.unit})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="quantity">Quantity*</Label>
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
                    <Label htmlFor="supplier">Supplier*</Label>
                    <Select onValueChange={(value) => setFormData({...formData, supplier: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers.map((supplier) => (
                          <SelectItem key={supplier} value={supplier}>{supplier}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="purchasePrice">Purchase Price per Unit</Label>
                    <Input
                      id="purchasePrice"
                      type="number"
                      step="0.01"
                      value={formData.purchasePrice}
                      onChange={(e) => setFormData({...formData, purchasePrice: e.target.value})}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="date">Purchase Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
                  {formData.quantity && formData.purchasePrice && (
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-800">
                        Total Cost: ${(Number(formData.quantity) * Number(formData.purchasePrice)).toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button onClick={handleAddTransaction}>Record Purchase</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Today's Purchases</p>
                    <p className="text-2xl font-bold">
                      {transactions.filter(t => t.date === new Date().toISOString().split('T')[0]).length}
                    </p>
                  </div>
                  <Calendar className="w-8 h-8 text-green-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total Transactions</p>
                    <p className="text-2xl font-bold">{transactions.length}</p>
                  </div>
                  <ShoppingCart className="w-8 h-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Total Value</p>
                    <p className="text-2xl font-bold">${totalValue.toFixed(2)}</p>
                  </div>
                  <Plus className="w-8 h-8 text-purple-200" />
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
                  <TableHead>Quantity</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Total Cost</TableHead>
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
                    <TableCell>{transaction.supplier}</TableCell>
                    <TableCell>${transaction.purchasePrice.toFixed(2)}</TableCell>
                    <TableCell className="font-medium">${transaction.totalCost.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {transactions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No stock purchases recorded yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
