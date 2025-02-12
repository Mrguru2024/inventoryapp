'use client';

import { useQuery } from '@tanstack/react-query';
import { Card } from '@/app/components/ui/card';
import { KeyIcon, UsersIcon, ShoppingCartIcon, AlertTriangleIcon } from 'lucide-react';
import axios from 'axios';
import DashboardSkeleton from './DashboardSkeleton';

interface StatsData {
  totalKeys: number;
  lowStock: number;
  pendingOrders: number;
  activeUsers: number;
}

export default function DashboardStats() {
  const { data: stats, isLoading, error } = useQuery<StatsData>({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const { data } = await axios.get('/api/dashboard/stats');
      return data;
    }
  });

  if (isLoading) return <DashboardSkeleton />;
  if (error) return <div>Error loading dashboard stats</div>;

  const statCards = [
    {
      title: 'Total Keys',
      value: stats?.totalKeys || 0,
      icon: KeyIcon,
      color: 'text-blue-500',
    },
    {
      title: 'Low Stock Items',
      value: stats?.lowStock || 0,
      icon: AlertTriangleIcon,
      color: 'text-red-500',
    },
    {
      title: 'Pending Orders',
      value: stats?.pendingOrders || 0,
      icon: ShoppingCartIcon,
      color: 'text-green-500',
    },
    {
      title: 'Active Users',
      value: stats?.activeUsers || 0,
      icon: UsersIcon,
      color: 'text-purple-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat) => (
        <Card key={stat.title} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
            <stat.icon className={`h-8 w-8 ${stat.color}`} />
          </div>
        </Card>
      ))}
    </div>
  );
} 