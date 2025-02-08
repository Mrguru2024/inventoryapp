"use client";

import { useState, useEffect } from 'react';
import { useZxing } from "react-zxing";
import { X, QrCode, Camera, CameraOff } from 'lucide-react';
import { years, makes, getModelsForMakeAndYear } from '@/app/data/vehicleData';
import { keyService, type KeyData } from '@/app/services/keyService';
import { vehicleService } from '@/app/services/vehicleService';
import { transponderService } from '@/app/services/transponderService';
import VatsInfo from '@/app/components/VatsInfo';
import CommercialVehicleInfo from '@/app/components/CommercialVehicleInfo';
import LuxuryVehicleInfo from '@/app/components/LuxuryVehicleInfo';
import MotorcycleInfo from '@/app/components/MotorcycleInfo';

// Sample key database - in production this would come from your backend
const keyDatabase: { [key: string]: any } = {
  "285E3-9DJ3B": {
    year: "2019",
    make: "Nissan",
    model: "Maxima",
    fccId: "KR5TXN7",
    icNumber: "7812D-TXN7",
    continentalNumber: "S180144906",
    frequency: "433 MHz",
    battery: "CR2032",
    emergencyKey: "EKB-NIS-NI06",
    buttons: ['Lock', 'Unlock', 'Panic', 'Remote Start', 'Trunk']
  },
  // Add more key data entries...
};

