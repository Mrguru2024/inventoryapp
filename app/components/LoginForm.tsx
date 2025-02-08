'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Logo } from './Logo';
import LoadingSpinner from './LoadingSpinner';

export default function LoginForm() {
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
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setIsLoading(false);
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

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Registration failed');
        }
      }

      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        // Redirect to the dashboard after successful login
        window.location.href = '/'; // This will trigger the session check in the LoginPage
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <main className="w-full max-w-md space-y-8">
      <div className="flex justify-center">
        <Logo />
      </div>

      <form className="w-full max-w-sm space-y-6" onSubmit={handleSubmit}>
        {isRegistering && (
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            autoComplete="name"
            required
            className="w-full px-4 py-2 border rounded"
            value={formData.name}
            onChange={handleChange}
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          autoComplete="email"
          required
          className="w-full px-4 py-2 border rounded"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          autoComplete={isRegistering ? "new-password" : "current-password"}
          required
          className="w-full px-4 py-2 border rounded"
          value={formData.password}
          onChange={handleChange}
        />
        {isRegistering && (
          <input
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="w-full px-4 py-2 border rounded"
            required
          />
        )}

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isLoading ? 'Loading...' : isRegistering ? 'Register' : 'Sign In'}
        </button>

        <button
          type="button"
          onClick={() => setIsRegistering(!isRegistering)}
          className="w-full text-sm text-gray-600"
        >
          {isRegistering ? 'Already have an account? Sign in' : 'Need an account? Register'}
        </button>
      </form>
    </main>
  );
} 