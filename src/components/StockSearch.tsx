
import { useState, useEffect } from "react";
import { Search, TrendingUp, TrendingDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  market: "US" | "IN";
}

interface StockSearchProps {
  onStockSelect: (stock: Stock) => void;
  market: "US" | "IN";
}

// Mock data for demonstration
const mockStocks: Stock[] = [
  // US Stocks
  { symbol: "AAPL", name: "Apple Inc.", price: 178.25, change: 2.15, changePercent: 1.22, market: "US" },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 142.80, change: -1.45, changePercent: -1.01, market: "US" },
  { symbol: "MSFT", name: "Microsoft Corporation", price: 378.85, change: 3.22, changePercent: 0.86, market: "US" },
  { symbol: "TSLA", name: "Tesla, Inc.", price: 248.50, change: -5.30, changePercent: -2.09, market: "US" },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 153.75, change: 1.85, changePercent: 1.22, market: "US" },
  { symbol: "NVDA", name: "NVIDIA Corporation", price: 875.30, change: 12.45, changePercent: 1.44, market: "US" },
  
  // Indian Stocks
  { symbol: "RELIANCE", name: "Reliance Industries Ltd.", price: 2458.75, change: 15.20, changePercent: 0.62, market: "IN" },
  { symbol: "TCS", name: "Tata Consultancy Services", price: 3542.80, change: -25.15, changePercent: -0.70, market: "IN" },
  { symbol: "INFY", name: "Infosys Limited", price: 1456.25, change: 8.45, changePercent: 0.58, market: "IN" },
  { symbol: "HDFCBANK", name: "HDFC Bank Limited", price: 1654.90, change: -12.30, changePercent: -0.74, market: "IN" },
  { symbol: "ICICIBANK", name: "ICICI Bank Limited", price: 945.80, change: 7.65, changePercent: 0.82, market: "IN" },
  { symbol: "BHARTIARTL", name: "Bharti Airtel Limited", price: 1185.45, change: 3.25, changePercent: 0.27, market: "IN" },
];

export function StockSearch({ onStockSelect, market }: StockSearchProps) {
  const [query, setQuery] = useState("");
  const [filteredStocks, setFilteredStocks] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (query.length > 0) {
      setIsLoading(true);
      // Simulate API delay
      const timer = setTimeout(() => {
        const filtered = mockStocks
          .filter(stock => stock.market === market)
          .filter(stock => 
            stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
            stock.name.toLowerCase().includes(query.toLowerCase())
          )
          .slice(0, 5);
        setFilteredStocks(filtered);
        setIsLoading(false);
      }, 300);
      
      return () => clearTimeout(timer);
    } else {
      setFilteredStocks([]);
      setIsLoading(false);
    }
  }, [query, market]);

  const handleStockClick = (stock: Stock) => {
    onStockSelect(stock);
    setQuery("");
    setFilteredStocks([]);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={`Search ${market} stocks...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {(filteredStocks.length > 0 || isLoading) && (
        <Card className="absolute top-full left-0 right-0 z-10 mt-1 max-h-80 overflow-y-auto">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 text-center text-muted-foreground">
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span className="ml-2">Searching...</span>
              </div>
            ) : (
              filteredStocks.map((stock) => (
                <div
                  key={stock.symbol}
                  className="p-4 border-b last:border-b-0 hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => handleStockClick(stock)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{stock.symbol}</span>
                        <Badge variant="outline" className="text-xs">
                          {stock.market}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {stock.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {stock.market === "US" ? "$" : "₹"}{stock.price.toFixed(2)}
                      </div>
                      <div className={cn(
                        "flex items-center gap-1 text-sm",
                        stock.change >= 0 ? "text-green-600" : "text-red-600"
                      )}>
                        {stock.change >= 0 ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {stock.change >= 0 ? "+" : ""}{stock.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
