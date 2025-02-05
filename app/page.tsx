'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Logo } from './components/Logo';

export default function LoginPage() {
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'TECHNICIAN' as 'ADMIN' | 'TECHNICIAN',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isRegistering) {
        // Registration logic
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return;
        }

        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: formData.role,
          }),
        });

        if (res.ok) {
          const result = await signIn('credentials', {
            redirect: false,
            email: formData.email,
            password: formData.password,
          });

          if (result?.error) {
            setError(result.error);
          } else {
            router.push(`/${formData.role.toLowerCase()}/dashboard`);
          }
        } else {
          const data = await res.json();
          throw new Error(data.error || 'Registration failed');
        }
      } else {
        // Login logic
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
          
          if (userData?.role) {
            router.push(`/${userData.role.toLowerCase()}/dashboard`);
          } else {
            setError('Failed to get user role');
          }
        }
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center p-8">
      <main className="w-full max-w-md space-y-8">
        <div className="flex justify-center">
          <Logo />
        </div>

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
                  <option value="ADMIN">Admin</option>
                  <option value="TECHNICIAN">Technician</option>
                  <option value="CUSTOMER">Customer</option>
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
                role: 'TECHNICIAN',
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