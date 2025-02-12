import { Card } from "@/app/components/ui/card";

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <Card className="p-6">
        <p className="text-gray-600">
          Welcome to the admin area. Use the sidebar to navigate.
        </p>
      </Card>
    </div>
  );
} 