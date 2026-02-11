import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Column, ColumnType } from "@/types/dataset";

interface ColumnEditorProps {
  columns: Column[];
  onSave: (columns: Column[]) => void;
  onClose: () => void;
}

const columnTypes: { value: ColumnType; label: string }[] = [
  { value: "name", label: "Full Name" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "integer", label: "Integer" },
  { value: "float", label: "Decimal" },
  { value: "date", label: "Date" },
  { value: "boolean", label: "Boolean" },
  { value: "address", label: "Address" },
  { value: "city", label: "City" },
  { value: "country", label: "Country" },
  { value: "company", label: "Company" },
  { value: "department", label: "Department" },
  { value: "jobTitle", label: "Job Title" },
  { value: "currency", label: "Currency" },
  { value: "uuid", label: "UUID" },
  { value: "custom", label: "Custom List" },
  { value: "other", label: "Other" },
];

const ColumnEditor = ({ columns, onSave, onClose }: ColumnEditorProps) => {
  const [editedColumns, setEditedColumns] = useState<Column[]>(columns);

  const addColumn = () => {
    const newColumn: Column = {
      id: Date.now().toString(),
      name: `Column ${editedColumns.length + 1}`,
      type: "name",
    };
    setEditedColumns([...editedColumns, newColumn]);
  };

  const updateColumn = (id: string, updates: Partial<Column>) => {
    setEditedColumns(
      editedColumns.map((col) =>
        col.id === id ? { ...col, ...updates } : col
      )
    );
  };

  const removeColumn = (id: string) => {
    setEditedColumns(editedColumns.filter((col) => col.id !== id));
  };

  return (
    <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-elevated max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Edit Columns</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[50vh]">
          <div className="space-y-4">
            {editedColumns.map((column, index) => (
              <div
                key={column.id}
                className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg"
              >
                <span className="text-sm text-muted-foreground w-6">
                  {index + 1}.
                </span>
                <Input
                  value={column.name}
                  onChange={(e) => updateColumn(column.id, { name: e.target.value })}
                  placeholder="Column name"
                  className="flex-1"
                />
                <Select
                  value={column.type}
                  onValueChange={(value: ColumnType) =>
                    updateColumn(column.id, { type: value })
                  }
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {columnTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeColumn(column.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            className="w-full mt-4 gap-2"
            onClick={addColumn}
          >
            <Plus className="w-4 h-4" />
            Add Column
          </Button>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-success hover:bg-success-hover text-success-foreground"
            onClick={() => onSave(editedColumns)}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ColumnEditor;
