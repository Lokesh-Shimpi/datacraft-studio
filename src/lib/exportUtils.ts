import Papa from "papaparse";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { GeneratedDataset } from "@/types/dataset";

export const exportToCSV = (dataset: GeneratedDataset, filename: string = "dataset") => {
  const csv = Papa.unparse(dataset.data);
  downloadFile(csv, `${filename}.csv`, "text/csv");
};

export const exportToJSON = (dataset: GeneratedDataset, filename: string = "dataset") => {
  const json = JSON.stringify(dataset.data, null, 2);
  downloadFile(json, `${filename}.json`, "application/json");
};

export const exportToPDF = (dataset: GeneratedDataset, filename: string = "dataset") => {
  const doc = new jsPDF();
  
  doc.setFontSize(16);
  doc.text("Dataset Export", 14, 20);
  
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);
  doc.text(`Rows: ${dataset.rowCount} | Columns: ${dataset.columns.length}`, 14, 36);
  
  const headers = dataset.columns.map((col) => col.name);
  const rows = dataset.data.map((row) => 
    headers.map((header) => String(row[header] ?? ""))
  );
  
  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 45,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [37, 99, 235] },
  });
  
  doc.save(`${filename}.pdf`);
};

const downloadFile = (content: string, filename: string, type: string) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const parseCSV = (file: File): Promise<Record<string, any>[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        resolve(results.data as Record<string, any>[]);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};
