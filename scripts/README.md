# Transponder Data Utilities

This directory contains scripts for scraping and updating transponder data in the inventory app.

## Structure

- `scrapers/` - Contains web scraping utilities
  - `scrapeTranspondery.js` - Scrapes FCC ID data from Transpondery.com
  - `scrapeUHS.js` - Scrapes FCC ID data from UHS Hardware
- `updateFccIds.js` - Updates the database with scraped FCC ID data

## Usage

### Prerequisites

Make sure all dependencies are installed:

```bash
npm install
```

The scripts require the following packages:

- `axios` - For making HTTP requests
- `cheerio` - For parsing HTML
- `puppeteer` - For browser automation (UHS Hardware)
- `@prisma/client` - For database access

### Running the Scrapers

Run all scrapers:

```bash
npm run scrape:all
```

Or run them individually:

```bash
# Scrape Transpondery.com
npm run scrape:transpondery

# Scrape UHS Hardware
npm run scrape:uhs
```

### Updating FCC IDs

After running the scrapers, update the database with the new FCC ID data:

```bash
npm run update:fccids
```

## Data Output

The scraped data is saved to the following files:

- `data/transpondery-fccid.json` - Data from Transpondery.com
- `data/uhs-fccid.json` - Data from UHS Hardware

## Notes

- The UHS Hardware scraper uses Puppeteer in headless mode and may take longer to complete
- The update script tries to match transponder records by make and model
- If multiple matches are found, Transpondery data is preferred over UHS Hardware data