export default function AddItemModal({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean;
  onClose: () => void;
}) {
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [scannedResult, setScannedResult] = useState<string>("");
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [scannerError, setScannerError] = useState<string>("");
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [availableMakes, setAvailableMakes] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    type: 'key',
    name: '',
    partNumber: '',
    fccId: '',
    icNumber: '',
    continentalNumber: '',
    frequency: '433 MHz',
    battery: 'CR2032',
    buttons: ['Lock', 'Unlock', 'Panic', 'Remote Start', 'Trunk'],
    emergencyKey: '',
    testKey: '',
    manufacturer: 'KeylessFactory',
    year: '',
    make: '',
    model: '',
    notes: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string>("");
  const [transponderInfo, setTransponderInfo] = useState<any>(null);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch makes on component mount
  useEffect(() => {
    const fetchMakes = async () => {
      const makes = await vehicleService.getAllMakes();
      setAvailableMakes(makes);
    };
    fetchMakes();
  }, []);

  // Update models when make or year changes
  useEffect(() => {
    const fetchModels = async () => {
      if (formData.make && formData.year) {
        const models = await vehicleService.getModelsForMakeYear(formData.make, formData.year);
        setAvailableModels(models);
        if (!models.includes(formData.model)) {
          setFormData(prev => ({ ...prev, model: '' }));
        }
      } else {
        setAvailableModels([]);
      }
    };
    fetchModels();
  }, [formData.make, formData.year]);

  // Fetch transponder info when vehicle details change
  useEffect(() => {
    const fetchTransponderInfo = async () => {
      if (formData.make && formData.model && formData.year) {
        try {
          const info = await transponderService.getTransponderByVehicle(
            formData.make,
            formData.model,
            parseInt(formData.year)
          );
          setTransponderInfo(info);
        } catch (error) {
          console.error('Error fetching transponder info:', error);
        }
      }
    };
    fetchTransponderInfo();
  }, [formData.make, formData.model, formData.year]);

  const handleBarcodeScanned = async (barcode: string) => {
    setIsLoading(true);
    setApiError("");
    try {
      const keyData = await keyService.searchByBarcode(barcode);
      setFormData(prev => ({
        ...prev,
        ...keyData
      }));
      setScannerError("");
    } catch (error) {
      setScannerError("Key data not found for this barcode");
      setApiError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
      if (!isMobile) {
        setIsScannerActive(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setApiError("");

    try {
      // Validate the data first
      const isValid = await keyService.validateKeyData(formData);
      if (!isValid) {
        throw new Error('Invalid key data');
      }

      // Submit the data
      await keyService.addKey(formData as KeyData);
      onClose();
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Failed to save key data');
    } finally {
      setIsLoading(false);
    }
  };

  // Scanner toggle with error reset
  const toggleScanner = () => {
    setIsScannerActive(!isScannerActive);
    setScannerError("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add New Item</h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleScanner}
                className="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                title={isScannerActive ? "Disable Scanner" : "Enable Scanner"}
              >
                {isScannerActive ? <CameraOff className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
              </button>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {isScannerActive && (
            <div className="mb-6">
              <div className="relative">
                <video
                  ref={ref}
                  className="w-full max-w-[600px] h-auto border rounded-lg mx-auto"
                  style={{ maxHeight: isMobile ? '300px' : '400px' }}
                />
                {scannerError && (
                  <div className="mt-2 text-red-500 text-sm text-center">
                    {scannerError}
                  </div>
                )}
              </div>
            </div>
          )}

          {scannedResult && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md">
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Last scanned: {scannedResult}
              </p>
            </div>
          )}

          {isLoading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          )}

          {apiError && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 rounded-md">
              <p className="text-sm text-red-600 dark:text-red-400">
                {apiError}
              </p>
            </div>
          )}

          {transponderInfo && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
              <h3 className="text-sm font-medium mb-2">Transponder Information</h3>
              <dl className="grid grid-cols-2 gap-2 text-sm">
                <dt>Type:</dt>
                <dd>{transponderInfo.transponderType}</dd>
                <dt>Chip Types:</dt>
                <dd>{transponderInfo.chipType.join(', ')}</dd>
                {transponderInfo.compatibleParts && (
                  <>
                    <dt>Compatible Parts:</dt>
                    <dd>{transponderInfo.compatibleParts.join(', ')}</dd>
                  </>
                )}
              </dl>
            </div>
          )}

          {transponderInfo?.vatsEnabled && (
            <VatsInfo system={transponderInfo.vatsSystem} />
          )}

          {transponderInfo && transponderInfo.model.startsWith('F') && (
            <CommercialVehicleInfo
              series="F"
              models={["FFR", "FRD", "FSD", "FSR", "FTR", "FTS", "FVR", "FVZ"]}
              transponderType={transponderInfo.transponderType}
              chipTypes={transponderInfo.chipType}
            />
          )}

          {transponderInfo && transponderInfo.model.startsWith('N') && (
            <CommercialVehicleInfo
              series="N"
              models={["NPR", "NQR", "NPS", "NLS", "NLR", "NNR"]}
              transponderType={transponderInfo.transponderType}
              chipTypes={transponderInfo.chipType}
            />
          )}

          {transponderInfo && transponderInfo.make === 'LEXUS' && (
            <LuxuryVehicleInfo
              transponderType={transponderInfo.transponderType}
              compatibleParts={transponderInfo.compatibleParts || []}
              isHybrid={transponderInfo.model.includes('H')}
              isFSport={transponderInfo.model.includes('F')}
            />
          )}

          {transponderInfo?.notes?.includes('Motorcycle') && (
            <MotorcycleInfo
              model={transponderInfo.model}
              transponderType={transponderInfo.transponderType}
              chipTypes={transponderInfo.chipType}
              yearStart={transponderInfo.yearStart}
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Vehicle Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Year
                </label>
                <select
                  value={formData.year}
                  onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                >
                  <option value="">Select Year</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Make
                </label>
                <select
                  value={formData.make}
                  onChange={(e) => setFormData(prev => ({ ...prev, make: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                >
                  <option value="">Select Make</option>
                  {availableMakes.map(make => (
                    <option key={make} value={make}>{make}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Model
                </label>
                <select
                  value={formData.model}
                  onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                  disabled={!formData.make}
                >
                  <option value="">Select Model</option>
                  {availableModels.map(model => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Key Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Part Number
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.partNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, partNumber: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                    placeholder="285E3-9DJ3B"
                  />
                  <button
                    type="button"
                    onClick={() => setIsScannerActive(!isScannerActive)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <QrCode className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  FCC ID
                </label>
                <input
                  type="text"
                  value={formData.fccId}
                  onChange={(e) => setFormData(prev => ({ ...prev, fccId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                  placeholder="KR5TXN7"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  IC Number
                </label>
                <input
                  type="text"
                  value={formData.icNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, icNumber: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                  placeholder="7812D-TXN7"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Continental Number
                </label>
                <input
                  type="text"
                  value={formData.continentalNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, continentalNumber: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                  placeholder="S180144906"
                />
              </div>
            </div>

            {/* Technical Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Frequency
                </label>
                <input
                  type="text"
                  value={formData.frequency}
                  onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                  placeholder="433 MHz"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Battery Type
                </label>
                <input
                  type="text"
                  value={formData.battery}
                  onChange={(e) => setFormData(prev => ({ ...prev, battery: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                  placeholder="CR2032"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Emergency Key Code
                </label>
                <input
                  type="text"
                  value={formData.emergencyKey}
                  onChange={(e) => setFormData(prev => ({ ...prev, emergencyKey: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                  placeholder="EKB-NIS-NI06"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                placeholder="Additional notes..."
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Item
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 