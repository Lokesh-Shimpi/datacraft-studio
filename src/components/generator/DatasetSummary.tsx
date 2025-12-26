import { Grid, Layers, TrendingUp, CheckCircle } from "lucide-react";
import { DatasetStats } from "@/types/dataset";

interface DatasetSummaryProps {
  stats: DatasetStats;
}

const DatasetSummary = ({ stats }: DatasetSummaryProps) => {
  return (
    <div className="section-card">
      <h3 className="text-lg font-semibold text-foreground mb-4">Dataset Summary Report</h3>
      
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center">
            <Grid className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Rows Generated</p>
            <p className="font-semibold text-foreground">{stats.rowCount}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center">
            <Layers className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Columns</p>
            <p className="font-semibold text-foreground">{stats.columnCount}</p>
          </div>
        </div>

        {stats.numericalStats && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Numerical Fields</p>
              <p className="text-sm text-foreground">
                Min: <span className="font-semibold">{stats.numericalStats.min}</span>, 
                Max: <span className="font-semibold">{stats.numericalStats.max}</span>, 
                Avg: <span className="font-semibold">{stats.numericalStats.avg}</span>
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-md flex items-center justify-center ${
            stats.hasNullValues ? "bg-destructive/10" : "bg-success/10"
          }`}>
            <CheckCircle className={`w-4 h-4 ${
              stats.hasNullValues ? "text-destructive" : "text-success"
            }`} />
          </div>
          <div>
            <p className="font-medium text-foreground">
              {stats.hasNullValues ? "Contains Null Values" : "No Missing Values"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatasetSummary;
