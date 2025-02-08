'use client';

import React from 'react';

interface DashboardWrapperProps {
  children: React.ReactNode;
}

export default function DashboardWrapper({ children }: DashboardWrapperProps) {
  return (
    <div className="h-full space-y-6">
      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-4 py-5 sm:p-6">{children}</div>
      </div>
    </div>
  );
} 