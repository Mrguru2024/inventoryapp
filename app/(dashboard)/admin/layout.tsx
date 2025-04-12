import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  // Allow access to inventory for all authenticated users
  if (session.user.role === "TECHNICIAN" || session.user.role === "MANAGER") {
    return <div className="h-full">{children}</div>;
  }

  // For other admin routes, verify admin role
  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  return <div className="h-full">{children}</div>;
}
