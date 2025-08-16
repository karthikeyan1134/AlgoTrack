"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const categories = [
  { name: "Array", solved: 45, total: 60, percentage: 75 },
  { name: "String", solved: 32, total: 45, percentage: 71 },
  { name: "Dynamic Programming", solved: 18, total: 35, percentage: 51 },
  { name: "Tree", solved: 28, total: 40, percentage: 70 },
  { name: "Graph", solved: 15, total: 30, percentage: 50 },
  { name: "Math", solved: 22, total: 25, percentage: 88 },
  { name: "Greedy", solved: 19, total: 28, percentage: 68 },
  { name: "Binary Search", solved: 14, total: 20, percentage: 70 },
  { name: "Two Pointers", solved: 16, total: 18, percentage: 89 },
  { name: "Sliding Window", solved: 12, total: 15, percentage: 80 },
]

const getIntensityColor = (percentage: number) => {
  if (percentage >= 80) return "bg-green-500"
  if (percentage >= 60) return "bg-green-400"
  if (percentage >= 40) return "bg-yellow-400"
  if (percentage >= 20) return "bg-orange-400"
  return "bg-red-400"
}

export default function CategoryHeatmap() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Problem Categories</CardTitle>
        <CardDescription>Your progress across different problem categories</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {categories.map((category) => (
            <div
              key={category.name}
              className="p-3 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-900 truncate">{category.name}</h4>
                <div className={`w-3 h-3 rounded-full ${getIntensityColor(category.percentage)}`} />
              </div>
              <div className="text-xs text-gray-600 mb-1">
                {category.solved}/{category.total} solved
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getIntensityColor(category.percentage)}`}
                  style={{ width: `${category.percentage}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">{category.percentage}%</div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-center space-x-4 text-xs text-gray-600">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-400 rounded-full" />
            <span>0-20%</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-orange-400 rounded-full" />
            <span>20-40%</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-yellow-400 rounded-full" />
            <span>40-60%</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-400 rounded-full" />
            <span>60-80%</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span>80-100%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
