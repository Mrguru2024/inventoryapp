import FccDataManager from "@/app/components/admin/FccDataManager";
import FccDocumentation from "./documentation";

export const metadata = {
  title: "Manage Transponder FCC IDs",
  description: "Scrape and update FCC ID data for transponder keys",
};

export default function ManageFccPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Manage Transponder FCC IDs</h1>
      <p className="mb-8 text-gray-600 dark:text-gray-300">
        This tool allows you to update the FCC ID data for transponder keys in
        the database by scraping external sources.
      </p>

      <FccDataManager />

      <FccDocumentation />
    </div>
  );
}
