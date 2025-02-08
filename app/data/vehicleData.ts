export const years = Array.from({ length: 2024 - 1987 + 1 }, (_, i) => (2024 - i).toString());

export const makes = [
  "Acura", "Alfa Romeo", "Aston Martin", "Audi", "Bentley", "BMW", "Buick", 
  "Cadillac", "Chevrolet", "Chrysler", "Dodge", "Ferrari", "Fiat", "Ford", 
  "Genesis", "GMC", "Honda", "Hyundai", "Infiniti", "Jaguar", "Jeep", "Kia", 
  "Lamborghini", "Land Rover", "Lexus", "Lincoln", "Maserati", "Mazda", 
  "Mercedes-Benz", "MINI", "Mitsubishi", "Nissan", "Porsche", "Ram", 
  "Rolls-Royce", "Subaru", "Tesla", "Toyota", "Volkswagen", "Volvo"
].sort();

export const modelsByMake: { [key: string]: { [year: string]: string[] } } = {
  "Nissan": {
    "2024": ["Altima", "Ariya", "Armada", "Frontier", "GT-R", "Kicks", "Leaf", "Maxima", "Murano", "Pathfinder", "Rogue", "Sentra", "Titan", "Versa", "Z"],
    "2023": ["Altima", "Ariya", "Armada", "Frontier", "GT-R", "Kicks", "Leaf", "Maxima", "Murano", "Pathfinder", "Rogue", "Sentra", "Titan", "Versa", "Z"],
    "2022": ["Altima", "Armada", "Frontier", "GT-R", "Kicks", "Leaf", "Maxima", "Murano", "Pathfinder", "Rogue", "Sentra", "Titan", "Versa"],
    // Add more years...
  },
  "Toyota": {
    "2024": ["4Runner", "bZ4X", "Camry", "Corolla", "Corolla Cross", "Crown", "GR86", "GR Corolla", "GR Supra", "Highlander", "Mirai", "Prius", "RAV4", "Sequoia", "Sienna", "Tacoma", "Tundra", "Venza"],
    "2023": ["4Runner", "bZ4X", "Camry", "Corolla", "Corolla Cross", "Crown", "GR86", "GR Corolla", "GR Supra", "Highlander", "Mirai", "Prius", "RAV4", "Sequoia", "Sienna", "Tacoma", "Tundra", "Venza"],
    // Add more years...
  },
  "Honda": {
    "2024": [
      "Accord", "Accord Hybrid", "Civic", "Civic Hatchback", "Civic Si", 
      "Civic Type R", "CR-V", "CR-V Hybrid", "HR-V", "Odyssey", "Passport", 
      "Pilot", "Ridgeline"
    ],
    "2023": [
      "Accord", "Accord Hybrid", "Civic", "Civic Hatchback", "Civic Si", 
      "Civic Type R", "CR-V", "CR-V Hybrid", "HR-V", "Odyssey", "Passport", 
      "Pilot", "Ridgeline"
    ],
    "2022": [
      "Accord", "Accord Hybrid", "Civic", "Civic Hatchback", "Civic Si",
      "CR-V", "CR-V Hybrid", "HR-V", "Insight", "Odyssey", "Passport",
      "Pilot", "Ridgeline"
    ],
    "2021": [
      "Accord", "Accord Hybrid", "Civic", "Civic Hatchback", "Civic Si",
      "Civic Type R", "CR-V", "CR-V Hybrid", "HR-V", "Insight", "Odyssey",
      "Passport", "Pilot", "Ridgeline"
    ],
    // ... continue for more years
  },
  // Add more makes and their models by year...
};

// Helper function to get models for a specific make and year
export const getModelsForMakeAndYear = (make: string, year: string): string[] => {
  if (!make || !year) return [];
  return modelsByMake[make]?.[year] || [];
}; 