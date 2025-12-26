import { GeneratedDataset } from "@/types/dataset";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DatasetPreviewProps {
  dataset: GeneratedDataset;
  maxRows?: number;
}

const DatasetPreview = ({ dataset, maxRows = 10 }: DatasetPreviewProps) => {
  const displayData = dataset.data.slice(0, maxRows);
  const headers = dataset.columns.map((col) => col.name);

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {headers.map((header, index) => (
                <TableHead key={index} className="font-semibold text-foreground">
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayData.map((row, rowIndex) => (
              <TableRow key={rowIndex} className="hover:bg-muted/30">
                {headers.map((header, cellIndex) => (
                  <TableCell key={cellIndex} className="text-foreground">
                    {String(row[header] ?? "")}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {dataset.data.length > maxRows && (
        <div className="px-4 py-3 bg-muted/30 text-center text-sm text-muted-foreground border-t border-border">
          Showing {maxRows} of {dataset.data.length} rows
        </div>
      )}
    </div>
  );
};

export default DatasetPreview;
