'use client';

import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { useToast } from '@/app/components/ui/use-toast';
import { UploadIcon, FileIcon, XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function TransponderUploadModal() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile?.type === 'text/csv') {
      setFile(droppedFile);
    } else {
      toast({
        title: 'Invalid file type',
        description: 'Please select a CSV file',
        variant: 'destructive',
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile?.type === 'text/csv') {
      setFile(selectedFile);
    } else {
      toast({
        title: 'Invalid file type',
        description: 'Please select a CSV file',
        variant: 'destructive',
      });
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/transponder/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      toast({
        title: 'Upload Successful',
        description: `Imported ${data.successful} transponder records`,
      });
      setOpen(false);
      setFile(null);
    } catch (error) {
      toast({
        title: 'Upload Failed',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="default">
        <UploadIcon className="mr-2 h-4 w-4" />
        Import CSV
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Import Transponder Data</DialogTitle>
            <DialogDescription>
              Upload a CSV file containing transponder data.
              Make sure to follow the correct format.
            </DialogDescription>
          </DialogHeader>

          <div 
            className={cn(
              "mt-4 flex flex-col items-center justify-center rounded-lg border border-dashed p-6",
              dragActive && "border-primary bg-muted",
              "relative"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            
            {file ? (
              <div className="flex items-center gap-2">
                <FileIcon className="h-8 w-8 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2"
                  onClick={(e) => {
                    e.preventDefault();
                    setFile(null);
                  }}
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <UploadIcon className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm font-medium">
                  Drag & drop your CSV file here or click to browse
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Only CSV files are supported
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpload} 
              disabled={!file || uploading}
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 