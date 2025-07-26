
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Brain, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface PredictionChartProps {
  selectedStock: any;
  predictions: any[];
}

export function PredictionChart({ selectedStock, predictions }: PredictionChartProps) {
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [predictedData, setPredictedData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedStock) {
      setIsLoading(true);
      // Simulate AI prediction loading
      setTimeout(() => {
        const currentPrice = selectedStock.price;
        const historical = [];
        const predicted = [];
        
        // Historical data (last 7 days)
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const variation = (Math.random() - 0.5) * 0.1;
          historical.push({
            date: date.toLocaleDateString(),
            price: currentPrice * (1 + variation),
          });
        }
        
        // Predicted data (next 7 days)
        const trend = Math.random() > 0.5 ? 1 : -1;
        for (let i = 1; i <= 7; i++) {
          const date = new Date();
          date.setDate(date.getDate() + i);
          const baseVariation = trend * 0.02 * i;
          const randomVariation = (Math.random() - 0.5) * 0.05;
          predicted.push({
            date: date.toLocaleDateString(),
            price: currentPrice * (1 + baseVariation + randomVariation),
          });
        }
        
        setHistoricalData(historical);
        setPredictedData(predicted);
        setIsLoading(false);
      }, 1500);
    }
  }, [selectedStock]);

  const latestPrediction = predictions.find(p => p.symbol === selectedStock?.symbol);

  if (!selectedStock) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Select a stock to see AI predictions</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">AI is analyzing {selectedStock.symbol}...</p>
        </div>
      </div>
    );
  }

  const currentPrice = selectedStock.price;
  const predictedPrice = latestPrediction?.predictedPrice || currentPrice;
  const change = predictedPrice - currentPrice;
  const changePercent = (change / currentPrice) * 100;

  // Combine data for chart display
  const combinedData = [...historicalData, ...predictedData];

  return (
    <div className="space-y-4">
      {/* Stock Info */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{selectedStock.symbol}</h3>
          <p className="text-sm text-muted-foreground">{selectedStock.name}</p>
        </div>
        <Badge variant="outline">
          {selectedStock.market === "US" ? "🇺🇸 NYSE/NASDAQ" : "🇮🇳 NSE/BSE"}
        </Badge>
      </div>

      {/* Prediction Summary */}
      {latestPrediction && (
        <Card className="p-4 bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Current Price</p>
              <p className="text-xl font-bold">
                {selectedStock.market === "US" ? "$" : "₹"}{currentPrice.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Predicted Price</p>
              <p className="text-xl font-bold flex items-center gap-2">
                {selectedStock.market === "US" ? "$" : "₹"}{predictedPrice.toFixed(2)}
                {change >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Expected Change</p>
              <p className={cn(
                "font-semibold",
                change >= 0 ? "text-green-600" : "text-red-600"
              )}>
                {change >= 0 ? "+" : ""}{change.toFixed(2)} ({changePercent.toFixed(2)}%)
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Confidence</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${latestPrediction.confidence}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{latestPrediction.confidence.toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={combinedData}>
            <defs>
              <linearGradient id="colorHistorical" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              fontSize={12}
              tick={{ fontSize: 10 }}
            />
            <YAxis 
              domain={['dataMin - 5', 'dataMax + 5']}
              fontSize={12}
              tick={{ fontSize: 10 }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }}
              formatter={(value: any) => [
                `${selectedStock.market === "US" ? "$" : "₹"}${value.toFixed(2)}`,
                'Price'
              ]}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#8884d8"
              fill="url(#colorHistorical)"
              strokeWidth={2}
              data={historicalData}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#82ca9d"
              fill="url(#colorPredicted)"
              strokeWidth={2}
              strokeDasharray="5,5"
              data={predictedData}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* AI Insights */}
      <Card className="p-4 border-l-4 border-l-primary">
        <div className="flex items-start gap-3">
          <Brain className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <h4 className="font-medium mb-2">AI Analysis</h4>
            <p className="text-sm text-muted-foreground">
              Based on technical indicators, market sentiment, and historical patterns, 
              our AI model predicts a {change >= 0 ? "bullish" : "bearish"} trend for {selectedStock.symbol}. 
              The prediction confidence is {latestPrediction?.confidence.toFixed(0)}% based on current market conditions.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
