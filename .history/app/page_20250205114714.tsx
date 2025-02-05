'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        const response = await fetch('/api/auth/me');
        const userData = await response.json();
        
        switch (userData.role) {
          case 'ADMIN':
            router.push('/admin/dashboard');
            break;
          case 'TECHNICIAN':
            router.push('/technician/dashboard');
            break;
          default:
            router.push('/');
        }
      }
    } catch (error) {
      setError('An error occurred during sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/logo.svg"
          alt="Key Inventory System"
          width={180}
          height={38}
          priority
        />

        <form className="w-full max-w-sm space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-2 border border-black/[.1] dark:border-white/[.1] rounded-lg bg-transparent"
              placeholder="Email address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-4 py-2 border border-black/[.1] dark:border-white/[.1] rounded-lg bg-transparent"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-black/90 dark:hover:bg-white/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>

          <div className="text-center">
            <Link
              href="/auth/forgot-password"
              className="text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
            >
              Forgot password?
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
} 