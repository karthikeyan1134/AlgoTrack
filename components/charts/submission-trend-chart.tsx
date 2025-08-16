"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  { date: "2024-01", submissions: 12, accepted: 8 },
  { date: "2024-02", submissions: 18, accepted: 14 },
  { date: "2024-03", submissions: 25, accepted: 19 },
  { date: "2024-04", submissions: 32, accepted: 28 },
  { date: "2024-05", submissions: 28, accepted: 22 },
  { date: "2024-06", submissions: 35, accepted: 31 },
  { date: "2024-07", submissions: 42, accepted: 38 },
  { date: "2024-08", submissions: 38, accepted: 33 },
  { date: "2024-09", submissions: 45, accepted: 41 },
  { date: "2024-10", submissions: 52, accepted: 47 },
  { date: "2024-11", submissions: 48, accepted: 43 },
  { date: "2024-12", submissions: 55, accepted: 51 },
]

const chartConfig = {
  submissions: {
    label: "Total Submissions",
    color: "hsl(var(--chart-1))",
  },
  accepted: {
    label: "Accepted",
    color: "hsl(var(--chart-2))",
  },
}

export default function SubmissionTrendChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Submission Trends</CardTitle>
        <CardDescription>Your coding activity over the past year</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Area
                dataKey="submissions"
                type="monotone"
                fill="var(--color-submissions)"
                fillOpacity={0.4}
                stroke="var(--color-submissions)"
                stackId="a"
              />
              <Area
                dataKey="accepted"
                type="monotone"
                fill="var(--color-accepted)"
                fillOpacity={0.4}
                stroke="var(--color-accepted)"
                stackId="b"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
