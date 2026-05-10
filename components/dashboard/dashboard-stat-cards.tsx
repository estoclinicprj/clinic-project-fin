"use client"

import { Users, Stethoscope, CalendarCheck, Banknote, TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface KPIs {
  totalPatients: { value: number; change: number; changeLabel: string }
  consultationsToday: { value: number; change: number; changeLabel: string }
  medecinsEnService: { value: number; change: number; changeLabel: string }
  chiffreAffaires: { value: number; change: number; changeLabel: string }
}

interface DashboardStatCardsProps {
  kpis: KPIs
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

const formatNumber = (value: number) => {
  return new Intl.NumberFormat("fr-FR").format(value)
}

export function DashboardStatCards({ kpis }: DashboardStatCardsProps) {
  const stats = [
    {
      title: "Total Patients",
      value: formatNumber(kpis.totalPatients.value),
      change: kpis.totalPatients.change,
      changeLabel: kpis.totalPatients.changeLabel,
      icon: Users,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      title: "Consultations aujourd'hui",
      value: formatNumber(kpis.consultationsToday.value),
      change: kpis.consultationsToday.change,
      changeLabel: kpis.consultationsToday.changeLabel,
      icon: CalendarCheck,
      iconBg: "bg-chart-2/10",
      iconColor: "text-chart-2",
    },
    {
      title: "Médecins en service",
      value: formatNumber(kpis.medecinsEnService.value),
      change: kpis.medecinsEnService.change,
      changeLabel: kpis.medecinsEnService.changeLabel,
      icon: Stethoscope,
      iconBg: "bg-chart-3/10",
      iconColor: "text-chart-3",
    },
    {
      title: "Chiffre d'Affaires",
      value: formatCurrency(kpis.chiffreAffaires.value),
      change: kpis.chiffreAffaires.change,
      changeLabel: kpis.chiffreAffaires.changeLabel,
      icon: Banknote,
      iconBg: "bg-chart-5/10",
      iconColor: "text-chart-5",
    },
  ]

  return (
    <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const isPositive = stat.change >= 0
        const TrendIcon = isPositive ? TrendingUp : TrendingDown

        return (
          <Card
            key={stat.title}
            className="group relative overflow-hidden border-0 bg-card shadow-sm transition-all duration-300 hover:shadow-md"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold tracking-tight text-foreground">
                      {stat.value}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-1">
                    <TrendIcon
                      className={`h-3.5 w-3.5 ${
                        isPositive ? "text-primary" : "text-destructive"
                      }`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        isPositive ? "text-primary" : "text-destructive"
                      }`}
                    >
                      {isPositive ? "+" : ""}
                      {stat.change}%
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {stat.changeLabel}
                    </span>
                  </div>
                </div>
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stat.iconBg} transition-colors group-hover:opacity-90`}
                >
                  <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
              </div>
              {/* Decorative gradient line */}
              <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-primary via-chart-2 to-chart-3 opacity-0 transition-opacity group-hover:opacity-100" />
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
