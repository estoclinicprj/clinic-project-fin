"use client"

import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface ConsultationsChartProps {
  data: { jour: string; consultations: number }[]
}

const chartConfig = {
  consultations: {
    label: "Consultations",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function ConsultationsChart({ data }: ConsultationsChartProps) {
  return (
    <Card className="border-0 bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-foreground">
          Évolution des Consultations
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Nombre de consultations sur les 7 derniers jours
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              className="stroke-border"
            />
            <XAxis
              dataKey="jour"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              className="text-xs fill-muted-foreground"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              className="text-xs fill-muted-foreground"
            />
            <ChartTooltip
              cursor={{ fill: "var(--muted)", opacity: 0.3 }}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="consultations"
              fill="var(--color-consultations)"
              radius={[6, 6, 0, 0]}
              className="transition-all duration-200"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
