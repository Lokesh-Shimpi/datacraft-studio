import { FileSpreadsheet, Users, ShoppingCart, Stethoscope, ClipboardList } from "lucide-react";
import { DatasetTemplate } from "@/types/dataset";

interface TemplateSelectorProps {
  templates: DatasetTemplate[];
  selectedTemplate: DatasetTemplate | null;
  onSelect: (template: DatasetTemplate) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  "👔": <Users className="w-4 h-4" />,
  "🎓": <FileSpreadsheet className="w-4 h-4" />,
  "🛒": <ShoppingCart className="w-4 h-4" />,
  "🏥": <Stethoscope className="w-4 h-4" />,
  "📊": <FileSpreadsheet className="w-4 h-4" />,
  "📋": <ClipboardList className="w-4 h-4" />,
};

const TemplateSelector = ({ templates, selectedTemplate, onSelect }: TemplateSelectorProps) => {
  return (
    <div className="section-card">
      <h3 className="text-lg font-semibold text-foreground mb-4">Quick Templates</h3>
      <div className="space-y-2">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelect(template)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-all text-left ${
              selectedTemplate?.id === template.id
                ? "border-primary bg-primary/5 text-primary"
                : "border-border hover:border-primary/50 hover:bg-muted/50 text-foreground"
            }`}
          >
            <div className={`w-8 h-8 rounded-md flex items-center justify-center ${
              selectedTemplate?.id === template.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}>
              {iconMap[template.icon] || <FileSpreadsheet className="w-4 h-4" />}
            </div>
            <span className="font-medium">{template.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;
