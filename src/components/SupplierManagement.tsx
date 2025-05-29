
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Phone, Mail, MapPin, Users, DollarSign } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Supplier {
  id: number;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  totalOrders: number;
  totalValue: number;
  lastOrderDate: string;
  status: 'active' | 'inactive';
}

export const SupplierManagement = () => {
  const { toast } = useToast();
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: 1,
      name: "Fresh Farm Co.",
      contactPerson: "John Smith",
      phone: "+1 (555) 123-4567",
      email: "john@freshfarm.com",
      address: "123 Farm Road, Green Valley, CA 90210",
      totalOrders: 45,
      totalValue: 15750.00,
      lastOrderDate: "2024-01-15",
      status: 'active'
    },
    {
      id: 2,
      name: "Prime Meats Ltd",
      contactPerson: "Sarah Johnson",
      phone: "+1 (555) 987-6543",
      email: "sarah@primemeats.com",
      address: "456 Butcher Street, Meat District, NY 10001",
      totalOrders: 32,
      totalValue: 28950.00,
      lastOrderDate: "2024-01-14",
      status: 'active'
    },
    {
      id: 3,
      name: "Dairy Fresh",
      contactPerson: "Mike Wilson",
      phone: "+1 (555) 456-7890",
      email: "mike@dairyfresh.com",
      address: "789 Dairy Lane, Milk Valley, WI 53001",
      totalOrders: 28,
      totalValue: 8500.00,
      lastOrderDate: "2024-01-12",
      status: 'active'
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: ''
  });

  const handleAddSupplier = () => {
    if (!formData.name || !formData.contactPerson || !formData.phone) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newSupplier: Supplier = {
      id: suppliers.length + 1,
      name: formData.name,
      contactPerson: formData.contactPerson,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      totalOrders: 0,
      totalValue: 0,
      lastOrderDate: "Never",
      status: 'active'
    };

    setSuppliers([...suppliers, newSupplier]);
    setFormData({
      name: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: ''
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Supplier added successfully"
    });
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      name: supplier.name,
      contactPerson: supplier.contactPerson,
      phone: supplier.phone,
      email: supplier.email,
      address: supplier.address
    });
  };

  const handleUpdateSupplier = () => {
    if (!editingSupplier) return;

    const updatedSuppliers = suppliers.map(supplier =>
      supplier.id === editingSupplier.id
        ? {
            ...supplier,
            name: formData.name,
            contactPerson: formData.contactPerson,
            phone: formData.phone,
            email: formData.email,
            address: formData.address
          }
        : supplier
    );

    setSuppliers(updatedSuppliers);
    setEditingSupplier(null);
    setFormData({
      name: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: ''
    });

    toast({
      title: "Success",
      description: "Supplier updated successfully"
    });
  };

  const handleDeleteSupplier = (id: number) => {
    setSuppliers(suppliers.filter(supplier => supplier.id !== id));
    toast({
      title: "Success",
      description: "Supplier deleted successfully"
    });
  };

  const toggleSupplierStatus = (id: number) => {
    const updatedSuppliers = suppliers.map(supplier =>
      supplier.id === id
        ? { ...supplier, status: (supplier.status === 'active' ? 'inactive' : 'active') as 'active' | 'inactive' }
        : supplier
    );
    setSuppliers(updatedSuppliers);
    
    toast({
      title: "Success",
      description: "Supplier status updated"
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-6 h-6" />
                Supplier Management
              </CardTitle>
              <CardDescription>Manage your restaurant suppliers and vendor relationships</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Supplier
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add New Supplier</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new supplier.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Company Name*</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g., Fresh Farm Co."
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="contactPerson">Contact Person*</Label>
                    <Input
                      id="contactPerson"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                      placeholder="e.g., John Smith"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone Number*</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="e.g., +1 (555) 123-4567"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="e.g., john@freshfarm.com"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      placeholder="Complete address..."
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddSupplier}>Add Supplier</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total Suppliers</p>
                    <p className="text-2xl font-bold">{suppliers.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Active Suppliers</p>
                    <p className="text-2xl font-bold">
                      {suppliers.filter(s => s.status === 'active').length}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-green-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Total Value</p>
                    <p className="text-2xl font-bold">
                      ${suppliers.reduce((sum, s) => sum + s.totalValue, 0).toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Suppliers Table */}
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Supplier</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Total Value</TableHead>
                  <TableHead>Last Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suppliers.map((supplier) => (
                  <TableRow key={supplier.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <p className="font-medium">{supplier.name}</p>
                        <p className="text-sm text-gray-500">{supplier.contactPerson}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-3 h-3" />
                          {supplier.phone}
                        </div>
                        {supplier.email && (
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-3 h-3" />
                            {supplier.email}
                          </div>
                        )}
                        {supplier.address && (
                          <div className="flex items-start gap-2 text-sm">
                            <MapPin className="w-3 h-3 mt-0.5" />
                            <span className="text-gray-600 line-clamp-2">{supplier.address}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{supplier.totalOrders}</TableCell>
                    <TableCell className="font-medium">${supplier.totalValue.toLocaleString()}</TableCell>
                    <TableCell>{supplier.lastOrderDate}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={supplier.status === 'active' ? 'default' : 'secondary'}
                        className={supplier.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}
                      >
                        {supplier.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditSupplier(supplier)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleSupplierStatus(supplier.id)}
                          className={supplier.status === 'active' ? 'text-orange-600' : 'text-green-600'}
                        >
                          {supplier.status === 'active' ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteSupplier(supplier.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingSupplier} onOpenChange={() => setEditingSupplier(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Supplier</DialogTitle>
            <DialogDescription>
              Update the supplier information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Company Name*</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-contactPerson">Contact Person*</Label>
              <Input
                id="edit-contactPerson"
                value={formData.contactPerson}
                onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-phone">Phone Number*</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email Address</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-address">Address</Label>
              <Textarea
                id="edit-address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleUpdateSupplier}>Update Supplier</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
