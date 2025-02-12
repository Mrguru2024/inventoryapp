'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { 
  Search, 
  ShoppingCart, 
  Minus, 
  Plus, 
  Filter,
  SortAsc,
  SortDesc,
  Eye
} from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { toast } from '@/app/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Badge } from "@/app/components/ui/badge";
import { cn } from "@/lib/utils";

interface Key {
  id: string;
  fccId: string;
  manufacturer: string;
  keyType: string;
  replacesPN: string;
  quantity: number;
  price: number;
  icId?: string;
  frequency?: string;
  battery?: string;
  buttons?: string;
  emergencyKey?: string;
  originalPrice?: number;
  isOnSale?: boolean;
  saleType?: 'SALE' | 'PRO VERSION' | 'NEW';
}

interface CartItem extends Key {
  orderQuantity: number;
}

export default function PurchasePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [keys, setKeys] = useState<Key[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedKey, setSelectedKey] = useState<Key | null>(null);
  const [sortField, setSortField] = useState<'price' | 'manufacturer'>('price');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState({
    manufacturer: 'all',
    keyType: 'all',
    priceRange: 'all'
  });

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    try {
      const response = await fetch(`/api/store/keys?search=${searchTerm}`);
      if (!response.ok) throw new Error('Failed to fetch keys');
      const data = await response.json();
      setKeys(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch keys',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (key: Key) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === key.id);
      if (existing) {
        return prev.map(item => 
          item.id === key.id 
            ? { ...item, orderQuantity: Math.min(item.orderQuantity + 1, item.quantity) }
            : item
        );
      }
      return [...prev, { ...key, orderQuantity: 1 }];
    });
  };

  const updateQuantity = (keyId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === keyId) {
        const newQuantity = Math.max(0, Math.min(item.orderQuantity + delta, item.quantity));
        return { ...item, orderQuantity: newQuantity };
      }
      return item;
    }).filter(item => item.orderQuantity > 0));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.orderQuantity), 0).toFixed(2);
  };

  const handleCheckout = async () => {
    setProcessing(true);
    try {
      const response = await fetch('/api/store/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(item => ({
            id: item.id,
            quantity: item.orderQuantity,
            price: item.price
          })),
          total: parseFloat(getTotalPrice())
        })
      });

      if (!response.ok) throw new Error('Checkout failed');

      const order = await response.json();
      
      // Clear cart and show success message
      setCart([]);
      toast({
        title: 'Success',
        description: `Order #${order.id} placed successfully`,
      });
      
      // Refresh keys to update quantities
      fetchKeys();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process order',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  const sortKeys = (keysToSort: Key[]) => {
    return [...keysToSort].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });
  };

  const filterKeys = (keysToFilter: Key[]) => {
    return keysToFilter.filter(key => {
      const matchesManufacturer = !filters.manufacturer || 
        key.manufacturer === filters.manufacturer;
      const matchesKeyType = !filters.keyType || 
        key.keyType === filters.keyType;
      const matchesPriceRange = filters.priceRange === 'all' || 
        (filters.priceRange === 'under25' && key.price < 25) ||
        (filters.priceRange === '25to50' && key.price >= 25 && key.price <= 50) ||
        (filters.priceRange === 'over50' && key.price > 50);
      
      return matchesManufacturer && matchesKeyType && matchesPriceRange;
    });
  };

  const manufacturers = Array.from(new Set(keys.map(key => key.manufacturer)));
  const keyTypes = Array.from(new Set(keys.map(key => key.keyType)));

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Purchase Keys</h1>
          <p className="text-sm text-gray-500">
            Showing {sortKeys(filterKeys(keys)).length} results for "Double Rewards Weekend Sale"
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search keys..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            <span>Cart ({cart.length})</span>
          </Button>
        </div>
      </div>

      <div className="flex gap-4 items-center mb-6">
        <Select
          value={filters.manufacturer}
          onValueChange={(value) => setFilters(prev => ({ ...prev, manufacturer: value }))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Manufacturer" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Manufacturers</SelectItem>
            {manufacturers.map(m => (
              <SelectItem key={m} value={m}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.keyType}
          onValueChange={(value) => setFilters(prev => ({ ...prev, keyType: value }))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Key Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {keyTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
          className="flex items-center gap-2"
        >
          {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
          <span>Sort by {sortField}</span>
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortKeys(filterKeys(keys)).map((key) => (
            <div key={key.id} className="group relative">
              {key.isOnSale && (
                <Badge 
                  className={cn(
                    "absolute top-3 left-3 z-10",
                    key.saleType === 'PRO VERSION' && "bg-black",
                    key.saleType === 'NEW' && "bg-green-600"
                  )}
                >
                  {key.saleType || 'SALE'}
                </Badge>
              )}

              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="aspect-square relative overflow-hidden bg-gray-100 p-4">
                  <div className="h-full w-full flex items-center justify-center">
                    <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400">{key.manufacturer}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <div className="mb-2">
                    <h3 className="font-semibold text-lg mb-1 line-clamp-2">
                      {key.manufacturer} - {key.fccId}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      SKU: {key.id.slice(0, 8).toUpperCase()}
                    </p>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-red-500">
                      ${key.price.toFixed(2)}
                    </span>
                    {key.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        ${key.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <div className="mt-2 mb-4">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className="w-4 h-4 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="text-sm text-gray-500 ml-1">
                        (17 reviews)
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      onClick={() => addToCart(key)}
                      disabled={key.quantity === 0}
                    >
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setSelectedKey(key)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Key Details Dialog */}
      <Dialog open={!!selectedKey} onOpenChange={() => setSelectedKey(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Key Details</DialogTitle>
          </DialogHeader>
          {selectedKey && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Manufacturer</label>
                <p className="text-lg">{selectedKey.manufacturer}</p>
              </div>
              <div>
                <label className="text-sm font-medium">FCC ID</label>
                <p className="text-lg">{selectedKey.fccId}</p>
              </div>
              <div>
                <label className="text-sm font-medium">IC ID</label>
                <p className="text-lg">{selectedKey.icId}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Frequency</label>
                <p className="text-lg">{selectedKey.frequency}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Battery</label>
                <p className="text-lg">{selectedKey.battery}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Buttons</label>
                <p className="text-lg">{selectedKey.buttons}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Emergency Key</label>
                <p className="text-lg">{selectedKey.emergencyKey || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Price</label>
                <p className="text-lg font-bold">${selectedKey.price}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Shopping Cart Sidebar */}
      {cart.length > 0 && (
        <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg p-4 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Shopping Cart</h2>
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex flex-col p-2 border rounded">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{item.manufacturer}</p>
                    <p className="text-sm text-gray-500">{item.fccId}</p>
                    <p className="text-sm font-semibold">${(item.price * item.orderQuantity).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.id, -1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span>{item.orderQuantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.id, 1)}
                      disabled={item.orderQuantity >= item.quantity}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">Total:</span>
              <span className="text-xl font-bold">${getTotalPrice()}</span>
            </div>
            <Button 
              className="w-full" 
              onClick={handleCheckout}
              disabled={processing}
            >
              {processing ? 'Processing...' : 'Checkout'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 