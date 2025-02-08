'use client';

import React, { useEffect, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';

interface BarcodeScannerProps {
  onDetected: (barcode: string) => void;
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onDetected }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReader = new BrowserMultiFormatReader();

  useEffect(() => {
    if (videoRef.current) {
      codeReader
        .decodeFromConstraints(
          {
            audio: false,
            video: {
              facingMode: 'environment',
            },
          },
          videoRef.current,
          (result, error) => {
            if (result) {
              onDetected(result.getText());
              // Optionally stop scanning after detection
              // codeReader.reset();
            }
            if (error && !(error instanceof TypeError)) {
              // Ignore TypeError as it's usually just a frame without a barcode
              console.error(error);
            }
          }
        )
        .catch((err) => {
          console.error(err);
        });
    }

    return () => {
      codeReader.reset();
    };
  }, [onDetected]);

  return (
    <div className="relative">
      <video
        ref={videoRef}
        className="w-full h-64 object-cover rounded-lg"
      />
      <div className="absolute inset-0 pointer-events-none">
        <div className="relative w-full h-full">
          {/* Scanning guides */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-48 h-48 border-2 border-indigo-500 rounded-lg">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-indigo-500" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-indigo-500" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-indigo-500" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-indigo-500" />
            </div>
            {/* Scanning line animation */}
            <div className="absolute top-0 left-0 w-full">
              <div className="h-0.5 bg-indigo-500 animate-scan" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 