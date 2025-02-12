import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  const [
    totalUsers,
    totalKeys,
    ordersToday,
    lowStockItems,
    revenueThisMonth,
    activeUsers,
    recentActivities
  ] = await Promise.all([
    prisma.user.count(),
    prisma.key.count(),
    prisma.order.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }
    }),
    prisma.key.count({
      where: {
        stock: {
          lte: 5
        }
      }
    }),
    // Add your revenue calculation here
    prisma.user.count({
      where: {
        lastActive: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      }
    }),
    prisma.activity.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc'
      }
    })
  ]);

  return {
    totalUsers,
    totalKeys,
    ordersToday,
    lowStockItems,
    revenueThisMonth: 0, // Replace with actual calculation
    activeUsers,
    recentActivities
  };
} 