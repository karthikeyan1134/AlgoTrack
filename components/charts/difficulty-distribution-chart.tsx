"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"

const data = [
  { name: "Easy", value: 145, color: "#22c55e" },
  { name: "Medium", value: 89, color: "#f59e0b" },
  { name: "Hard", value: 23, color: "#ef4444" },
]

const chartConfig = {
  easy: {
    label: "Easy",
    color: "#22c55e",
  },
  medium: {
    label: "Medium",
    color: "#f59e0b",
  },
  hard: {
    label: "Hard",
    color: "#ef4444",
  },
}

export default function DifficultyDistributionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Problem Difficulty</CardTitle>
        <CardDescription>Distribution of solved problems by difficulty</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="flex justify-center space-x-6 mt-4">
          {data.map((item) => (
            <div key={item.name} className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm text-gray-600">
                {item.name}: {item.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
