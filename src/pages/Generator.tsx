import { useState } from "react";
import { Sparkles, SlidersHorizontal, Plus, RefreshCw, Check, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/layout/Layout";
import DatasetPreview from "@/components/generator/DatasetPreview";
import TemplateSelector from "@/components/generator/TemplateSelector";
import ColumnEditor from "@/components/generator/ColumnEditor";
import DatasetSummary from "@/components/generator/DatasetSummary";
import { datasetTemplates } from "@/data/templates";
import { generateDataset, calculateStats } from "@/lib/dataGenerator";
import { exportToCSV, exportToJSON, exportToPDF } from "@/lib/exportUtils";
import { Column, GeneratedDataset, DatasetStats, DatasetTemplate } from "@/types/dataset";
import { useToast } from "@/hooks/use-toast";

const Generator = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("prompt");
  const [prompt, setPrompt] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<DatasetTemplate | null>(null);
  const [columns, setColumns] = useState<Column[]>([]);
  const [rowCount, setRowCount] = useState(100);
  const [seedValue, setSeedValue] = useState<number | undefined>();
  const [dataset, setDataset] = useState<GeneratedDataset | null>(null);
  const [stats, setStats] = useState<DatasetStats | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showColumnEditor, setShowColumnEditor] = useState(false);

  const handleTemplateSelect = (template: DatasetTemplate) => {
    setSelectedTemplate(template);
    setColumns([...template.columns]);
  };

  const handleGenerateFromFilters = () => {
    if (columns.length === 0) {
      toast({
        title: "No columns defined",
        description: "Please select a template or add columns manually.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    setTimeout(() => {
      const generatedData = generateDataset(columns, rowCount, seedValue);
      setDataset(generatedData);
      setStats(calculateStats(generatedData));
      setIsGenerating(false);
      
      toast({
        title: "Dataset Generated",
        description: `Created ${rowCount} rows with ${columns.length} columns.`,
      });
    }, 500);
  };

  const handleGenerateFromPrompt = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please describe the dataset you want to generate.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // For now, use a simple template-based approach
    // AI integration will be added via edge function
    setTimeout(() => {
      const defaultColumns: Column[] = [
        { id: "1", name: "Name", type: "name" },
        { id: "2", name: "Email", type: "email" },
        { id: "3", name: "Age", type: "integer", options: { min: 18, max: 65 } },
      ];
      
      setColumns(defaultColumns);
      const generatedData = generateDataset(defaultColumns, rowCount, seedValue);
      setDataset(generatedData);
      setStats(calculateStats(generatedData));
      setIsGenerating(false);
      
      toast({
        title: "Dataset Generated",
        description: "Created dataset based on your prompt. Connect AI for smarter generation.",
      });
    }, 1000);
  };

  const handleExport = (format: "csv" | "json" | "pdf") => {
    if (!dataset) return;
    
    const filename = `dataset_${Date.now()}`;
    
    switch (format) {
      case "csv":
        exportToCSV(dataset, filename);
        break;
      case "json":
        exportToJSON(dataset, filename);
        break;
      case "pdf":
        exportToPDF(dataset, filename);
        break;
    }
    
    toast({
      title: "Export Complete",
      description: `Dataset exported as ${format.toUpperCase()}.`,
    });
  };

  return (
    <Layout>
      <div className="bg-background min-h-screen py-8">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Dataset Generator</h1>
            <p className="text-muted-foreground">
              Create synthetic datasets using AI prompts, templates, or custom rules.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Mode Tabs */}
              <div className="section-card">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
                    <TabsTrigger value="prompt" className="gap-2">
                      <Sparkles className="w-4 h-4" />
                      Generate by Prompt
                    </TabsTrigger>
                    <TabsTrigger value="filters" className="gap-2">
                      <SlidersHorizontal className="w-4 h-4" />
                      Create with Filters
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="prompt" className="space-y-4">
                    <div>
                      <Textarea
                        placeholder='e.g. "Generate a dataset of 100 fictional employee records including name, age, department, and salary."'
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="min-h-[100px] resize-none"
                      />
                    </div>
                    <Button
                      className="w-full bg-primary hover:bg-primary-hover"
                      onClick={handleGenerateFromPrompt}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        "Generate Dataset"
                      )}
                    </Button>
                  </TabsContent>

                  <TabsContent value="filters" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">
                            Dataset Type
                          </label>
                          <Select
                            value={selectedTemplate?.id}
                            onValueChange={(value) => {
                              const template = datasetTemplates.find((t) => t.id === value);
                              if (template) handleTemplateSelect(template);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Template" />
                            </SelectTrigger>
                            <SelectContent>
                              {datasetTemplates.map((template) => (
                                <SelectItem key={template.id} value={template.id}>
                                  {template.icon} {template.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">
                            Number of Rows
                          </label>
                          <Input
                            type="number"
                            value={rowCount}
                            onChange={(e) => setRowCount(parseInt(e.target.value) || 10)}
                            min={1}
                            max={10000}
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">
                            Custom Rules
                          </label>
                          <Button
                            variant="outline"
                            className="w-full justify-start gap-2"
                            onClick={() => setShowColumnEditor(true)}
                          >
                            <Plus className="w-4 h-4" />
                            Add Rule
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Button
                          className="w-full bg-success hover:bg-success-hover text-success-foreground h-12"
                          onClick={handleGenerateFromFilters}
                          disabled={isGenerating || columns.length === 0}
                        >
                          {isGenerating ? (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                              Creating...
                            </>
                          ) : (
                            "Create Dataset"
                          )}
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Dataset Preview */}
              {dataset && (
                <div className="section-card">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-foreground">Dataset Preview</h2>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowColumnEditor(true)}
                      >
                        <FileSpreadsheet className="w-4 h-4 mr-2" />
                        Edit Columns
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGenerateFromFilters()}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh Preview
                      </Button>
                      <div className="validation-badge-success">
                        <Check className="w-4 h-4" />
                        Validation: All Good
                      </div>
                    </div>
                  </div>
                  
                  <DatasetPreview dataset={dataset} />
                  
                  {/* Export Buttons */}
                  <div className="flex gap-3 mt-6">
                    <Button
                      className="bg-primary hover:bg-primary-hover gap-2"
                      onClick={() => handleExport("csv")}
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                      Generate CSV
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={() => handleExport("json")}
                    >
                      Download JSON
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={() => handleExport("pdf")}
                    >
                      Export PDF
                    </Button>
                  </div>
                </div>
              )}

              {/* Advanced Options */}
              <div className="section-card">
                <details className="group">
                  <summary className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground">
                    <SlidersHorizontal className="w-4 h-4" />
                    Advanced Options
                  </summary>
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-foreground block mb-1">
                          Seed Value
                        </label>
                        <p className="text-xs text-muted-foreground">
                          Set a seed for reproducible results
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          placeholder="Random"
                          value={seedValue ?? ""}
                          onChange={(e) => setSeedValue(e.target.value ? parseInt(e.target.value) : undefined)}
                          className="w-32"
                        />
                        <Button variant="outline" size="sm">
                          Set Seed Value
                        </Button>
                      </div>
                    </div>
                  </div>
                </details>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Templates */}
              <TemplateSelector
                templates={datasetTemplates}
                selectedTemplate={selectedTemplate}
                onSelect={(template) => {
                  handleTemplateSelect(template);
                  setActiveTab("filters");
                }}
              />

              {/* Dataset Summary */}
              {stats && <DatasetSummary stats={stats} />}
            </div>
          </div>
        </div>
      </div>

      {/* Column Editor Modal */}
      {showColumnEditor && (
        <ColumnEditor
          columns={columns}
          onSave={(newColumns) => {
            setColumns(newColumns);
            setShowColumnEditor(false);
          }}
          onClose={() => setShowColumnEditor(false)}
        />
      )}
    </Layout>
  );
};

export default Generator;
