"use client"

import { CheckCircle2, Timer, AlertCircle, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type ConsultationStatus = "terminée" | "en-cours" | "en-attente"

interface Consultation {
  id: string
  patient: string
  heure: string
  status: ConsultationStatus
}

interface RecentConsultationsProps {
  consultations: Consultation[]
}

const statusConfig: Record<
  ConsultationStatus,
  { label: string; icon: typeof CheckCircle2; className: string }
> = {
  terminée: {
    label: "Terminée",
    icon: CheckCircle2,
    className: "bg-primary/10 text-primary",
  },
  "en-cours": {
    label: "En cours",
    icon: AlertCircle,
    className: "bg-chart-5/10 text-chart-5",
  },
  "en-attente": {
    label: "En attente",
    icon: Timer,
    className: "bg-muted text-muted-foreground",
  },
}

function StatusBadge({ status }: { status: ConsultationStatus }) {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        config.className
      )}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  )
}

export function RecentConsultations({ consultations }: RecentConsultationsProps) {
  return (
    <Card className="border-0 bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-foreground">
          Dernières Consultations
        </CardTitle>
        <CardDescription className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          Les 5 dernières consultations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {consultations.map((consultation) => (
            <div
              key={consultation.id}
              className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
            >
              {/* Patient avatar */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <span className="text-sm font-semibold text-primary">
                  {consultation.patient
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>

              {/* Patient info */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {consultation.patient}
                </p>
                <p className="text-xs text-muted-foreground">
                  {consultation.heure} &middot; {consultation.id}
                </p>
              </div>

              {/* Status badge */}
              <StatusBadge status={consultation.status} />
            </div>
          ))}
        </div>

        {/* View all link */}
        <div className="mt-4 border-t border-border pt-4">
          <a
            href="/consultations-du-jour"
            className="text-sm font-medium text-primary hover:underline"
          >
            Voir toutes les consultations &rarr;
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
