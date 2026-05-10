"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import {
  Bell,
  Search,
  ClipboardList,
  Loader2,
  AlertCircle,
  Calendar,
  Hash,
  User,
  Stethoscope,
  FileText,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// ─── Types ────────────────────────────────────────────────────────────────────
type StatutConsultation = "Réalisé" | "Planifié" | "En Attente" | "Annulé"

type Consultation = {
  ref: string | number
  date_consultation: string
  nom_patient: string
  nom_medecin: string
  motif: string
  statut: StatutConsultation
}

// ─── OOP Class ────────────────────────────────────────────────────────────────
class HistoriqueConsultations {
  private consultations: Consultation[] = []
  private apiUrl: string

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl
  }

  async fetchConsultations(): Promise<Consultation[]> {
    const response = await fetch(this.apiUrl, {
      method: "GET",
      headers: { Accept: "application/json" },
    })

    if (!response.ok) {
      throw new Error(`Erreur serveur: ${response.status}`)
    }

    const data = await response.json()
    this.consultations = Array.isArray(data)
      ? data
      : data.consultations || []
    return this.consultations
  }

  getConsultations(): Consultation[] {
    return this.consultations
  }

  filterConsultations(
    query: string,
    statut: string,
    dateDebut: string,
    dateFin: string
  ): Consultation[] {
    const lowerQuery = query.toLowerCase().trim()

    return this.consultations.filter((c) => {
      // Text search
      const matchesQuery =
        !lowerQuery ||
        c.nom_patient.toLowerCase().includes(lowerQuery) ||
        c.nom_medecin.toLowerCase().includes(lowerQuery) ||
        c.motif.toLowerCase().includes(lowerQuery) ||
        String(c.ref).toLowerCase().includes(lowerQuery)

      // Status filter
      const matchesStatut = !statut || statut === "Tous" || c.statut === statut

      // Date range filter
      let matchesDate = true
      if (dateDebut || dateFin) {
        const dateConsult = new Date(c.date_consultation)
        if (dateDebut && dateConsult < new Date(dateDebut)) matchesDate = false
        if (dateFin && dateConsult > new Date(dateFin + "T23:59:59"))
          matchesDate = false
      }

      return matchesQuery && matchesStatut && matchesDate
    })
  }
}

// ─── Status badge config ──────────────────────────────────────────────────────
const STATUT_CONFIG: Record<
  StatutConsultation,
  { label: string; bg: string; border: string; text: string; dot: string }
> = {
  Réalisé: {
    label: "Réalisé",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    dot: "bg-emerald-400",
  },
  Planifié: {
    label: "Planifié",
    bg: "bg-sky-500/10",
    border: "border-sky-500/30",
    text: "text-sky-400",
    dot: "bg-sky-400",
  },
  "En Attente": {
    label: "En Attente",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber-400",
    dot: "bg-amber-400",
  },
  Annulé: {
    label: "Annulé",
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    text: "text-rose-400",
    dot: "bg-rose-400",
  },
}

