"use client";

import { useState } from "react";
import { useToast } from "@/app/components/ui/use-toast";

interface FccIdUpdateButtonProps {
  fccId: string;
  description: string;
  onUpdate: (fccId: string, description: string) => Promise<void>;
}

const styles = {
  button: {
    base: "px-3 py-1.5 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
    primary:
      "bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 focus:ring-blue-500",
    disabled:
      "bg-slate-300 text-slate-500 dark:bg-slate-700 dark:text-slate-400 cursor-not-allowed",
  },
  input:
    "mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100 sm:text-sm",
  label: "block text-sm font-medium text-slate-700 dark:text-slate-200",
  modal: {
    overlay: "fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70",
    container: "fixed inset-0 z-10 overflow-y-auto",
    content:
      "flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0",
    dialog:
      "relative transform overflow-hidden rounded-lg bg-white dark:bg-slate-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6",
    title:
      "text-lg font-medium leading-6 text-slate-900 dark:text-slate-100 mb-4",
    buttonGroup: "mt-5 sm:mt-6 flex justify-end space-x-3",
  },
};

export default function FccIdUpdateButton({
  fccId,
  description,
  onUpdate,
}: FccIdUpdateButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newDescription, setNewDescription] = useState(description);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onUpdate(fccId, newDescription);
      setIsOpen(false);
      toast({
        title: "Success",
        description: "FCC ID updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update FCC ID",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`${styles.button.base} ${styles.button.primary}`}
      >
        Edit
      </button>

      {isOpen && (
        <div className={styles.modal.overlay}>
          <div className={styles.modal.container}>
            <div className={styles.modal.content}>
              <div className={styles.modal.dialog}>
                <h3 className={styles.modal.title}>Update FCC ID</h3>
                <form onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="fccId" className={styles.label}>
                      FCC ID
                    </label>
                    <input
                      type="text"
                      id="fccId"
                      value={fccId}
                      disabled
                      className={styles.input}
                    />
                  </div>
                  <div className="mt-4">
                    <label htmlFor="description" className={styles.label}>
                      Description
                    </label>
                    <input
                      type="text"
                      id="description"
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      className={styles.input}
                      required
                    />
                  </div>
                  <div className={styles.modal.buttonGroup}>
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className={`${styles.button.base} bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`${styles.button.base} ${
                        isLoading
                          ? styles.button.disabled
                          : styles.button.primary
                      }`}
                    >
                      {isLoading ? "Updating..." : "Update"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
