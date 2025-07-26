
import { useState } from "react";
import { ThemeProvider } from "next-themes";
import { StockSearch } from "@/components/StockSearch";
import { PredictionChart } from "@/components/PredictionChart";
import { PredictionHistory } from "@/components/PredictionHistory";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Globe, BarChart3 } from "lucide-react";

const Index = () => {
  const [selectedStock, setSelectedStock] = useState<any>(null);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [market, setMarket] = useState<"US" | "IN">("US");

  const handleStockSelect = (stock: any) => {
    setSelectedStock(stock);
    // In a real app, this would trigger the AI prediction
    const mockPrediction = {
      id: Date.now(),
      symbol: stock.symbol,
      currentPrice: stock.price,
      predictedPrice: stock.price * (1 + (Math.random() - 0.5) * 0.2),
      confidence: Math.random() * 40 + 60,
      timestamp: new Date(),
      market: market,
      timeframe: "1 week"
    };
    setPredictions(prev => [mockPrediction, ...prev.slice(0, 9)]);
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  AI Stock Predictor
                </h1>
                <p className="text-muted-foreground">
                  Advanced AI-powered stock price predictions
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>

          {/* Market Selection */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Select Market
              </CardTitle>
              <CardDescription>
                Choose between US and Indian stock markets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={market} onValueChange={(value) => setMarket(value as "US" | "IN")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="US">🇺🇸 US Market</TabsTrigger>
                  <TabsTrigger value="IN">🇮🇳 Indian Market</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>

          {/* Stock Search */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Search Stocks</CardTitle>
              <CardDescription>
                Search and select a stock to get AI-powered price predictions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StockSearch onStockSelect={handleStockSelect} market={market} />
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Prediction Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Price Prediction
                </CardTitle>
                <CardDescription>
                  AI-generated price predictions and analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PredictionChart selectedStock={selectedStock} predictions={predictions} />
              </CardContent>
            </Card>

            {/* Prediction History */}
            <Card>
              <CardHeader>
                <CardTitle>Prediction History</CardTitle>
                <CardDescription>
                  Recent predictions and their performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PredictionHistory predictions={predictions} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Index;
