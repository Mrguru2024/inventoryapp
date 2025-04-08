import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface TopMake {
  make: string;
  _count: {
    make: number;
  };
}

interface ActivityLog {
  id: string;
  type: string;
  description: string;
  timestamp: Date;
  user: {
    name: string;
  };
}

interface FormattedTopMake {
  name: string;
  count: number;
}

interface FormattedActivity {
  id: string;
  description: string;
  date: string;
}

const styles = {
  container: "min-h-screen bg-white p-6 dark:bg-slate-900",
  header: "text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100",
  grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
  card: "bg-white rounded-lg p-6 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 shadow-sm",
  cardTitle: "text-lg font-semibold mb-4 text-slate-800 dark:text-slate-100",
  statValue: "text-3xl font-bold text-slate-900 dark:text-slate-100",
  statLabel: "text-sm text-slate-600 dark:text-slate-400",
  list: "space-y-4",
  listItem:
    "flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700",
  listItemText: "text-slate-700 dark:text-slate-300",
  listItemValue: "text-slate-900 dark:text-slate-100 font-medium",
  chartContainer: "h-64 mt-4",
  tableContainer:
    "overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700",
  table: "min-w-full divide-y divide-slate-200 dark:divide-slate-700",
  tableHeader: "bg-slate-50 dark:bg-slate-800",
  tableHeaderCell:
    "px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider",
  tableBody:
    "bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700",
  tableRow:
    "hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-150",
  tableCell:
    "px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300",
  loadingContainer: "flex justify-center items-center h-64",
  errorMessage: "text-red-600 dark:text-red-400 text-center py-4",
  noData: "text-slate-500 dark:text-slate-400 text-center py-4",
  button:
    "px-4 py-2 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900",
  primaryButton:
    "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 focus:ring-blue-500",
  secondaryButton:
    "bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-slate-600 dark:text-slate-100 dark:hover:bg-slate-500 focus:ring-slate-500",
  dangerButton:
    "bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400 focus:ring-red-500",
  successButton:
    "bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-400 focus:ring-green-500",
  disabledButton:
    "bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-700 dark:text-slate-500",
  input:
    "w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-400",
  select:
    "w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100",
  label: "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1",
  checkbox:
    "h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded dark:border-slate-600 dark:bg-slate-700 dark:checked:bg-blue-500 dark:checked:border-blue-500",
  radio:
    "h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:checked:bg-blue-500 dark:checked:border-blue-500",
  tooltip:
    "absolute z-10 px-3 py-2 text-sm text-white bg-slate-900 rounded-md shadow-lg dark:bg-slate-600 dark:text-slate-100",
  badge:
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
  successBadge: "bg-green-100 text-green-800 dark:bg-green-500 dark:text-white",
  warningBadge:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-500 dark:text-white",
  errorBadge: "bg-red-100 text-red-800 dark:bg-red-500 dark:text-white",
  infoBadge: "bg-blue-100 text-blue-800 dark:bg-blue-500 dark:text-white",
  alert: "p-4 mb-4 rounded-md",
  successAlert:
    "bg-green-50 text-green-800 dark:bg-green-800 dark:text-green-100",
  warningAlert:
    "bg-yellow-50 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100",
  errorAlert: "bg-red-50 text-red-800 dark:bg-red-800 dark:text-red-100",
  infoAlert: "bg-blue-50 text-blue-800 dark:bg-blue-800 dark:text-blue-100",
};

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  try {
    // Initialize default values
    let totalTransponders = 0;
    let lowStockItems = 0;
    let recentRequests = 0;
    let topMakes: TopMake[] = [];
    let recentActivity: ActivityLog[] = [];

    // Fetch dashboard statistics
    try {
      [
        totalTransponders,
        lowStockItems,
        recentRequests,
        topMakes,
        recentActivity,
      ] = await Promise.all([
        // Total transponders count
        prisma.transponderKey.count(),

        // Low stock items (below minimum stock)
        prisma.transponderInventory.count({
          where: {
            quantity: {
              lt: 5,
            },
          },
        }),

        // Recent requests (last 30 days)
        prisma.request.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          },
        }),

        // Top makes by count
        prisma.transponderKey.groupBy({
          by: ["make"],
          _count: {
            make: true,
          },
          orderBy: {
            _count: {
              make: "desc",
            },
          },
          take: 5,
        }),

        // Recent activity
        prisma.activity.findMany({
          orderBy: {
            timestamp: "desc",
          },
          take: 5,
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        }),
      ]);
    } catch (dbError) {
      console.error("Database error:", dbError);
      // Continue with default values if database query fails
    }

    // Format top makes data
    const formattedTopMakes: FormattedTopMake[] = topMakes.map(
      (make: TopMake) => ({
        name: make.make,
        count: make._count.make,
      })
    );

    // Format recent activity data
    const formattedRecentActivity: FormattedActivity[] = recentActivity.map(
      (activity: ActivityLog) => ({
        id: activity.id,
        description: `${activity.user.name} ${activity.type}: ${activity.description}`,
        date: new Date(activity.timestamp).toLocaleDateString(),
      })
    );

    return (
      <div className={styles.container}>
        <h1 className={styles.header}>Admin Dashboard</h1>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Total Transponders</h2>
            <p className={styles.statValue}>{totalTransponders}</p>
            <p className={styles.statLabel}>Across all makes and models</p>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Low Stock Items</h2>
            <p className={styles.statValue}>{lowStockItems}</p>
            <p className={styles.statLabel}>Items below minimum threshold</p>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Recent Requests</h2>
            <p className={styles.statValue}>{recentRequests}</p>
            <p className={styles.statLabel}>Last 30 days</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Top Makes</h2>
            <div className={styles.list}>
              {formattedTopMakes.map((make: FormattedTopMake) => (
                <div key={make.name} className={styles.listItem}>
                  <span className={styles.listItemText}>{make.name}</span>
                  <span className={styles.listItemValue}>{make.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Recent Activity</h2>
            <div className={styles.list}>
              {formattedRecentActivity.map((activity: FormattedActivity) => (
                <div key={activity.id} className={styles.listItem}>
                  <span className={styles.listItemText}>
                    {activity.description}
                  </span>
                  <span className={styles.listItemValue}>{activity.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Inventory Overview</h2>
            <div className={styles.chartContainer}>
              {/* Chart component will go here */}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in AdminDashboard:", error);
    return (
      <div className={styles.container}>
        <h1 className={styles.header}>Admin Dashboard</h1>
        <div className={styles.errorMessage}>
          Error loading dashboard data. Please try again later.
        </div>
      </div>
    );
  }
}
