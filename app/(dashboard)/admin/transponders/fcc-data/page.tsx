import { prisma } from "@/app/lib/prisma";

export const metadata = {
  title: "Transponder FCC ID Data",
  description: "View transponder FCC ID data",
};

async function getTranspondersWithFccIds() {
  try {
    // Get all transponders that have FCC IDs
    const transponders = await prisma.transponderKey.findMany({
      where: {
        fccId: {
          not: null,
        },
      },
      orderBy: {
        make: "asc",
      },
      take: 100, // Limit to 100 records
    });

    return transponders;
  } catch (error) {
    console.error("Error fetching transponders with FCC IDs:", error);
    return [];
  }
}

export default async function TransponderFccDataPage() {
  const transponders = await getTranspondersWithFccIds();

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Transponder FCC ID Data</h1>
      <p className="mb-8 text-gray-600 dark:text-gray-300">
        This page shows transponder keys that have FCC ID data. Total:{" "}
        {transponders.length} records.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full bg-white dark:bg-gray-800 rounded-lg shadow">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Make
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Model
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Year
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                FCC ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            {transponders.length > 0 ? (
              transponders.map((transponder) => (
                <tr
                  key={transponder.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {transponder.make}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {transponder.model}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {transponder.yearStart}
                    {transponder.yearEnd ? ` - ${transponder.yearEnd}` : ""}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {transponder.transponderType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    <a
                      href={`/admin/transponders/fcc-id/${transponder.fccId}`}
                      className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      {transponder.fccId}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    <a
                      href={`/admin/transponders/search?make=${transponder.make}&model=${transponder.model}`}
                      className="text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 mr-4"
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  No transponders with FCC ID data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-8">
        <a
          href="/admin/transponders/manage-fcc"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Update FCC ID Data
        </a>
      </div>
    </div>
  );
}
