"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import {
  Package,
  ShoppingCart,
  User,
  MapPin,
  Search,
  BookOpen,
  MessageSquare,
  DollarSign,
  Wrench,
} from "lucide-react";
import Link from "next/link";

export default function TechnicianDashboard() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("inventory");

  if (status === "unauthenticated") {
    redirect("/auth/signin");
  }

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  const features = [
    {
      id: "inventory",
      title: "Personal Inventory",
      icon: Package,
      description: "Manage your personal inventory with auto-calculated values",
      href: "/technician/inventory",
    },
    {
      id: "shop",
      title: "Inventory Purchase",
      icon: ShoppingCart,
      description: "Browse and purchase items from our catalog",
      href: "/technician/shop",
    },
    {
      id: "profile",
      title: "Profile Management",
      icon: User,
      description: "Update your personal information and preferences",
      href: "/technician/profile",
    },
    {
      id: "jobs",
      title: "Job Opportunities",
      icon: MapPin,
      description: "Find and accept jobs in your area",
      href: "/technician/jobs",
    },
    {
      id: "search",
      title: "Transponder Database",
      icon: Search,
      description: "Search key data, FCC IDs, and compatibilities",
      href: "/technician/search",
    },
    {
      id: "guides",
      title: "Programming Guides",
      icon: BookOpen,
      description: "Access detailed programming instructions",
      href: "/technician/guides",
    },
    {
      id: "support",
      title: "Support Chat",
      icon: MessageSquare,
      description: "Get help from our support team",
      href: "/technician/support",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Welcome, {session?.user?.name}
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Technician Dashboard
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <Link
                key={feature.id}
                href={feature.href}
                className="group block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700 h-full min-h-[180px]"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors duration-200 flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                        {feature.title}
                      </h3>
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Stats Section */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg flex-shrink-0">
                <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Total Inventory Value
                </h3>
                <p className="mt-2 text-2xl font-bold text-green-600 dark:text-green-400">
                  $0.00
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex-shrink-0">
                <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Items in Stock
                </h3>
                <p className="mt-2 text-2xl font-bold text-blue-600 dark:text-blue-400">
                  0
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg flex-shrink-0">
                <Wrench className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Active Jobs
                </h3>
                <p className="mt-2 text-2xl font-bold text-purple-600 dark:text-purple-400">
                  0
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
