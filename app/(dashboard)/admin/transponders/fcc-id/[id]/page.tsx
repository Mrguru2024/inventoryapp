import { prisma } from "@/app/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import fs from "fs";
import path from "path";
import FccIdUpdateButton from "./FccIdUpdateButton";

interface PageProps {
  params: {
    id: string;
  };
}

export const metadata = {
  title: "FCC ID Details",
  description: "View detailed information about a specific FCC ID",
};

async function getFccIdDetails(fccId: string) {
  try {
    // Get transponder from database
    const transponder = await prisma.transponderKey.findFirst({
      where: {
        fccId: fccId,
      },
    });

    // Get scraped data
    const transponderyDataPath = path.join(
      process.cwd(),
      "data",
      "transpondery-fccid.json"
    );
    const uhsDataPath = path.join(process.cwd(), "data", "uhs-fccid.json");

    let scrapedData = null;

    // Check Transpondery data
    if (fs.existsSync(transponderyDataPath)) {
      try {
        const rawData = fs.readFileSync(transponderyDataPath, "utf8");
        const transponderyData = JSON.parse(rawData);
        const match = transponderyData.find(
          (item: any) => item.fccId === fccId
        );
        if (match) {
          scrapedData = {
            ...match,
            source: "Transpondery.com",
          };
        }
      } catch (error) {
        console.error("Error reading Transpondery data:", error);
      }
    }

    // If not found in Transpondery, check UHS
    if (!scrapedData && fs.existsSync(uhsDataPath)) {
      try {
        const rawData = fs.readFileSync(uhsDataPath, "utf8");
        const uhsData = JSON.parse(rawData);
        const match = uhsData.find((item: any) => item.fccId === fccId);
        if (match) {
          scrapedData = {
            ...match,
            source: "UHS Hardware",
          };
        }
      } catch (error) {
        console.error("Error reading UHS data:", error);
      }
    }

    return {
      transponder,
      scrapedData,
    };
  } catch (error) {
    console.error("Error fetching FCC ID details:", error);
    return null;
  }
}

export default async function FccIdDetailsPage({ params }: PageProps) {
  const data = await getFccIdDetails(params.id);

  if (!data || (!data.transponder && !data.scrapedData)) {
    notFound();
  }

  const { transponder, scrapedData } = data;

  // Handle chipType and compatibleParts properly regardless of format
  const formatArrayField = (field: any) => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    if (typeof field === "string")
      return field.split(",").map((item) => item.trim());
    return [];
  };

  const chipType = transponder ? formatArrayField(transponder.chipType) : [];
  const compatibleParts = transponder
    ? formatArrayField(transponder.compatibleParts)
    : [];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-4">
        <Link
          href="/admin/transponders/fcc-data"
          className="text-blue-500 hover:text-blue-600"
        >
          ← Back to FCC ID List
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6 flex items-center">
        FCC ID:{" "}
        <span className="ml-2 font-mono bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded text-blue-600 dark:text-blue-400">
          {params.id}
        </span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Database Information */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            Database Information
          </h2>

          {transponder ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                  Make:
                </label>
                <p className="text-lg font-medium">{transponder.make}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                  Model:
                </label>
                <p className="text-lg font-medium">{transponder.model}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                  Year:
                </label>
                <p className="text-lg font-medium">
                  {transponder.yearStart}
                  {transponder.yearEnd ? ` - ${transponder.yearEnd}` : ""}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                  Transponder Type:
                </label>
                <p className="text-lg font-medium">
                  {transponder.transponderType}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                  Frequency:
                </label>
                <p className="text-lg font-medium">
                  {transponder.frequency || "N/A"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                  Chip Type:
                </label>
                {chipType.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {chipType.map((type, index) => (
                      <span
                        key={index}
                        className="inline-block bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">N/A</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                  Compatible Parts:
                </label>
                {compatibleParts.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {compatibleParts.map((part, index) => (
                      <span
                        key={index}
                        className="inline-block bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm"
                      >
                        {part}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">N/A</p>
                )}
              </div>

              {transponder.notes && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    Notes:
                  </label>
                  <p className="text-md">{transponder.notes}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded">
              <p className="text-yellow-700 dark:text-yellow-400">
                No database record found for this FCC ID. Consider adding it to
                your database.
              </p>
            </div>
          )}
        </div>

        {/* Scraped Information */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
            Scraped Information{" "}
            {scrapedData?.source && (
              <span className="ml-2 text-sm text-gray-500">
                ({scrapedData.source})
              </span>
            )}
          </h2>

          {scrapedData ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                  Make:
                </label>
                <p className="text-lg font-medium">{scrapedData.make}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                  Model:
                </label>
                <p className="text-lg font-medium">{scrapedData.model}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                  Year:
                </label>
                <p className="text-lg font-medium">{scrapedData.year}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                  Transponder Type:
                </label>
                <p className="text-lg font-medium">
                  {scrapedData.transponderType || "N/A"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                  Frequency:
                </label>
                <p className="text-lg font-medium">
                  {scrapedData.frequency || "N/A"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                  Chip Type:
                </label>
                {formatArrayField(scrapedData.chipType).length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {formatArrayField(scrapedData.chipType).map(
                      (type: string, index: number) => (
                        <span
                          key={index}
                          className="inline-block bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded text-sm text-blue-700 dark:text-blue-400"
                        >
                          {type}
                        </span>
                      )
                    )}
                  </div>
                ) : (
                  <p className="text-gray-400">N/A</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                  Compatible Parts:
                </label>
                {formatArrayField(scrapedData.compatibleParts).length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {formatArrayField(scrapedData.compatibleParts).map(
                      (part: string, index: number) => (
                        <span
                          key={index}
                          className="inline-block bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded text-sm text-blue-700 dark:text-blue-400"
                        >
                          {part}
                        </span>
                      )
                    )}
                  </div>
                ) : (
                  <p className="text-gray-400">N/A</p>
                )}
              </div>

              {scrapedData.notes && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    Notes:
                  </label>
                  <p className="text-md">{scrapedData.notes}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded">
              <p className="text-yellow-700 dark:text-yellow-400">
                No scraped data found for this FCC ID. Run the FCC ID scrapers
                to gather data from external sources.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-4 mt-8">
        <Link
          href={`/admin/transponders/search?make=${
            transponder?.make || scrapedData?.make || ""
          }&model=${transponder?.model || scrapedData?.model || ""}`}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Find Related Transponders
        </Link>

        {transponder && (
          <Link
            href={`/admin/transponders/edit/${transponder.id}`}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Edit Database Record
          </Link>
        )}

        {!transponder && scrapedData && (
          <Link
            href={`/admin/transponders/new?fccId=${params.id}&make=${
              scrapedData.make
            }&model=${scrapedData.model}&year=${scrapedData.year}&frequency=${
              scrapedData.frequency || ""
            }&transponderType=${scrapedData.transponderType || ""}`}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Create Database Record
          </Link>
        )}
      </div>

      {/* If we have transponder data or scraped data but the transponder doesn't have this FCC ID */}
      {((!transponder && scrapedData) ||
        (transponder && transponder.fccId !== params.id)) && (
        <div className="mt-8">
          <FccIdUpdateButton
            fccId={params.id}
            transponder={transponder}
            scrapedData={scrapedData}
          />
        </div>
      )}
    </div>
  );
}
