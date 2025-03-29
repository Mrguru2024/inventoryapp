"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  transponderService,
  TransponderData,
} from "@/app/services/transponderService";
import { toast } from "react-hot-toast";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { useNhtsaData } from "@/app/hooks/useNhtsaData";

interface AddTransponderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddTransponderModal({
  isOpen,
  onClose,
}: AddTransponderModalProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    makes,
    models,
    years,
    selectedMake,
    selectedModel,
    selectedYear,
    setSelectedMake,
    setSelectedModel,
    setSelectedYear,
    isLoading: isLoadingNhtsa,
    error: nhtsaError,
  } = useNhtsaData();

  const [formData, setFormData] = useState({
    make: "",
    model: "",
    yearStart: "",
    yearEnd: "",
    transponderType: "",
    frequency: "",
    chipType: "",
    compatibleParts: "",
    notes: "",
    dualSystem: false,
  });

  // Predefined options for transponder types and frequencies
  const TRANSPONDER_TYPES = [
    "ID46",
    "ID47",
    "ID48",
    "ID49",
    "ID60",
    "ID63",
    "ID67",
    "ID68",
    "ID69",
    "ID70",
    "ID73",
    "ID74",
    "ID75",
    "ID76",
    "ID77",
    "ID78",
    "ID79",
    "ID80",
    "ID81",
    "ID82",
    "ID83",
    "ID84",
    "ID85",
    "ID86",
    "ID87",
    "ID88",
    "ID89",
    "ID90",
    "ID91",
    "ID92",
    "ID93",
    "ID94",
    "ID95",
    "ID96",
    "ID97",
    "ID98",
    "ID99",
    "ID100",
    "ID101",
    "ID102",
    "ID103",
    "ID104",
    "ID105",
    "ID106",
    "ID107",
    "ID108",
    "ID109",
    "ID110",
    "ID111",
    "ID112",
    "ID113",
    "ID114",
    "ID115",
    "ID116",
    "ID117",
    "ID118",
    "ID119",
    "ID120",
    "ID121",
    "ID122",
    "ID123",
    "ID124",
    "ID125",
    "ID126",
    "ID127",
    "ID128",
    "ID129",
    "ID130",
    "ID131",
    "ID132",
    "ID133",
    "ID134",
    "ID135",
    "ID136",
    "ID137",
    "ID138",
    "ID139",
    "ID140",
    "ID141",
    "ID142",
    "ID143",
    "ID144",
    "ID145",
    "ID146",
    "ID147",
    "ID148",
    "ID149",
    "ID150",
    "ID151",
    "ID152",
    "ID153",
    "ID154",
    "ID155",
    "ID156",
    "ID157",
    "ID158",
    "ID159",
    "ID160",
    "ID161",
    "ID162",
    "ID163",
    "ID164",
    "ID165",
    "ID166",
    "ID167",
    "ID168",
    "ID169",
    "ID170",
    "ID171",
    "ID172",
    "ID173",
    "ID174",
    "ID175",
    "ID176",
    "ID177",
    "ID178",
    "ID179",
    "ID180",
    "ID181",
    "ID182",
    "ID183",
    "ID184",
    "ID185",
    "ID186",
    "ID187",
    "ID188",
    "ID189",
    "ID190",
    "ID191",
    "ID192",
    "ID193",
    "ID194",
    "ID195",
    "ID196",
    "ID197",
    "ID198",
    "ID199",
    "ID200",
  ];

  const FREQUENCIES = [
    "125 kHz",
    "134.2 kHz",
    "315 MHz",
    "433 MHz",
    "434 MHz",
    "868 MHz",
    "915 MHz",
    "2.4 GHz",
    "5.8 GHz",
  ];

  const CHIP_TYPES = [
    "TMS370",
    "TMS372",
    "TMS373",
    "TMS374",
    "TMS375",
    "TMS376",
    "TMS377",
    "TMS378",
    "TMS379",
    "TMS380",
    "TMS381",
    "TMS382",
    "TMS383",
    "TMS384",
    "TMS385",
    "TMS386",
    "TMS387",
    "TMS388",
    "TMS389",
    "TMS390",
    "TMS391",
    "TMS392",
    "TMS393",
    "TMS394",
    "TMS395",
    "TMS396",
    "TMS397",
    "TMS398",
    "TMS399",
    "TMS400",
    "TMS401",
    "TMS402",
    "TMS403",
    "TMS404",
    "TMS405",
    "TMS406",
    "TMS407",
    "TMS408",
    "TMS409",
    "TMS410",
    "TMS411",
    "TMS412",
    "TMS413",
    "TMS414",
    "TMS415",
    "TMS416",
    "TMS417",
    "TMS418",
    "TMS419",
    "TMS420",
    "TMS421",
    "TMS422",
    "TMS423",
    "TMS424",
    "TMS425",
    "TMS426",
    "TMS427",
    "TMS428",
    "TMS429",
    "TMS430",
    "TMS431",
    "TMS432",
    "TMS433",
    "TMS434",
    "TMS435",
    "TMS436",
    "TMS437",
    "TMS438",
    "TMS439",
    "TMS440",
    "TMS441",
    "TMS442",
    "TMS443",
    "TMS444",
    "TMS445",
    "TMS446",
    "TMS447",
    "TMS448",
    "TMS449",
    "TMS450",
    "TMS451",
    "TMS452",
    "TMS453",
    "TMS454",
    "TMS455",
    "TMS456",
    "TMS457",
    "TMS458",
    "TMS459",
    "TMS460",
    "TMS461",
    "TMS462",
    "TMS463",
    "TMS464",
    "TMS465",
    "TMS466",
    "TMS467",
    "TMS468",
    "TMS469",
    "TMS470",
    "TMS471",
    "TMS472",
    "TMS473",
    "TMS474",
    "TMS475",
    "TMS476",
    "TMS477",
    "TMS478",
    "TMS479",
    "TMS480",
    "TMS481",
    "TMS482",
    "TMS483",
    "TMS484",
    "TMS485",
    "TMS486",
    "TMS487",
    "TMS488",
    "TMS489",
    "TMS490",
    "TMS491",
    "TMS492",
    "TMS493",
    "TMS494",
    "TMS495",
    "TMS496",
    "TMS497",
    "TMS498",
    "TMS499",
    "TMS500",
  ];

  const addMutation = useMutation({
    mutationFn: (data: Omit<TransponderData, "id">) =>
      transponderService.addTransponderData(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transponders"] });
      toast.success("Transponder added successfully");
      onClose();
      // Reset form
      setFormData({
        make: "",
        model: "",
        yearStart: "",
        yearEnd: "",
        transponderType: "",
        frequency: "",
        chipType: "",
        compatibleParts: "",
        notes: "",
        dualSystem: false,
      });
      setSelectedMake("");
      setSelectedModel("");
      setSelectedYear(null);
    },
    onError: (error) => {
      toast.error("Failed to add transponder");
      console.error("Add error:", error);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addMutation.mutateAsync({
        ...formData,
        make: selectedMake,
        model: selectedModel,
        yearStart: selectedYear || 0,
        yearEnd: Number(formData.yearEnd),
        chipType: formData.chipType
          ? formData.chipType.split(",").map((type) => type.trim())
          : [],
        compatibleParts: formData.compatibleParts
          ? formData.compatibleParts.split(",").map((part) => part.trim())
          : [],
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (name === "make") {
      setSelectedMake(value);
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        model: "", // Reset model when make changes
      }));
    } else if (name === "model") {
      setSelectedModel(value);
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else if (name === "yearStart") {
      setSelectedYear(value ? Number(value) : null);
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
      }));
    }
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value.split(",").map((item) => item.trim()),
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add New Transponder</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Make Selection */}
          <div>
            <label
              htmlFor="make"
              className="block text-sm font-medium text-gray-700"
            >
              Make
            </label>
            <select
              id="make"
              name="make"
              value={selectedMake}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              disabled={isLoadingNhtsa}
              aria-label="Vehicle make"
            >
              <option value="">Select Make</option>
              {makes.map((make) => (
                <option key={make.Make_ID} value={make.Make_Name}>
                  {make.Make_Name}
                </option>
              ))}
            </select>
          </div>

          {/* Model Selection */}
          <div>
            <label
              htmlFor="model"
              className="block text-sm font-medium text-gray-700"
            >
              Model
            </label>
            <select
              id="model"
              name="model"
              value={selectedModel}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              disabled={!selectedMake || isLoadingNhtsa}
              aria-label="Vehicle model"
            >
              <option value="">Select Model</option>
              {models.map((model) => (
                <option key={model.Model_ID} value={model.Model_Name}>
                  {model.Model_Name}
                </option>
              ))}
            </select>
          </div>

          {/* Year Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="yearStart"
                className="block text-sm font-medium text-gray-700"
              >
                Start Year
              </label>
              <select
                id="yearStart"
                name="yearStart"
                value={selectedYear || ""}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                disabled={isLoadingNhtsa}
                aria-label="Start year"
              >
                <option value="">Select Year</option>
                {years.map((year) => (
                  <option key={year.Year} value={year.Year}>
                    {year.Year}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="yearEnd"
                className="block text-sm font-medium text-gray-700"
              >
                End Year
              </label>
              <select
                id="yearEnd"
                name="yearEnd"
                value={formData.yearEnd}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                disabled={isLoadingNhtsa}
                aria-label="End year"
              >
                <option value="">Select Year</option>
                {years.map((year) => (
                  <option key={year.Year} value={year.Year}>
                    {year.Year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {nhtsaError && (
            <div className="text-red-600 text-sm mt-2">
              Error loading vehicle data: {nhtsaError}
            </div>
          )}

          {/* Transponder Type with Autocomplete */}
          <div>
            <label
              htmlFor="transponderType"
              className="block text-sm font-medium text-gray-700"
            >
              Transponder Type
            </label>
            <input
              type="text"
              id="transponderType"
              name="transponderType"
              value={formData.transponderType}
              onChange={handleChange}
              list="transponderTypes"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              aria-label="Transponder type"
            />
            <datalist id="transponderTypes">
              {TRANSPONDER_TYPES.map((type) => (
                <option key={type} value={type} />
              ))}
            </datalist>
          </div>

          {/* Frequency with Autocomplete */}
          <div>
            <label
              htmlFor="frequency"
              className="block text-sm font-medium text-gray-700"
            >
              Frequency
            </label>
            <input
              type="text"
              id="frequency"
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
              list="frequencies"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              aria-label="Frequency"
            />
            <datalist id="frequencies">
              {FREQUENCIES.map((freq) => (
                <option key={freq} value={freq} />
              ))}
            </datalist>
          </div>

          {/* Chip Type with Autocomplete */}
          <div>
            <label
              htmlFor="chipType"
              className="block text-sm font-medium text-gray-700"
            >
              Chip Type
            </label>
            <input
              type="text"
              id="chipType"
              name="chipType"
              value={formData.chipType}
              onChange={handleChange}
              list="chipTypes"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              aria-label="Chip type"
            />
            <datalist id="chipTypes">
              {CHIP_TYPES.map((chip) => (
                <option key={chip} value={chip} />
              ))}
            </datalist>
          </div>

          {/* Compatible Parts */}
          <div>
            <label
              htmlFor="compatibleParts"
              className="block text-sm font-medium text-gray-700"
            >
              Compatible Parts
            </label>
            <input
              type="text"
              id="compatibleParts"
              name="compatibleParts"
              value={formData.compatibleParts}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter compatible parts (comma-separated)"
              aria-label="Compatible parts"
            />
          </div>

          {/* Notes */}
          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700"
            >
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              aria-label="Notes"
            />
          </div>

          {/* Dual System Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="dualSystem"
              name="dualSystem"
              checked={formData.dualSystem}
              onChange={(e) =>
                setFormData({ ...formData, dualSystem: e.target.checked })
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              aria-label="Dual system"
            />
            <label
              htmlFor="dualSystem"
              className="ml-2 block text-sm text-gray-900"
            >
              Dual System
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-label="Cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              aria-label="Add transponder"
            >
              {isSubmitting ? "Adding..." : "Add Transponder"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
