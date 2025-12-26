import { faker } from "@faker-js/faker";
import { Column, GeneratedDataset, DatasetStats } from "@/types/dataset";

export const generateDataset = (
  columns: Column[],
  rowCount: number,
  seed?: number
): GeneratedDataset => {
  if (seed !== undefined) {
    faker.seed(seed);
  }

  const data: Record<string, any>[] = [];

  for (let i = 0; i < rowCount; i++) {
    const row: Record<string, any> = {};
    
    for (const column of columns) {
      row[column.name] = generateValue(column);
    }
    
    data.push(row);
  }

  return {
    columns,
    data,
    rowCount,
    seed,
  };
};

const generateValue = (column: Column): any => {
  const { type, options } = column;

  switch (type) {
    case "name":
      return faker.person.fullName();
    
    case "email":
      return faker.internet.email();
    
    case "phone":
      return faker.phone.number();
    
    case "number":
    case "integer":
      const intMin = options?.min ?? 1;
      const intMax = options?.max ?? 100;
      return faker.number.int({ min: intMin, max: intMax });
    
    case "float":
      const floatMin = options?.min ?? 0;
      const floatMax = options?.max ?? 100;
      const decimals = options?.decimals ?? 2;
      return parseFloat(faker.number.float({ min: floatMin, max: floatMax }).toFixed(decimals));
    
    case "date":
      return faker.date.past({ years: 2 }).toISOString().split("T")[0];
    
    case "boolean":
      return faker.datatype.boolean();
    
    case "address":
      return faker.location.streetAddress();
    
    case "city":
      return faker.location.city();
    
    case "country":
      return faker.location.country();
    
    case "company":
      return faker.company.name();
    
    case "department":
      return faker.commerce.department();
    
    case "jobTitle":
      return faker.person.jobTitle();
    
    case "currency":
      const currMin = options?.min ?? 0;
      const currMax = options?.max ?? 10000;
      const prefix = options?.prefix ?? "$";
      const value = faker.number.int({ min: currMin, max: currMax });
      return `${prefix}${value.toLocaleString()}`;
    
    case "uuid":
      return faker.string.uuid().slice(0, 8).toUpperCase();
    
    case "custom":
      if (options?.values && options.values.length > 0) {
        return faker.helpers.arrayElement(options.values);
      }
      return faker.lorem.word();
    
    default:
      return faker.lorem.word();
  }
};

export const calculateStats = (dataset: GeneratedDataset): DatasetStats => {
  const { data, columns } = dataset;
  
  let hasNullValues = false;
  let numericalStats: { min: number; max: number; avg: number } | undefined;
  
  // Find numerical columns
  const numericalColumns = columns.filter(
    (col) => ["number", "integer", "float"].includes(col.type)
  );
  
  if (numericalColumns.length > 0 && data.length > 0) {
    const firstNumCol = numericalColumns[0].name;
    const numericValues = data
      .map((row) => {
        const val = row[firstNumCol];
        if (typeof val === "number") return val;
        const parsed = parseFloat(String(val).replace(/[^0-9.-]/g, ""));
        return isNaN(parsed) ? null : parsed;
      })
      .filter((v): v is number => v !== null);
    
    if (numericValues.length > 0) {
      numericalStats = {
        min: Math.min(...numericValues),
        max: Math.max(...numericValues),
        avg: parseFloat((numericValues.reduce((a, b) => a + b, 0) / numericValues.length).toFixed(1)),
      };
    }
  }
  
  // Check for null values
  for (const row of data) {
    for (const key of Object.keys(row)) {
      if (row[key] === null || row[key] === undefined || row[key] === "") {
        hasNullValues = true;
        break;
      }
    }
    if (hasNullValues) break;
  }
  
  return {
    rowCount: data.length,
    columnCount: columns.length,
    numericalStats,
    hasNullValues,
  };
};
