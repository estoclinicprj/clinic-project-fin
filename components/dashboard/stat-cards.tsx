"use client"

import { Users, Stethoscope, CalendarCheck, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const stats = [
  {
    title: "Total Patients",
    value: "2,847",
    change: "+12.5%",
    changeType: "positive" as const,
    icon: Users,
    description: "depuis le mois dernier",
  },
  {
    title: "Médecins Actifs",
    value: "48",
    change: "+3",
    changeType: "positive" as const,
    icon: Stethoscope,
    description: "nouveaux ce mois",
  },
  {
    title: "Consultations Aujourd'hui",
    value: "156",
    change: "+8.2%",
    changeType: "positive" as const,
    icon: CalendarCheck,
    description: "par rapport à hier",
  },
  {
    title: "Taux de Satisfaction",
    value: "98.5%",
    change: "+2.1%",
    changeType: "positive" as const,
    icon: TrendingUp,
    description: "évaluation moyenne",
  },
]

export function StatCards() {
  return (
    <div className="flex flex-wrap gap-4">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className="group relative flex-1 min-w-fit overflow-hidden border-0 bg-card shadow-sm transition-all duration-300 hover:shadow-md"
        >
          <CardContent className="flex h-auto w-auto flex-col p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-2">
                <p className="whitespace-nowrap text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold tracking-tight text-foreground">
                    {stat.value}
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      stat.changeType === "positive"
                        ? "text-accent"
                        : "text-destructive"
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </div>
              <div className="flex shrink-0 items-center justify-center rounded-xl bg-primary/10 p-3 transition-colors group-hover:bg-primary/15">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
            </div>
            {/* Decorative gradient line */}
            <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-primary via-accent to-primary/50 opacity-0 transition-opacity group-hover:opacity-100" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
