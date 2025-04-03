"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

export default function ScannerPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedCode, setScannedCode] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startScanning = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        setIsScanning(true);
      } catch (error) {
        console.error("Error accessing camera:", error);
        toast.error(
          "Failed to access camera. Please make sure you have granted camera permissions."
        );
      }
    };

    const stopScanning = () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        stream = null;
      }
      setIsScanning(false);
    };

    if (isScanning) {
      startScanning();
    } else {
      stopScanning();
    }

    return () => {
      stopScanning();
    };
  }, [isScanning]);

  const handleScan = () => {
    setIsScanning(!isScanning);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Barcode Scanner</h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="aspect-video relative mb-4 bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            {!isScanning && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">
                  Camera inactive
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-center space-x-4">
            <Button
              onClick={handleScan}
              variant={isScanning ? "destructive" : "default"}
            >
              {isScanning ? "Stop Scanning" : "Start Scanning"}
            </Button>
          </div>

          {scannedCode && (
            <div className="mt-4 p-4 bg-green-100 dark:bg-green-900 rounded-lg">
              <p className="text-green-800 dark:text-green-100">
                Scanned code: {scannedCode}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
