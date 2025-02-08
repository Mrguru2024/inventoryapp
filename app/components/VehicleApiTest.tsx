"use client";

import { useEffect, useState } from 'react';
import { vehicleService } from '@/app/services/vehicleService';

export default function VehicleApiTest() {
  const [apiStatus, setApiStatus] = useState<'testing' | 'success' | 'error'>('testing');
  const [makes, setMakes] = useState<string[]>([]);
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [models, setModels] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    testApiConnection();
  }, []);

  const testApiConnection = async () => {
    try {
      const isConnected = await vehicleService.testApiConnection();
      setApiStatus(isConnected ? 'success' : 'error');
      if (isConnected) {
        const makesList = await vehicleService.getAllMakes();
        setMakes(makesList);
      }
    } catch (error) {
      setApiStatus('error');
      setError('Failed to connect to NHTSA API');
    }
  };

  const handleMakeChange = async (make: string) => {
    setSelectedMake(make);
    if (make && selectedYear) {
      try {
        const modelsList = await vehicleService.getModelsForMakeYear(make, selectedYear);
        setModels(modelsList);
        setError('');
      } catch (error) {
        setError('Failed to fetch models');
        setModels([]);
      }
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">NHTSA API Test</h2>
      
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span>API Status:</span>
          {apiStatus === 'testing' && <span className="text-yellow-500">Testing...</span>}
          {apiStatus === 'success' && <span className="text-green-500">Connected</span>}
          {apiStatus === 'error' && <span className="text-red-500">Error</span>}
        </div>

        {error && (
          <div className="text-red-500 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Make</label>
            <select
              value={selectedMake}
              onChange={(e) => handleMakeChange(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Make</option>
              {makes.map(make => (
                <option key={make} value={make}>{make}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Models</label>
            <select
              className="w-full p-2 border rounded"
              disabled={!models.length}
            >
              <option value="">Select Model</option>
              {models.map(model => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400">
          {makes.length > 0 && (
            <p>Loaded {makes.length} makes and {models.length} models</p>
          )}
        </div>
      </div>
    </div>
  );
} 