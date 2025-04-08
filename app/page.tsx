import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { redirect } from "next/navigation";
import LoginFormWrapper from "./components/LoginFormWrapper";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  // Redirect if already authenticated
  if (session) {
    if (session.user.role === "ADMIN") {
      redirect("/admin/dashboard"); // Redirect to admin dashboard
    } else if (session.user.role === "TECHNICIAN") {
      redirect("/technician/dashboard"); // Redirect to technician dashboard
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoginFormWrapper />
    </div>
  );
}

export function Home() {
  // Redirect to dashboard by default
  redirect("/dashboard");
}
