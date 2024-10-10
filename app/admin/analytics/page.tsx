"use client";

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
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ArrowUpRight } from "lucide-react";

// Mock data
const visitorData = [
  { month: "Jan", visitors: 1000, newUsers: 400 },
  { month: "Feb", visitors: 1200, newUsers: 600 },
  { month: "Mar", visitors: 800, newUsers: 350 },
  { month: "Apr", visitors: 1400, newUsers: 800 },
  { month: "May", visitors: 1600, newUsers: 900 },
  { month: "Jun", visitors: 2000, newUsers: 1200 },
];

const deviceData = [
  { month: "Jan", mobile: 600, desktop: 400 },
  { month: "Feb", mobile: 700, desktop: 500 },
  { month: "Mar", mobile: 400, desktop: 400 },
  { month: "Apr", mobile: 800, desktop: 600 },
  { month: "May", mobile: 1000, desktop: 600 },
  { month: "Jun", mobile: 1200, desktop: 800 },
];

const satisfactionData = [
  { name: "Very Satisfied", value: 400 },
  { name: "Satisfied", value: 300 },
  { name: "Neutral", value: 200 },
  { name: "Unsatisfied", value: 100 },
  { name: "Very Unsatisfied", value: 50 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function AnalyticsPage() {
  const totalVisitors = visitorData.reduce(
    (sum, item) => sum + item.visitors,
    0
  );
  const lastMonthGrowth = (
    ((visitorData[5].visitors - visitorData[4].visitors) /
      visitorData[4].visitors) *
    100
  ).toFixed(1);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Visitors
            </CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalVisitors.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +{lastMonthGrowth}% from last month
            </p>
            <div className="h-[200px]">
              <ChartContainer
                config={{
                  visitors: { label: "Visitors", color: "hsl(var(--chart-1))" },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={visitorData}>
                    <defs>
                      <linearGradient
                        id="colorVisitors"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="var(--color-visitors)"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--color-visitors)"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="visitors"
                      stroke="var(--color-visitors)"
                      fillOpacity={1}
                      fill="url(#colorVisitors)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Device Usage</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Mobile vs Desktop</div>
            <p className="text-xs text-muted-foreground">January - June 2024</p>
            <div className="h-[200px]">
              <ChartContainer
                config={{
                  mobile: { label: "Mobile", color: "hsl(var(--chart-1))" },
                  desktop: { label: "Desktop", color: "hsl(var(--chart-2))" },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={deviceData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar
                      dataKey="mobile"
                      stackId="a"
                      fill="var(--color-mobile)"
                    />
                    <Bar
                      dataKey="desktop"
                      stackId="a"
                      fill="var(--color-desktop)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Customer Satisfaction
            </CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,125</div>
            <p className="text-xs text-muted-foreground">Total responses</p>
            <div className="h-[200px]">
              <ChartContainer
                config={{
                  value: { label: "Responses", color: "hsl(var(--chart-1))" },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={satisfactionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {satisfactionData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
