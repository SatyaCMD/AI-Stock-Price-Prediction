
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Clock, Target, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface PredictionHistoryProps {
  predictions: any[];
}

export function PredictionHistory({ predictions }: PredictionHistoryProps) {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const toggleExpanded = (id: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  if (predictions.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No predictions yet</p>
          <p className="text-sm">Select stocks to start generating predictions</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {predictions.map((prediction) => {
        const change = prediction.predictedPrice - prediction.currentPrice;
        const changePercent = (change / prediction.currentPrice) * 100;
        const isExpanded = expandedItems.has(prediction.id);

        return (
          <Card key={prediction.id} className="transition-all duration-200 hover:shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{prediction.symbol}</span>
                  <Badge variant="outline" className="text-xs">
                    {prediction.market}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={change >= 0 ? "default" : "destructive"} className="text-xs">
                    {change >= 0 ? "+" : ""}{changePercent.toFixed(1)}%
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpanded(prediction.id)}
                    className="h-6 w-6 p-0"
                  >
                    {isExpanded ? "−" : "+"}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Current</p>
                  <p className="font-medium">
                    {prediction.market === "US" ? "$" : "₹"}{prediction.currentPrice.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Predicted</p>
                  <p className={cn(
                    "font-medium flex items-center gap-1",
                    change >= 0 ? "text-green-600" : "text-red-600"
                  )}>
                    {prediction.market === "US" ? "$" : "₹"}{prediction.predictedPrice.toFixed(2)}
                    {change >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                  </p>
                </div>
              </div>

              {isExpanded && (
                <div className="mt-4 pt-4 border-t space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Confidence</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-muted rounded-full h-1.5">
                          <div 
                            className="bg-primary h-1.5 rounded-full"
                            style={{ width: `${prediction.confidence}%` }}
                          />
                        </div>
                        <span className="text-xs">{prediction.confidence.toFixed(0)}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Timeframe</p>
                      <p className="font-medium">{prediction.timeframe}</p>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(prediction.timestamp, { addSuffix: true })}
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Target className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">AI Insights</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Technical analysis indicates {change >= 0 ? "bullish momentum" : "bearish pressure"} 
                    for {prediction.symbol}. Market volatility and trading volume suggest 
                    {prediction.confidence > 70 ? " high" : prediction.confidence > 50 ? " moderate" : " low"} 
                    confidence in this prediction.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
