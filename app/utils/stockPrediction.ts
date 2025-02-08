interface StockPrediction {
  predictedDemand: number;
  recommendedOrder: number;
  confidence: 'high' | 'medium' | 'low';
  reason: string;
}

export function predictStockNeeds(
  item: TransponderInventoryItem,
  usageHistory: { date: Date; quantity: number }[],
  compatibleVehicles: TransponderKeyData[]
): StockPrediction {
  // Calculate average monthly usage
  const monthlyUsage = calculateMonthlyUsage(usageHistory);
  
  // Factor in vehicle popularity
  const vehiclePopularityFactor = calculateVehiclePopularityFactor(compatibleVehicles);
  
  // Calculate predicted demand
  const predictedDemand = Math.ceil(monthlyUsage * vehiclePopularityFactor);
  
  // Calculate recommended order quantity
  const recommendedOrder = calculateRecommendedOrder(
    predictedDemand,
    item.quantity,
    item.minimumStock
  );
  
  return {
    predictedDemand,
    recommendedOrder,
    confidence: determineConfidence(usageHistory.length, vehiclePopularityFactor),
    reason: generatePredictionReason(predictedDemand, vehiclePopularityFactor)
  };
}

function calculateMonthlyUsage(history: { date: Date; quantity: number }[]): number {
  // Implementation details...
}

function calculateVehiclePopularityFactor(vehicles: TransponderKeyData[]): number {
  // Implementation details...
}

function calculateRecommendedOrder(
  predictedDemand: number,
  currentStock: number,
  minimumStock: number
): number {
  // Implementation details...
}

function determineConfidence(usageCount: number, popularityFactor: number): 'high' | 'medium' | 'low' {
  // Implementation details...
}

function generatePredictionReason(predictedDemand: number, popularityFactor: number): string {
  // Implementation details...
} 