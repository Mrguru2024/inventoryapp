'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminLoginPage() {
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
        
        if (userData.role !== 'ADMIN') {
          setError('Access denied. Admin only.');
          return;
        }
        
        router.push('/admin/dashboard');
      }
    } catch (error) {
      setError('An error occurred during sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-sm w-full space-y-8 p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Admin Login</h2>
        </div>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Form fields similar to main login but styled for admin */}
        </form>
      </div>
    </div>
  );
} 