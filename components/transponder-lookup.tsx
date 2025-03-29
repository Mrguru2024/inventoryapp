import React, { useState, useEffect } from "react";

export function TransponderLookup() {
  const [makes, setMakes] = useState<
    Array<{ Make_ID: number; Make_Name: string }>
  >([]);

  useEffect(() => {
    fetchMakes();
  }, []);

  const fetchMakes = async () => {
    try {
      const response = await fetch("/api/vehicles/makes");
      if (!response.ok) {
        throw new Error("Failed to fetch makes");
      }
      const data = await response.json();
      setMakes(data.Results);
    } catch (error) {
      console.error("Error fetching makes:", error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Transponder Lookup</h2>
      <div className="space-y-4">
        <div>
          <label
            htmlFor="make"
            className="block text-sm font-medium text-gray-700"
          >
            Make
          </label>
          <select
            id="make"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select a make</option>
            {makes.map((make) => (
              <option key={make.Make_ID} value={make.Make_ID}>
                {make.Make_Name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
