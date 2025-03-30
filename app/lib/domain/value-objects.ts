export class Make {
  constructor(public readonly id: number, public readonly name: string) {}

  static fromNhtsa(data: { Make_ID: number; Make_Name: string }): Make {
    return new Make(data.Make_ID, data.Make_Name);
  }

  equals(other: Make): boolean {
    return this.id === other.id;
  }
}

export class Model {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly makeId: number
  ) {}

  static fromNhtsa(data: {
    Model_ID: number;
    Model_Name: string;
    Make_ID: number;
  }): Model {
    return new Model(data.Model_ID, data.Model_Name, data.Make_ID);
  }

  equals(other: Model): boolean {
    return this.id === other.id;
  }
}

export class Year {
  constructor(public readonly value: number) {}

  static fromNhtsa(data: { Year: number }): Year {
    return new Year(data.Year);
  }

  equals(other: Year): boolean {
    return this.value === other.value;
  }
}

export class TransponderType {
  constructor(public readonly code: string, public readonly name: string) {}

  static fromString(value: string): TransponderType {
    return new TransponderType(value, value);
  }

  equals(other: TransponderType): boolean {
    return this.code === other.code;
  }
}

export class TransponderId {
  constructor(public readonly value: string) {}

  equals(other: TransponderId): boolean {
    return this.value === other.value;
  }
}

export class Transponder {
  constructor(
    public readonly id: TransponderId,
    public readonly make: Make,
    public readonly model: Model,
    public readonly yearStart: Year | null,
    public readonly yearEnd: Year | null,
    public readonly transponderType: TransponderType,
    public readonly chipTypes: string[],
    public readonly compatibleParts: string[],
    public readonly frequency: string | null,
    public readonly notes: string | null,
    public readonly dualSystem: boolean
  ) {}

  matchesFilters(filters: TransponderFilters): boolean {
    if (filters.make && !this.make.equals(filters.make)) return false;
    if (filters.model && !this.model.equals(filters.model)) return false;
    if (filters.year) {
      const year = Year.fromNhtsa({ Year: parseInt(filters.year) });
      if (!this.yearStart || year.value < this.yearStart.value) return false;
      if (this.yearEnd && year.value > this.yearEnd.value) return false;
    }
    if (
      filters.transponderType &&
      !this.transponderType.equals(filters.transponderType)
    )
      return false;
    return true;
  }
}

export interface TransponderFilters {
  make?: Make;
  model?: Model;
  year?: string;
  transponderType?: TransponderType;
  searchTerm?: string;
}
