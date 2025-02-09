'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { X, Camera } from 'lucide-react';

interface AddKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Add key type options
const KEY_TYPES = [
  'Remote Key',
  'Smart Key',
  'Proximity Key',
  'Flip Key',
  'Switchblade Key',
  'Basic Key',
  'Remote Head Key',
  'Other'
] as const;

export default function AddKeyModal({ isOpen, onClose }: AddKeyModalProps) {
  const [formData, setFormData] = useState({
    fccId: '',
    icId: '',
    continentalId: '',
    frequency: '433 MHz',
    battery: 'CR2032',
    buttons: 'Lock, Unlock, Panic, Remote Start, Trunk',
    emergencyKey: '',
    testKey: '',
    replacesPN: '',
    manufacturer: 'KeylessFactory',
    quantity: 1,
    keyType: '', // Add key type field
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/80" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto w-full max-w-xl rounded-lg bg-gray-900 p-6 text-white">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-xl font-bold">Brand New Aftermarket Replacement</Dialog.Title>
            <div className="flex items-center gap-2">
              <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-full">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label className="text-gray-300">Key Type</Label>
                <select
                  value={formData.keyType}
                  onChange={(e) => setFormData({ ...formData, keyType: e.target.value })}
                  className="w-full bg-gray-800 border-gray-700 rounded-md p-2 text-white"
                  required
                >
                  <option value="">Select Key Type</option>
                  {KEY_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="text-gray-300">FCC ID</Label>
                <Input
                  value={formData.fccId}
                  onChange={(e) => setFormData({ ...formData, fccId: e.target.value })}
                  placeholder="KR5TXN7"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div>
                <Label className="text-gray-300">IC</Label>
                <Input
                  value={formData.icId}
                  onChange={(e) => setFormData({ ...formData, icId: e.target.value })}
                  placeholder="7812D-TXN7"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div>
                <Label className="text-gray-300">Continental</Label>
                <Input
                  value={formData.continentalId}
                  onChange={(e) => setFormData({ ...formData, continentalId: e.target.value })}
                  placeholder="S180144906"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div>
                <Label className="text-gray-300">Frequency</Label>
                <Input
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  placeholder="433 MHz"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div>
                <Label className="text-gray-300">Battery</Label>
                <Input
                  value={formData.battery}
                  onChange={(e) => setFormData({ ...formData, battery: e.target.value })}
                  placeholder="CR2032"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div>
                <Label className="text-gray-300">Buttons</Label>
                <Input
                  value={formData.buttons}
                  onChange={(e) => setFormData({ ...formData, buttons: e.target.value })}
                  placeholder="Lock, Unlock, Panic, Remote Start, Trunk"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div>
                <Label className="text-gray-300">Emergency Key</Label>
                <Input
                  value={formData.emergencyKey}
                  onChange={(e) => setFormData({ ...formData, emergencyKey: e.target.value })}
                  placeholder="EKB-NIS-NI06"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div>
                <Label className="text-gray-300">Test Key</Label>
                <Input
                  value={formData.testKey}
                  onChange={(e) => setFormData({ ...formData, testKey: e.target.value })}
                  placeholder="DA34"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div>
                <Label className="text-gray-300">Replaces PN</Label>
                <Input
                  value={formData.replacesPN}
                  onChange={(e) => setFormData({ ...formData, replacesPN: e.target.value })}
                  placeholder="285E3-9DJ3B"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div>
                <Label className="text-gray-300">Manufacturer</Label>
                <Input
                  value={formData.manufacturer}
                  onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                  placeholder="KeylessFactory"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div>
                <Label className="text-gray-300">Quantity</Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="bg-transparent hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button type="submit">
                Add Key
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 