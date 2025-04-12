import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/auth.config";

export async function TechnicianAuthCheck() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  if (session.user.role !== "TECHNICIAN") {
    redirect("/");
  }

  return null;
}
