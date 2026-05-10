"use client"

import { Clock, MoreHorizontal, CheckCircle2, AlertCircle, Timer } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

type ConsultationStatus = "terminée" | "en-cours" | "en-attente"

interface Consultation {
  id: string
  patient: string
  medecin: string
  specialite: string
  heure: string
  status: ConsultationStatus
  salle: string
}

const consultations: Consultation[] = [
  {
    id: "C001",
    patient: "Marie Dupont",
    medecin: "Dr. Jean Martin",
    specialite: "Cardiologie",
    heure: "08:30",
    status: "terminée",
    salle: "A101",
  },
  {
    id: "C002",
    patient: "Pierre Leroy",
    medecin: "Dr. Sophie Bernard",
    specialite: "Dermatologie",
    heure: "09:15",
    status: "terminée",
    salle: "B204",
  },
  {
    id: "C003",
    patient: "Isabelle Moreau",
    medecin: "Dr. Philippe Dubois",
    specialite: "Neurologie",
    heure: "10:00",
    status: "en-cours",
    salle: "C302",
  },
  {
    id: "C004",
    patient: "François Lambert",
    medecin: "Dr. Marie Claire",
    specialite: "Orthopédie",
    heure: "10:45",
    status: "en-attente",
    salle: "A105",
  },
  {
    id: "C005",
    patient: "Camille Petit",
    medecin: "Dr. Jean Martin",
    specialite: "Cardiologie",
    heure: "11:30",
    status: "en-attente",
    salle: "A101",
  },
  {
    id: "C006",
    patient: "Thomas Blanc",
    medecin: "Dr. Anne Richard",
    specialite: "Pédiatrie",
    heure: "14:00",
    status: "en-attente",
    salle: "D108",
  },
  {
    id: "C007",
    patient: "Julie Fournier",
    medecin: "Dr. Marc Lefevre",
    specialite: "Ophtalmologie",
    heure: "14:45",
    status: "en-attente",
    salle: "B210",
  },
  {
    id: "C008",
    patient: "Nicolas Girard",
    medecin: "Dr. Sophie Bernard",
    specialite: "Dermatologie",
    heure: "15:30",
    status: "en-attente",
    salle: "B204",
  },
]

const statusConfig: Record<ConsultationStatus, { label: string; icon: typeof CheckCircle2; className: string }> = {
  terminée: {
    label: "Terminée",
    icon: CheckCircle2,
    className: "bg-accent/10 text-accent",
  },
  "en-cours": {
    label: "En cours",
    icon: AlertCircle,
    className: "bg-chart-4/10 text-chart-4",
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
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        config.className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  )
}

export function ConsultationsTable() {
  return (
    <Card className="h-auto w-auto min-w-fit border-0 bg-card shadow-sm">
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4 pb-4">
        <div className="flex flex-col gap-1">
          <CardTitle className="whitespace-nowrap text-xl font-semibold text-foreground">
            Consultations du Jour
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Aperçu des consultations programmées pour aujourd&apos;hui
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <div className="flex w-fit items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5">
            <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="whitespace-nowrap text-sm font-medium text-foreground">
              {new Date().toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="w-auto">
        <div className="w-fit min-w-full overflow-x-auto rounded-lg border border-border">
          <table className="w-auto min-w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Patient
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Médecin
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Spécialité
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Heure
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Salle
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Statut
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {consultations.map((consultation, index) => (
                <tr
                  key={consultation.id}
                  className={cn(
                    "transition-colors hover:bg-muted/30",
                    index % 2 === 0 ? "bg-card" : "bg-muted/20"
                  )}
                >
                  <td className="whitespace-nowrap px-4 py-3.5">
                    <span className="font-mono text-sm font-medium text-primary">
                      {consultation.id}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                        <span className="text-xs font-semibold text-primary">
                          {consultation.patient
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {consultation.patient}
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5">
                    <span className="text-sm text-foreground">{consultation.medecin}</span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5">
                    <span className="rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                      {consultation.specialite}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5">
                    <span className="text-sm font-medium text-foreground">
                      {consultation.heure}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5">
                    <span className="font-mono text-sm text-muted-foreground">
                      {consultation.salle}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5">
                    <StatusBadge status={consultation.status} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-muted"
                        >
                          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                          <span className="sr-only">Ouvrir le menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem>Voir détails</DropdownMenuItem>
                        <DropdownMenuItem>Modifier</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Annuler
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Table footer */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <p className="whitespace-nowrap text-sm text-muted-foreground">
            Affichage de <span className="font-medium text-foreground">8</span> consultations sur{" "}
            <span className="font-medium text-foreground">156</span>
          </p>
          <div className="flex shrink-0 items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Précédent
            </Button>
            <Button variant="outline" size="sm">
              Suivant
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
