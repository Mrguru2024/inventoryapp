'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Check, AlertTriangle, ChevronDown, Loader2, KeyRound, RefreshCcw, Search, X } from 'lucide-react';
import { Listbox, Transition } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import debounce from 'lodash/debounce';

interface Make {
  MakeId: number;
  MakeName: string;
}

interface Model {
  ModelId: number;
  ModelName: string;
}

interface ErrorDetails {
  message: string;
  details?: string;
  retryCount: number;
}

const STORAGE_KEY = 'nhtsa-selection';

export default function NhtsaApiTest() {
  const [makes, setMakes] = useState<Make[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [selectedMake, setSelectedMake] = useState<Make | null>(null);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [apiStatus, setApiStatus] = useState<'connected' | 'error'>('connected');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [error, setError] = useState<ErrorDetails | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const savedSelection = localStorage.getItem(STORAGE_KEY);
    if (savedSelection) {
      const { make, model } = JSON.parse(savedSelection);
      if (make) {
        setSelectedMake(make);
        fetchModels(make.MakeName).then(() => {
          if (model) {
            setSelectedModel(model);
          }
        });
      }
    }
    fetchMakes();
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      make: selectedMake,
      model: selectedModel
    }));
  }, [selectedMake, selectedModel]);

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      setSearchTerm(term);
    }, 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    e.target.value = value;
    debouncedSearch(value);
  };

  const clearSearch = () => {
    setSearchTerm('');
    const searchInput = document.querySelector<HTMLInputElement>('input[type="text"]');
    if (searchInput) {
      searchInput.value = '';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  const filteredMakes = useMemo(() => {
    if (!searchTerm) return makes;
    return makes.filter(make => 
      make.MakeName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [makes, searchTerm]);

  const filteredModels = useMemo(() => {
    if (!searchTerm) return models;
    return models.filter(model => 
      model.ModelName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [models, searchTerm]);

  const fetchMakes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMakes(data.Results);
      setApiStatus('connected');
    } catch (error) {
      setApiStatus('error');
      setError({
        message: 'Failed to load vehicle makes',
        details: error instanceof Error ? error.message : 'Unknown error occurred',
        retryCount
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchModels = async (make: string, retry = 0) => {
    setIsLoadingModels(true);
    setError(null);
    try {
      const response = await fetch(
        `https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${make}?format=json`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setModels(data.Results);
    } catch (error) {
      setModels([]);
      if (retry < 3) {
        setTimeout(() => fetchModels(make, retry + 1), 1000 * (retry + 1));
      } else {
        setError({
          message: `Failed to load models for ${make}`,
          details: error instanceof Error ? error.message : 'Unknown error occurred',
          retryCount: retry
        });
      }
    } finally {
      setIsLoadingModels(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  const handleMakeChange = (make: Make | null) => {
    setSelectedMake(make);
    setSelectedModel(null);
    if (make) {
      fetchModels(make.MakeName);
    } else {
      setModels([]);
    }
  };

  return (
    <motion.div 
      className="space-y-6 p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-lg shadow"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* API Status and Search */}
      <motion.div 
        className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700 gap-4"
        variants={itemVariants}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">NHTSA API Test</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">API Status:</span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`flex items-center ${
                apiStatus === 'connected' 
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {apiStatus === 'connected' ? (
                <Check className="w-4 h-4 mr-1" />
              ) : (
                <AlertTriangle className="w-4 h-4 mr-1" />
              )}
              {apiStatus === 'connected' ? 'Connected' : 'Error'}
            </motion.span>
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search makes or models..."
            onChange={handleSearchChange}
            className="pl-10 pr-10 py-2 w-full border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          />
          <AnimatePresence>
            {searchTerm && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={clearSearch}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Error Message */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-400">{error.message}</p>
                {error.details && (
                  <p className="text-xs text-red-500 dark:text-red-300 mt-1">{error.details}</p>
                )}
              </div>
              <button
                onClick={handleRetry}
                className="p-1 hover:bg-red-100 dark:hover:bg-red-800 rounded-md"
              >
                <RefreshCcw className="h-4 w-4 text-red-600 dark:text-red-400" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard Navigation Hint */}
      <motion.div 
        variants={itemVariants}
        className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-md"
      >
        <KeyRound className="h-4 w-4" />
        <span>Use ↑↓ to navigate, Enter to select, Esc to close</span>
      </motion.div>

      {/* Selection Controls */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
      >
        {/* Make Selection */}
        <div>
          <Listbox value={selectedMake} onChange={handleMakeChange}>
            <div className="relative mt-1">
              <Listbox.Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Make
              </Listbox.Label>
              <div className="relative">
                <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 sm:text-sm">
                  <span className="block truncate text-gray-900 dark:text-gray-100">
                    {isLoading ? 'Loading...' : (selectedMake?.MakeName || 'Select Make')}
                  </span>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    )}
                  </span>
                </Listbox.Button>

                <Transition
                  as={React.Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                    {filteredMakes.map((make) => (
                      <Listbox.Option
                        key={make.MakeId}
                        className={({ active }) =>
                          `${active ? 'text-blue-900 dark:text-blue-100 bg-blue-100 dark:bg-blue-900' : 
                            'text-gray-900 dark:text-gray-100'}
                            cursor-pointer select-none relative py-2 pl-10 pr-4`
                        }
                        value={make}
                      >
                        {({ selected, active }) => (
                          <>
                            <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                              {make.MakeName}
                            </span>
                            {selected && (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600 dark:text-blue-400">
                                <Check className="h-5 w-5" aria-hidden="true" />
                              </span>
                            )}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </div>
          </Listbox>
        </div>

        {/* Model Selection */}
        <div>
          <Listbox value={selectedModel} onChange={setSelectedModel} disabled={!selectedMake || isLoadingModels}>
            <div className="relative mt-1">
              <Listbox.Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Models
              </Listbox.Label>
              <div className="relative">
                <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 sm:text-sm disabled:opacity-50">
                  <span className="block truncate text-gray-900 dark:text-gray-100">
                    {isLoadingModels ? 'Loading...' : (selectedModel?.ModelName || 'Select Model')}
                  </span>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    {isLoadingModels ? (
                      <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    )}
                  </span>
                </Listbox.Button>

                <Transition
                  as={React.Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                    {filteredModels.map((model) => (
                      <Listbox.Option
                        key={model.ModelId}
                        className={({ active }) =>
                          `${active ? 'text-blue-900 dark:text-blue-100 bg-blue-100 dark:bg-blue-900' : 
                            'text-gray-900 dark:text-gray-100'}
                            cursor-pointer select-none relative py-2 pl-10 pr-4`
                        }
                        value={model}
                      >
                        {({ selected, active }) => (
                          <>
                            <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                              {model.ModelName}
                            </span>
                            {selected && (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600 dark:text-blue-400">
                                <Check className="h-5 w-5" aria-hidden="true" />
                              </span>
                            )}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </div>
          </Listbox>
        </div>
      </motion.div>

      {/* Status Info */}
      <motion.div 
        variants={itemVariants}
        className="mt-4 text-sm text-gray-600 dark:text-gray-400 flex items-center justify-between"
      >
        <span>Loaded {makes.length} makes and {models.length} models</span>
        {(isLoading || isLoadingModels) && (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading...
          </span>
        )}
      </motion.div>
    </motion.div>
  );
} 