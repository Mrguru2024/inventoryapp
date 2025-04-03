"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Authentication Error
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {error || "An error occurred during authentication"}
          </p>
        </div>
        <div className="mt-8 text-center">
          <Link href="/auth/signin">
            <Button>Return to Sign In</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
