import { useState, useRef } from "react";
import { Upload, Sparkles, Check, Download, Copy, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Layout from "@/components/layout/Layout";
import { parseCSV } from "@/lib/exportUtils";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { LineChart as RechartsLine, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { Json } from "@/integrations/supabase/types";

const Analyzer = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [prompt, setPrompt] = useState("");
  const [outputType, setOutputType] = useState("viz");
  const [hasResults, setHasResults] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);
  const [generatedCode, setGeneratedCode] = useState("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const parsed = await parseCSV(file);
      setData(parsed);
      setHasResults(false);
      toast({ title: "File uploaded", description: `Loaded ${parsed.length} rows.` });
    } catch {
      toast({ title: "Error", description: "Failed to parse file.", variant: "destructive" });
    }
  };

  const generateResults = () => {
    if (data.length === 0 && !prompt) {
      toast({ title: "No data", description: "Upload a file or enter a prompt first.", variant: "destructive" });
      return;
    }

    setIsGenerating(true);

    // Generate chart data from uploaded data or sample
    const columns = data.length > 0 ? Object.keys(data[0]) : [];
    const numericCol = columns.find(col => data.some(row => !isNaN(Number(row[col]))));
    
    let chart: any[];
    if (data.length > 0 && numericCol) {
      chart = data.slice(0, 20).map((row, i) => ({
        label: row[columns[0]] || `Row ${i + 1}`,
        value: Number(row[numericCol]) || 0,
      }));
    } else {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
      chart = months.map((month, i) => ({
        label: month,
        value: 20000 + Math.random() * 60000 + i * 8000,
      }));
    }

    const xCol = columns[0] || "Month";
    const yCol = numericCol || "Revenue";

    const code = `import pandas as pd
import plotly.express as px

# Load the dataset
df = pd.read_csv('your_dataset.csv')

# Generate a line plot
fig = px.line(df, x='${xCol}', y='${yCol}')

st.plotly_chart(fig)`;

    setTimeout(() => {
      setChartData(chart);
      setGeneratedCode(code);
      setHasResults(true);
      setIsGenerating(false);
    }, 800);
  };

  const handleSaveDataset = async () => {
    if (!user) {
      toast({ title: "Not logged in", description: "Please sign in to save datasets.", variant: "destructive" });
      return;
    }
    if (data.length === 0) {
      toast({ title: "No data", description: "No dataset to save.", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    try {
      const columns = Object.keys(data[0]).map((name, i) => ({
        id: String(i + 1),
        name,
        type: "other" as const,
      }));

      const { error } = await supabase.from("generated_datasets").insert({
        user_id: user.id,
        name: `Analysis - ${new Date().toLocaleDateString()}`,
        description: prompt || "Uploaded dataset analysis",
        columns: columns as unknown as Json,
        data: data as unknown as Json,
        row_count: data.length,
        template_name: "analyzer",
      });

      if (error) throw error;
      toast({ title: "Saved!", description: "Dataset saved to your account." });
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to save dataset.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const showViz = outputType === "viz" || outputType === "both";
  const showCode = outputType === "code" || outputType === "both";

  return (
    <Layout>
      <div className="bg-background min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Dataset Analyzer & Visualization</h1>
            <p className="text-muted-foreground">Upload your dataset as CSV, PDF, or enter a prompt. Get instant visualizations and code.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Upload Section */}
                <div className="section-card">
                  <h3 className="font-semibold text-foreground mb-4">Upload or Describe Your Dataset</h3>
                  <div
                    className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-10 h-10 mx-auto text-primary mb-3" />
                    <p className="text-foreground font-medium">Drop your CSV or PDF file here</p>
                    <Button className="mt-4 bg-primary hover:bg-primary/90">Browse Files</Button>
                    <p className="text-sm text-muted-foreground mt-2">Supported: .csv or .pdf</p>
                  </div>
                  <input ref={fileInputRef} type="file" accept=".csv,.pdf" className="hidden" onChange={handleFileUpload} />
                  {data.length > 0 && (
                    <p className="text-sm text-muted-foreground mt-3">✅ {data.length} rows loaded</p>
                  )}
                </div>

                {/* Prompt Section */}
                <div className="section-card">
                  <h3 className="font-semibold text-foreground mb-4">AI Instructions (Optional)</h3>
                  <Textarea
                    placeholder="Describe your dataset or analysis request in plain language..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[80px] mb-4"
                  />
                  <p className="text-sm text-muted-foreground">e.g. "Analyze monthly sales data for revenue trends"</p>
                </div>
              </div>

              {/* Output Options + Generate Button */}
              <div className="section-card">
                <h3 className="font-semibold text-foreground mb-4">Select Output Options</h3>
                <div className="flex flex-col md:flex-row md:items-end gap-6">
                  <div className="space-y-3 flex-1">
                    <h4 className="font-medium text-foreground">Generated Visualization</h4>
                    <RadioGroup value={outputType} onValueChange={setOutputType} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="viz" id="viz" />
                        <Label htmlFor="viz">Generate Visualization Only</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="code" id="code" />
                        <Label htmlFor="code">Generate Analysis Code Only</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="both" id="both" />
                        <Label htmlFor="both">Generate Code + Visualization</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Button
                    onClick={generateResults}
                    disabled={isGenerating || (data.length === 0 && !prompt)}
                    className="bg-primary hover:bg-primary/90 gap-2 md:self-end"
                    size="lg"
                  >
                    {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    Generate Results
                  </Button>
                </div>
              </div>

              {/* Results - only shown after pressing Generate */}
              {hasResults && (
                <div className="section-card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">Results</h3>
                    <div className="flex items-center gap-3">
                      <div className="validation-badge-success"><Check className="w-4 h-4" /> Generated</div>
                      {user && data.length > 0 && (
                        <Button
                          onClick={handleSaveDataset}
                          disabled={isSaving}
                          size="sm"
                          className="gap-2"
                        >
                          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                          Save Dataset
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className={`grid grid-cols-1 ${showViz && showCode ? "md:grid-cols-2" : ""} gap-6`}>
                    {showViz && chartData.length > 0 && (
                      <div>
                        <h4 className="font-medium text-foreground mb-4">Visualization</h4>
                        <div className="bg-card border border-border rounded-lg p-4">
                          <ResponsiveContainer width="100%" height={200}>
                            <RechartsLine data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                              <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                              <Tooltip />
                              <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))" }} />
                            </RechartsLine>
                          </ResponsiveContainer>
                          <div className="flex gap-2 mt-4">
                            <Button variant="outline" size="sm" className="gap-2"><Download className="w-4 h-4" />Download Chart</Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {showCode && generatedCode && (
                      <div>
                        <h4 className="font-medium text-foreground mb-4">Generated Code</h4>
                        <div className="bg-[#1e293b] rounded-lg p-4 font-mono text-sm text-[#e2e8f0] overflow-x-auto">
                          <pre>{generatedCode}</pre>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" size="sm" className="gap-2" onClick={() => { navigator.clipboard.writeText(generatedCode); toast({ title: "Copied!" }); }}>
                            <Copy className="w-4 h-4" />Copy Python Code
                          </Button>
                          <Button size="sm" className="bg-success hover:bg-success/90 text-success-foreground gap-2"><Download className="w-4 h-4" />Download Script</Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Tips Sidebar */}
            <div className="section-card h-fit">
              <h3 className="font-semibold text-foreground mb-4">Quick Start Tips</h3>
              <ul className="space-y-3 text-sm">
                {[
                  "Upload CSV or PDF files to analyze your data.",
                  "Optionally add AI instructions for specific analysis.",
                  "Choose output: code, chart, or both.",
                  "Press Generate Results to see output.",
                  "Save datasets to your account when logged in.",
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-muted-foreground">
                    <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Analyzer;
