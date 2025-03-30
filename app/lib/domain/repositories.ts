import {
  Make,
  Model,
  Year,
  Transponder,
  TransponderFilters,
} from "./value-objects";

export interface NhtsaRepository {
  getAllMakes(): Promise<Make[]>;
  getModelsForMake(make: Make): Promise<Model[]>;
  getYearsForModel(model: Model): Promise<Year[]>;
}

export interface TransponderRepository {
  searchTransponders(filters: TransponderFilters): Promise<Transponder[]>;
  getTransponderById(id: string): Promise<Transponder | null>;
  getAllTransponderTypes(): Promise<string[]>;
}
