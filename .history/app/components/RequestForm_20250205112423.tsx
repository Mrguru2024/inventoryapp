'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { Inventory } from '@prisma/client';

interface RequestFormProps {
  inventory: Inventory;
  onRequestComplete: () => void;
}

export default function RequestForm({ inventory, onRequestComplete }: RequestFormProps) {
  const { data: session } = useSession();
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await axios.post('/api/requests', {
        inventoryId: inventory.id,
        quantityRequested: quantity,
      });
      onRequestComplete();
      setQuantity(1);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to submit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
          Quantity
        </label>
        <input
          type="number"
          id="quantity"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          className="input-field mt-1"
          required
        />
      </div>
      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Request'}
      </button>
    </form>
  );
} 