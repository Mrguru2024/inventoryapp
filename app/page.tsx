'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'CUSTOMER' as 'ADMIN' | 'TECHNICIAN' | 'CUSTOMER',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (isRegistering) {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        });

        if (res.ok) {
          // Auto login after registration
          await signIn('credentials', {
            redirect: false,
            email: formData.email,
            password: formData.password,
          });
          router.push('/technician/dashboard');
        } else {
          const data = await res.json();
          throw new Error(data.error || 'Registration failed');
        }
      } catch (error: any) {
        setError(error.message);
      }
    } else {
      try {
        const result = await signIn('credentials', {
          redirect: false,
          email: formData.email,
          password: formData.password,
        });

        if (result?.error) {
          setError(result.error);
        } else {
          // Get user data including role
          const response = await fetch('/api/auth/me');
          const userData = await response.json();
          
          // Redirect based on role
          switch (userData.role) {
            case 'ADMIN':
              router.push('/admin/dashboard');
              break;
            case 'TECHNICIAN':
              router.push('/technician/dashboard');
              break;
            case 'CUSTOMER':
              router.push('/customer/dashboard');
              break;
            default:
              setError('Invalid user role');
          }
        }
      } catch (error) {
        setError('An error occurred during sign in');
      }
    }
    setIsLoading(false);
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
            {isRegistering && (
              <>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required={isRegistering}
                  className="w-full px-4 py-2 border border-black/[.1] dark:border-white/[.1] rounded-lg bg-transparent"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <select
                  id="role"
                  name="role"
                  required={isRegistering}
                  className="w-full px-4 py-2 border border-black/[.1] dark:border-white/[.1] rounded-lg bg-transparent"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as typeof formData.role })}
                >
                  <option value="CUSTOMER">Customer</option>
                  <option value="TECHNICIAN">Technician</option>
                </select>
              </>
            )}
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
            {isRegistering && (
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required={isRegistering}
                className="w-full px-4 py-2 border border-black/[.1] dark:border-white/[.1] rounded-lg bg-transparent"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            )}
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
            {isLoading ? 'Processing...' : isRegistering ? 'Register' : 'Sign in'}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
              setFormData({
                name: '',
                email: '',
                password: '',
                confirmPassword: '',
                role: 'CUSTOMER',
              });
            }}
            className="w-full text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
          >
            {isRegistering ? 'Already have an account? Sign in' : 'Need an account? Register'}
          </button>

          {!isRegistering && (
            <div className="text-center">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
              >
                Forgot password?
              </Link>
            </div>
          )}
        </form>

        <div className="w-full max-w-sm space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
          
          <button
            onClick={() => signIn('google')}
            className="w-full flex items-center justify-center gap-3 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Image src="/google.svg" alt="Google" width={20} height={20} />
            Google
          </button>
          
          <button
            onClick={() => signIn('github')}
            className="w-full flex items-center justify-center gap-3 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Image src="/github.svg" alt="GitHub" width={20} height={20} />
            GitHub
          </button>
        </div>
      </main>
    </div>
  );
} 