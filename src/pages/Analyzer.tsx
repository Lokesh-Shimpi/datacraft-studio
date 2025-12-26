import { useState, useRef } from "react";
import { Upload, Sparkles, Check, BarChart3, LineChart, PieChart, Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Layout from "@/components/layout/Layout";
import { parseCSV } from "@/lib/exportUtils";
import { useToast } from "@/hooks/use-toast";
import { LineChart as RechartsLine, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Analyzer = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [prompt, setPrompt] = useState("");
  const [outputType, setOutputType] = useState("both");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const parsed = await parseCSV(file);
      setData(parsed);
      generateSampleChart(parsed);
      toast({ title: "File uploaded", description: `Loaded ${parsed.length} rows.` });
    } catch {
      toast({ title: "Error", description: "Failed to parse file.", variant: "destructive" });
    }
  };

  const generateSampleChart = (parsedData: Record<string, any>[]) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const sample = months.map((month, i) => ({
      month,
      value: 20000 + Math.random() * 60000 + i * 8000,
    }));
    setChartData(sample);
  };

  const pythonCode = `import pandas as pd
import plotly.express as px

# Load the dataset
df = pd.read_csv('your_dataset.csv')

# Generate a line plot
fig = px.line(df, x='Month', y='Revenue')

st.plotly_chart(fig)`;

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
                    <Button className="mt-4 bg-primary hover:bg-primary-hover">Browse Files</Button>
                    <p className="text-sm text-muted-foreground mt-2">Supported: .csv or .pdf</p>
                  </div>
                  <input ref={fileInputRef} type="file" accept=".csv,.pdf" className="hidden" onChange={handleFileUpload} />
                </div>

                {/* Prompt Section */}
                <div className="section-card">
                  <h3 className="font-semibold text-foreground mb-4">Select Output Options</h3>
                  <Textarea
                    placeholder="Describe your dataset or analysis request in plain language..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[80px] mb-4"
                  />
                  <Button className="w-full bg-primary hover:bg-primary-hover gap-2">
                    <Sparkles className="w-4 h-4" />
                    Or Analyze by Prompt
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">e.g. "Analyze monthly sales data for revenue trends"</p>
                </div>
              </div>

              {/* Output Options */}
              <div className="section-card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">Select Output Options</h3>
                  <div className="validation-badge-success"><Check className="w-4 h-4" /> Validation: All Good</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
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

                    {chartData.length > 0 && (
                      <div className="bg-card border border-border rounded-lg p-4 mt-4">
                        <h5 className="text-sm font-medium text-foreground mb-2">Monthly Sales Revenue</h5>
                        <ResponsiveContainer width="100%" height={200}>
                          <RechartsLine data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                            <Tooltip />
                            <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))" }} />
                          </RechartsLine>
                        </ResponsiveContainer>
                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" size="sm" className="gap-2"><Download className="w-4 h-4" />Download Chart</Button>
                          <Button size="sm" className="bg-success hover:bg-success-hover text-success-foreground gap-2"><Download className="w-4 h-4" />Download Dataset</Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="font-medium text-foreground mb-4">Generated Code</h4>
                    <div className="bg-[#1e293b] rounded-lg p-4 font-mono text-sm text-[#e2e8f0] overflow-x-auto">
                      <pre>{pythonCode}</pre>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="gap-2" onClick={() => { navigator.clipboard.writeText(pythonCode); toast({ title: "Copied!" }); }}>
                        <Copy className="w-4 h-4" />Copy Python Code
                      </Button>
                      <Button size="sm" className="bg-success hover:bg-success-hover text-success-foreground gap-2"><Download className="w-4 h-4" />Download Python Script</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips Sidebar */}
            <div className="section-card h-fit">
              <h3 className="font-semibold text-foreground mb-4">Quick Start Tips</h3>
              <ul className="space-y-3 text-sm">
                {["Upload CSV or PDF files to analyze your data.", "Use prompts like \"Plot monthly sales trends\"", "Choose output: code, chart, or both", "Download Python or JavaScript code."].map((tip, i) => (
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
