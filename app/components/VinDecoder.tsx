"use client";

import { useState } from "react";
import { useVinDecoder } from "@/app/hooks/useVinDecoder";
import { NHTSAVehicleInfo } from "@/app/services/nhtsaService";

export function VinDecoder() {
  const [vin, setVin] = useState("");
  const [modelYear, setModelYear] = useState<string>("");
  const { vehicleInfo, isLoading, error } = useVinDecoder({
    vin,
    modelYear: modelYear ? parseInt(modelYear) : undefined,
    enabled: vin.length > 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="vin"
            className="block text-sm font-medium text-gray-700"
          >
            VIN
          </label>
          <input
            type="text"
            id="vin"
            value={vin}
            onChange={(e) => setVin(e.target.value.toUpperCase())}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter VIN"
            maxLength={17}
          />
        </div>

        <div>
          <label
            htmlFor="modelYear"
            className="block text-sm font-medium text-gray-700"
          >
            Model Year (Optional)
          </label>
          <input
            type="number"
            id="modelYear"
            value={modelYear}
            onChange={(e) => setModelYear(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter model year"
            min="1900"
            max={new Date().getFullYear() + 1}
          />
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}

        {isLoading && (
          <div className="text-gray-600 text-sm">Decoding VIN...</div>
        )}

        {vehicleInfo && (
          <div className="mt-4 p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">
              Vehicle Information
            </h3>
            <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Make</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {vehicleInfo.make}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Model</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {vehicleInfo.model}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Year</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {vehicleInfo.year}
                </dd>
              </div>
              {vehicleInfo.bodyStyle && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Body Style
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {vehicleInfo.bodyStyle}
                  </dd>
                </div>
              )}
              {vehicleInfo.engineType && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Engine Type
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {vehicleInfo.engineType}
                  </dd>
                </div>
              )}
              {vehicleInfo.transmissionType && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Transmission
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {vehicleInfo.transmissionType}
                  </dd>
                </div>
              )}
              {vehicleInfo.fuelType && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Fuel Type
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {vehicleInfo.fuelType}
                  </dd>
                </div>
              )}
              {vehicleInfo.trim && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Trim</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {vehicleInfo.trim}
                  </dd>
                </div>
              )}
              {vehicleInfo.series && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Series</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {vehicleInfo.series}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        )}
      </form>
    </div>
  );
}
