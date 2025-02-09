export interface BMWTransponderData {
  series: string;
  models: string[];
  years: {
    start: number;
    end?: number;
  };
  transponder: {
    type: string;
    chips: string[];
    system: string;
  };
  oem: {
    keys: string[];
    notes?: string;
  };
  isMotorcycle?: boolean;
}

export const bmwTransponderData: BMWTransponderData[] = [
  {
    series: "1-Series",
    models: ["E81", "E82", "E87", "E88"],
    years: {
      start: 2004,
      end: 2006
    },
    transponder: {
      type: "Philips Crypto 2",
      chips: ["ID46", "PCF7936AS"],
      system: "BMW CAS2"
    },
    oem: {
      keys: ["66126986582", "66129268489", "66129268488"]
    }
  },
  {
    series: "1-Series",
    models: ["E81", "E82", "E87", "E88"],
    years: {
      start: 2007,
      end: 2010
    },
    transponder: {
      type: "Philips Crypto 2",
      chips: ["ID46", "PCF7945", "PCF7936"],
      system: "CAS3, CAS3+"
    },
    oem: {
      keys: ["5WK49145", "5WK49146", "5WK49147", "66126986583", "66129268488"]
    }
  },
  // ... Add more series data
  {
    series: "R1200GS",
    models: ["R1200GS"],
    years: {
      start: 2005,
      end: 2011
    },
    transponder: {
      type: "Philips Crypto 2",
      chips: ["ID46", "PCF7936"],
      system: "Motorcycle System"
    },
    oem: {
      keys: ["Silca T14", "JMA TP12"]
    },
    isMotorcycle: true
  }
];

export function findTransponderByVehicle(make: string, model: string, year: number) {
  return bmwTransponderData.find(data => {
    const matchesModel = data.models.some(m => model.includes(m));
    const matchesYear = year >= data.years.start && 
      (!data.years.end || year <= data.years.end);
    return matchesModel && matchesYear;
  });
}

export function getCompatibleTransponders(model: string, year: number) {
  const data = findTransponderByVehicle("BMW", model, year);
  if (!data) return [];
  return data.transponder.chips;
}

export function getOEMKeys(model: string, year: number) {
  const data = findTransponderByVehicle("BMW", model, year);
  if (!data) return [];
  return data.oem.keys;
} 