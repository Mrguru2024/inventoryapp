'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {pathname.split('/').pop()?.replace('-', ' ').split(' ')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')}
              </h1>
            </div>
          </div>
          <div className="flex items-center">
            {/* Add any additional nav items/buttons here */}
          </div>
        </div>
      </div>
    </nav>
  );
} 