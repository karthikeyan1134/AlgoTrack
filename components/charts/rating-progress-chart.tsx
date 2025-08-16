"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  { contest: "Round #900", rating: 1200, date: "2024-01" },
  { contest: "Round #905", rating: 1245, date: "2024-02" },
  { contest: "Round #910", rating: 1189, date: "2024-03" },
  { contest: "Round #915", rating: 1267, date: "2024-04" },
  { contest: "Round #920", rating: 1334, date: "2024-05" },
  { contest: "Round #925", rating: 1298, date: "2024-06" },
  { contest: "Round #930", rating: 1456, date: "2024-07" },
  { contest: "Round #935", rating: 1523, date: "2024-08" },
  { contest: "Round #940", rating: 1487, date: "2024-09" },
  { contest: "Round #945", rating: 1612, date: "2024-10" },
  { contest: "Round #950", rating: 1678, date: "2024-11" },
  { contest: "Round #955", rating: 1847, date: "2024-12" },
]

const chartConfig = {
  rating: {
    label: "Rating",
    color: "hsl(var(--chart-1))",
  },
}

export default function RatingProgressChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rating Progress</CardTitle>
        <CardDescription>Your contest rating over time (Codeforces)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Line
                dataKey="rating"
                type="monotone"
                stroke="var(--color-rating)"
                strokeWidth={2}
                dot={{ fill: "var(--color-rating)", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="mt-4 flex justify-between text-sm text-gray-600">
          <span>Peak Rating: 1847</span>
          <span>Current Rank: Expert</span>
          <span>Rating Change: +169</span>
        </div>
      </CardContent>
    </Card>
  )
}
