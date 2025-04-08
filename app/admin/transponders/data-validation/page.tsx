import TransponderDataValidator from "@/app/components/admin/TransponderDataValidator";

export const metadata = {
  title: "Transponder Data Validation",
  description:
    "Validate transponder data against scraped FCC ID reference data",
};

export default function TransponderDataValidationPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Transponder Data Validation</h1>
      <p className="mb-8 text-gray-600 dark:text-gray-300">
        This page lets you validate your transponder database entries against
        the scraped FCC ID reference data. It helps identify inconsistencies and
        potential issues in your records.
      </p>

      <TransponderDataValidator />

      <div className="mt-12 border-t pt-6">
        <h2 className="text-2xl font-bold mb-4">About Data Validation</h2>
        <p className="mb-4">
          The data validation system compares the values stored in your database
          with the information gathered from external sources through the FCC ID
          scraping process.
        </p>
        <p className="mb-4">
          This helps ensure that your transponder database contains:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">Accurate frequency information</li>
          <li className="mb-2">Correct compatible parts information</li>
          <li className="mb-2">Up-to-date chip type information</li>
          <li className="mb-2">Valid transponder types</li>
        </ul>
        <p className="mb-4">
          When discrepancies are found, you can use the "Fix" button to
          automatically update your database with the correct information from
          the scraped sources.
        </p>
        <p>
          To ensure your scraped data is up to date, run the{" "}
          <a
            href="/admin/transponders/manage-fcc"
            className="text-blue-500 hover:text-blue-600"
          >
            FCC ID scrapers
          </a>{" "}
          first.
        </p>
      </div>
    </div>
  );
}
