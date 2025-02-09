export const AFTERMARKET_CROSS_REF: {
  [key: string]: {
    oem: string;
    aftermarket: string[];
  }[];
} = {
  "Toyota": [
    {
      oem: "89785-52010",
      aftermarket: ["TPX1", "TPX2"]
    },
    // Add more Toyota cross references as needed
  ],
  "Honda": [
    {
      oem: "72147-S5A-A01",
      aftermarket: ["TPH1", "TPH2"]
    },
    // Add more Honda cross references as needed
  ],
  // Add more manufacturers as needed
}; 