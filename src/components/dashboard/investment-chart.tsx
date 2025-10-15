"use client";

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { month: 'M0', value: 1000 },
  { month: 'M1', value: 1055 },
  { month: 'M2', value: 1113 },
  { month: 'M3', value: 1174 },
  { month: 'M4', value: 1238 },
  { month: 'M5', value: 1306 },
  { month: 'M6', value: 1378 },
  { month: 'M7', value: 1454 },
  { month: 'M8', value: 1534 },
  { month: 'M9', value: 1618 },
  { month: 'M10', value: 1707 },
  { month: 'M11', value: 1801 },
  { month: 'M12', value: 1900 },
];


const chartConfig = {
  value: {
    label: "Valor",
    color: "hsl(var(--chart-1))",
  },
};

export function InvestmentChart() {
    const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">Evolução do Investimento</CardTitle>
        <CardDescription>Projeção de valor da carteira</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <ResponsiveContainer>
             <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                    </linearGradient>
                </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickFormatter={(value) => formatCurrency(value)}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={80}
              />
              <Tooltip
                cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1, strokeDasharray: '3 3' }}
                content={<ChartTooltipContent 
                    formatter={(value) => formatCurrency(Number(value))}
                    indicator="dot" 
                />}
              />
               <Area type="monotone" dataKey="value" stroke="hsl(var(--chart-1))" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
