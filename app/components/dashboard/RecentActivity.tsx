"use client";

import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  user: {
    name: string;
  };
}

export default function RecentActivity() {
  const { data: activities, isLoading } = useQuery<Activity[]>({
    queryKey: ["recentActivities"],
    queryFn: async () => {
      const response = await fetch("/api/dashboard/activities");
      if (!response.ok) throw new Error("Failed to fetch activities");
      return response.json();
    },
  });

  if (isLoading) {
    return <div>Loading activities...</div>;
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {!activities?.length ? (
          <p className="text-gray-500">No recent activity</p>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4">
              <div className="flex-1">
                <p className="text-sm">{activity.description}</p>
                <p className="text-xs text-gray-500">
                  {activity.user.name} •{" "}
                  {formatDistanceToNow(new Date(activity.timestamp), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
