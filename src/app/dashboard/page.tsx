
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { UnclaimedProfileBanner } from '@/components/unclaimed-profile-banner';
import {
  AlertTriangle,
  BarChartBig,
  Landmark,
  Target,
  TrendingDown,
  TrendingUp,
  Bot,
} from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const chartData = [
  { month: 'Jan', liability: 2800, score: 78 },
  { month: 'Feb', liability: 2650, score: 82 },
  { month: 'Mar', liability: 2450, score: 85 },
  { month: 'Apr', liability: 2300, score: 84 },
  { month: 'May', liability: 2350, score: 86 },
  { month: 'Jun', liability: 2450, score: 87 },
];

const pieChartData = [
  { name: 'Compliant', value: 87, color: 'hsl(var(--chart-2))' },
  { name: 'At Risk', value: 8, color: 'hsl(var(--chart-3))' },
  { name: 'Non-Compliant', value: 5, color: 'hsl(var(--chart-5))' },
];

const complianceItems = [
    { label: "VAT Compliance", score: 95, level: "high" },
    { label: "PAYE Accuracy", score: 92, level: "high" },
    { label: "Filing Timeliness", score: 78, level: "medium" },
    { label: "Documentation", score: 65, level: "low" },
];

const getComplianceScoreColor = (level: string) => {
    switch (level) {
        case "high": return "bg-green-500";
        case "medium": return "bg-yellow-500";
        case "low": return "bg-red-500";
        default: return "bg-gray-500";
    }
}


export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-muted/30 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-headline font-bold text-foreground">
            Advanced Analytics Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Personal Tax Insights & Compliance Intelligence for Nigeria
          </p>
        </header>

        <UnclaimedProfileBanner />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Tax Liability
              </CardTitle>
              <Landmark className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦2,450,000</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingDown className="h-3 w-3 text-destructive" />
                12% vs last year
              </p>
            </CardContent>
          </Card>
           <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
              <BarChartBig className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                +5% improvement
              </p>
            </CardContent>
          </Card>
           <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Risk Level</CardTitle>
              <AlertTriangle className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">Medium</div>
              <p className="text-xs text-muted-foreground">Improved from High</p>
            </CardContent>
          </Card>
           <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Performance Ranking</CardTitle>
              <Target className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Top 25%</div>
              <p className="text-xs text-muted-foreground">
                Industry benchmark
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Tax Trends & Insights</CardTitle>
              <CardDescription>Last 6 months performance.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[300px] w-full">
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorLiability" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                         <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" stroke="hsl(var(--primary))" />
                    <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--chart-2))" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Area type="monotone" dataKey="liability" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorLiability)" yAxisId="left" name="Tax Liability (k)" />
                    <Area type="monotone" dataKey="score" stroke="hsl(var(--chart-2))" fillOpacity={1} fill="url(#colorScore)" yAxisId="right" name="Compliance Score" />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Risk Assessment</CardTitle>
              <CardDescription>Current compliance breakdown.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {complianceItems.map((item, index) => (
                        <div key={index}>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-medium">{item.label}</span>
                                <span className={`text-sm font-bold ${getComplianceScoreColor(item.level).replace('bg-','text-')}`}>{item.score}%</span>
                            </div>
                            <Progress value={item.score} className="h-2" />
                        </div>
                    ))}
                </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-primary/90 text-primary-foreground border-none">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Bot /> AI-Powered Insights</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-primary-foreground/90">
                    Your tax efficiency has improved by 15% this quarter. Consider increasing your pension contributions to optimize your tax position further. The system predicts potential savings of ₦180,000 annually.
                </p>
                 <Button variant="secondary" className="mt-4">Explore Suggestions</Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
