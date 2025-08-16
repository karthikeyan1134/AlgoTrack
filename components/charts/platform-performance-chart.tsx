"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  { platform: "LeetCode", solved: 145, total: 200, accuracy: 72.5 },
  { platform: "Codeforces", solved: 89, total: 120, accuracy: 74.2 },
  { platform: "AtCoder", solved: 34, total: 45, accuracy: 75.6 },
  { platform: "CodeChef", solved: 23, total: 35, accuracy: 65.7 },
]

const chartConfig = {
  solved: {
    label: "Solved",
    color: "hsl(var(--chart-1))",
  },
  accuracy: {
    label: "Accuracy %",
    color: "hsl(var(--chart-2))",
  },
}

export default function PlatformPerformanceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Performance</CardTitle>
        <CardDescription>Your performance across different platforms</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="platform" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar dataKey="solved" fill="var(--color-solved)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="mt-4 space-y-2">
          {data.map((platform) => (
            <div key={platform.platform} className="flex justify-between items-center text-sm">
              <span className="font-medium">{platform.platform}</span>
              <div className="flex space-x-4 text-gray-600">
                <span>
                  {platform.solved}/{platform.total} solved
                </span>
                <span>{platform.accuracy}% accuracy</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
