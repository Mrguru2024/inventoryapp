export default function FccDocumentation() {
  return (
    <div className="mt-12 border-t pt-8">
      <h2 className="text-2xl font-bold mb-4">FCC ID Scraping Documentation</h2>

      <div className="prose dark:prose-invert max-w-none">
        <h3>How FCC ID Scraping Works</h3>
        <p>
          The FCC ID scraping system automatically collects FCC identification
          data for transponder keys from various online sources and updates our
          database records with this information.
        </p>

        <h4>What are FCC IDs?</h4>
        <p>
          The Federal Communications Commission (FCC) assigns unique identifiers
          to wireless devices, including transponder keys and remote key fobs.
          These IDs are required for any device that emits radio frequency
          signals in the United States.
        </p>
        <p>
          For automotive transponder keys, the FCC ID provides valuable
          information about the key's frequency, compatibility, and technical
          specifications.
        </p>

        <h4>Data Sources</h4>
        <p>The system collects data from two primary sources:</p>
        <ul>
          <li>
            <strong>Transpondery.com</strong> - A specialized database
            containing technical information about transponder keys and their
            compatibility.
          </li>
          <li>
            <strong>UHS Hardware</strong> - An automotive key retailer with
            detailed product information including FCC IDs and compatibility
            data.
          </li>
        </ul>

        <h4>Scraping Process</h4>
        <ol>
          <li>
            The scraper first collects data from Transpondery.com using Cheerio
            (a server-side HTML parser).
          </li>
          <li>
            Next, it collects data from UHS Hardware using Puppeteer (a headless
            browser).
          </li>
          <li>
            The collected data is saved to JSON files in the data/ directory.
          </li>
          <li>
            The database updater component then:
            <ul>
              <li>Loads the scraped JSON data</li>
              <li>Queries all transponder records from the database</li>
              <li>
                Matches scraped data with database records based on make, model,
                and year
              </li>
              <li>Updates the database records with the matched FCC IDs</li>
            </ul>
          </li>
        </ol>

        <h4>Data Matching Logic</h4>
        <p>
          The system uses a fuzzy matching algorithm to match make and model
          information between the scraped data and our database records. This is
          necessary because different websites may format the make/model
          information slightly differently.
        </p>
        <p>
          For example, "TOYOTA CAMRY" in our database might match with "Toyota
          Camry" or "TOYOTA-CAMRY" in the scraped data.
        </p>

        <h4>Prioritization</h4>
        <p>
          When multiple matches are found for the same transponder key, data
          from Transpondery.com is prioritized over UHS Hardware data, as it
          tends to be more accurate and comprehensive.
        </p>

        <h4>Running the Scrapers</h4>
        <p>The scraping process can be triggered in several ways:</p>
        <ul>
          <li>Using the "Run FCC ID Scrapers" button on this page</li>
          <li>
            Running <code>npm run scrape:all</code> followed by{" "}
            <code>npm run update:fccids</code> from the command line
          </li>
          <li>
            Running individual scrapers with{" "}
            <code>npm run scrape:transpondery</code> or{" "}
            <code>npm run scrape:uhs</code>
          </li>
        </ul>

        <h4>Viewing Updated Data</h4>
        <p>
          After the scraping and updating process completes, you can view the
          updated transponder data with FCC IDs on the{" "}
          <a
            href="/admin/transponders/fcc-data"
            className="text-blue-500 hover:text-blue-600"
          >
            View FCC Data
          </a>{" "}
          page.
        </p>
      </div>
    </div>
  );
}
