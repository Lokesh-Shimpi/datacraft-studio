import { ArrowRight, BarChart3, Database, FileSpreadsheet, Sparkles, Upload, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "AI-Powered Generation",
      description: "Describe your dataset in plain language and let AI create structured data instantly.",
    },
    {
      icon: <FileSpreadsheet className="w-6 h-6" />,
      title: "Multiple Templates",
      description: "Choose from employee, student, sales, medical, and more pre-built templates.",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Smart Visualization",
      description: "Upload data and get instant charts, graphs, and analysis code.",
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Custom Rules",
      description: "Define precise column types, ranges, enums, and validation rules.",
    },
    {
      icon: <Upload className="w-6 h-6" />,
      title: "Multiple Export Formats",
      description: "Download your data as CSV, JSON, or PDF with one click.",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Code Generation",
      description: "Get Python and JavaScript code to recreate your visualizations.",
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Choose Your Method",
      description: "Use AI prompts, templates, or manually define your dataset structure.",
    },
    {
      step: "02",
      title: "Configure & Generate",
      description: "Set row count, seed values, and custom rules. Preview before downloading.",
    },
    {
      step: "03",
      title: "Export & Analyze",
      description: "Download in multiple formats or analyze with built-in visualizations.",
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="gradient-hero py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 animate-fade-in">
              Generate & Analyze Datasets{" "}
              <span className="text-primary">Instantly</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up">
              Create realistic synthetic data using AI, templates, or custom rules. 
              Analyze and visualize your datasets with powerful built-in tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <Button
                size="lg"
                className="bg-success hover:bg-success-hover text-success-foreground gap-2 text-lg px-8"
                onClick={() => navigate("/generator")}
              >
                Start Generating
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 text-lg px-8"
                onClick={() => navigate("/analyzer")}
              >
                Analyze Data
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Everything You Need for Data Generation
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A complete toolkit for creating, managing, and analyzing synthetic datasets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="section-card hover:shadow-elevated transition-shadow duration-300 group"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get from idea to dataset in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="text-center relative">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-primary-foreground">
                    {step.step}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Create Your Dataset?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Start generating realistic data in seconds. No credit card required.
          </p>
          <Button
            size="lg"
            className="bg-success hover:bg-success-hover text-success-foreground gap-2 text-lg px-8"
            onClick={() => navigate("/generator")}
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