// ─── Status Badge Component ───────────────────────────────────────────────────
function StatutBadge({ statut }: { statut: string }) {
  const config =
    STATUT_CONFIG[statut as StatutConsultation] ?? STATUT_CONFIG["En Attente"]
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1
        text-xs font-semibold backdrop-blur-sm
        ${config.bg} ${config.border} ${config.text}
      `}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ListeConsultationsPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [filtered, setFiltered] = useState<Consultation[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statutFilter, setStatutFilter] = useState("Tous")
  const [dateDebut, setDateDebut] = useState("")
  const [dateFin, setDateFin] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const manager = useMemo(
    () => new HistoriqueConsultations("api/get_toutes_consultations.php"),
    []
  )

  // Fetch on mount
  useEffect(() => {
    const load = async () => {
      try {
        const data = await manager.fetchConsultations()
        setConsultations(data)
        setFiltered(data)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Une erreur est survenue lors du chargement des consultations."
        )
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [manager])

  // Re-filter whenever any filter changes
  const applyFilters = useCallback(
    (query: string, statut: string, debut: string, fin: string) => {
      setFiltered(manager.filterConsultations(query, statut, debut, fin))
    },
    [manager]
  )

  const handleSearch = (v: string) => {
    setSearchQuery(v)
    applyFilters(v, statutFilter, dateDebut, dateFin)
  }

  const handleStatut = (v: string) => {
    setStatutFilter(v)
    applyFilters(searchQuery, v, dateDebut, dateFin)
  }

  const handleDateDebut = (v: string) => {
    setDateDebut(v)
    applyFilters(searchQuery, statutFilter, v, dateFin)
  }

  const handleDateFin = (v: string) => {
    setDateFin(v)
    applyFilters(searchQuery, statutFilter, dateDebut, v)
  }

  const handleReset = () => {
    setSearchQuery("")
    setStatutFilter("Tous")
    setDateDebut("")
    setDateFin("")
    setFiltered(consultations)
  }

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    } catch {
      return dateString
    }
  }

  const hasActiveFilters =
    searchQuery || statutFilter !== "Tous" || dateDebut || dateFin

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <main className="ml-64 min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-sm">
          <div className="flex h-16 items-center justify-between px-8">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-foreground">
                Liste des Consultations
              </h2>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {consultations.length} consultations
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute right-1 top-1 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">
              Historique des Consultations
            </h1>
            <p className="mt-1 text-muted-foreground">
              Consultez et filtrez toutes les consultations enregistrées dans le
              système
            </p>
          </div>

          {/* Error State */}
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-destructive/50 bg-destructive/10 px-5 py-4 text-destructive">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold">Erreur de chargement</p>
                <p className="mt-0.5 text-sm opacity-90">{error}</p>
              </div>
            </div>
          )}

          {/* ── Filter Toolbar ─────────────────────────────────────────── */}
          <Card className="mb-6 border-border bg-card shadow-md">
            <CardContent className="p-5">
              <div className="flex flex-wrap gap-4">
                {/* Search */}
                <div className="relative min-w-[220px] flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Rechercher patient, médecin…"
                    className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                {/* Status dropdown */}
                <div className="relative min-w-[170px]">
                  <select
                    value={statutFilter}
                    onChange={(e) => handleStatut(e.target.value)}
                    className="h-10 w-full appearance-none rounded-lg border border-input bg-background pl-3 pr-8 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {["Tous", "Réalisé", "Planifié", "En Attente", "Annulé"].map(
                      (s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      )
                    )}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>

                {/* Date range */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input
                      type="date"
                      value={dateDebut}
                      onChange={(e) => handleDateDebut(e.target.value)}
                      className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      title="Date de début"
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">au</span>
                  <div className="relative">
                    <input
                      type="date"
                      value={dateFin}
                      onChange={(e) => handleDateFin(e.target.value)}
                      className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      title="Date de fin"
                    />
                  </div>
                </div>

                {/* Reset */}
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="h-10 shrink-0 text-muted-foreground hover:text-foreground"
                  >
                    Réinitialiser
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* ── Data Table ─────────────────────────────────────────────── */}
          <Card className="border-border bg-card shadow-lg">
            <CardHeader className="border-b border-border pb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <ClipboardList className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-foreground">
                    Toutes les Consultations
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {filtered.length} consultation
                    {filtered.length !== 1 ? "s" : ""} trouvée
                    {filtered.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  <p className="mt-4 text-sm text-muted-foreground">
                    Chargement des consultations…
                  </p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <ClipboardList className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="mt-4 text-sm font-medium text-muted-foreground">
                    {hasActiveFilters
                      ? "Aucune consultation trouvée"
                      : "Aucune consultation enregistrée"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {hasActiveFilters
                      ? "Essayez de modifier vos filtres"
                      : "Les consultations apparaîtront ici une fois ajoutées"}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Hash className="h-3.5 w-3.5" />
                            Réf
                          </div>
                        </th>
                        <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5" />
                            Date
                          </div>
                        </th>
                        <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <User className="h-3.5 w-3.5" />
                            Patient
                          </div>
                        </th>
                        <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Stethoscope className="h-3.5 w-3.5" />
                            Médecin
                          </div>
                        </th>
                        <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <FileText className="h-3.5 w-3.5" />
                            Motif
                          </div>
                        </th>
                        <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Statut
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filtered.map((c, index) => (
                        <tr
                          key={c.ref}
                          className="transition-colors hover:bg-muted/30"
                          style={{
                            animation: `fadeIn 0.3s ease-out ${index * 0.04}s both`,
                          }}
                        >
                          {/* Réf */}
                          <td className="whitespace-nowrap px-6 py-4">
                            <span className="inline-flex items-center justify-center rounded-lg bg-muted px-3 py-1 font-mono text-sm font-medium text-foreground">
                              #{String(c.ref).padStart(4, "0")}
                            </span>
                          </td>

                          {/* Date */}
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                            {formatDate(c.date_consultation)}
                          </td>

                          {/* Patient */}
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                                {c.nom_patient
                                  .split(" ")
                                  .map((w) => w[0])
                                  .slice(0, 2)
                                  .join("")
                                  .toUpperCase()}
                              </div>
                              <span className="text-sm font-medium text-foreground">
                                {c.nom_patient}
                              </span>
                            </div>
                          </td>

                          {/* Médecin */}
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                                {c.nom_medecin
                                  .split(" ")
                                  .map((w) => w[0])
                                  .slice(0, 2)
                                  .join("")
                                  .toUpperCase()}
                              </div>
                              <span className="text-sm text-foreground">
                                Dr. {c.nom_medecin}
                              </span>
                            </div>
                          </td>

                          {/* Motif */}
                          <td className="max-w-[200px] px-6 py-4">
                            <p className="truncate text-sm text-muted-foreground">
                              {c.motif}
                            </p>
                          </td>

                          {/* Statut */}
                          <td className="whitespace-nowrap px-6 py-4">
                            <StatutBadge statut={c.statut} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Footer */}
              {!isLoading && filtered.length > 0 && (
                <div className="flex items-center justify-between border-t border-border px-6 py-4">
                  <p className="text-sm text-muted-foreground">
                    Affichage de{" "}
                    <span className="font-medium text-foreground">
                      {filtered.length}
                    </span>{" "}
                    sur{" "}
                    <span className="font-medium text-foreground">
                      {consultations.length}
                    </span>{" "}
                    consultations
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
