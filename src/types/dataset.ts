export interface Column {
  id: string;
  name: string;
  type: ColumnType;
  options?: ColumnOptions;
}

export type ColumnType = 
  | "name"
  | "email"
  | "phone"
  | "number"
  | "integer"
  | "float"
  | "date"
  | "boolean"
  | "address"
  | "city"
  | "country"
  | "company"
  | "department"
  | "jobTitle"
  | "currency"
  | "uuid"
  | "custom";

export interface ColumnOptions {
  min?: number;
  max?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  values?: string[];
  format?: string;
}

export interface DatasetTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  columns: Column[];
}

export interface GeneratedDataset {
  columns: Column[];
  data: Record<string, any>[];
  rowCount: number;
  seed?: number;
}

export interface DatasetStats {
  rowCount: number;
  columnCount: number;
  numericalStats?: {
    min: number;
    max: number;
    avg: number;
  };
  hasNullValues: boolean;
}
