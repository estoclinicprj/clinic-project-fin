"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import {
  Bell,
  Search,
  Users,
  Loader2,
  AlertCircle,
  User,
  CreditCard,
  Calendar,
  Hash,
  ShieldCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// ---------------------------------------------------------------------------
// Types — aligned with PHP/Oracle backend response keys
// ---------------------------------------------------------------------------
type Patient = {
  id: number | string       // ID_PATIENT
  nom: string               // NOM
  prenom: string            // PRENOM
  cin: string               // CIN
  date: string              // DATE_NAISSANCE — format YYYY-MM-DD
  mutuelle: string          // MUTUELLE
}

// ---------------------------------------------------------------------------
// OOP PatientManager
// ---------------------------------------------------------------------------
class PatientManager {
  private patients: Patient[] = []
  private apiUrl: string

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl
  }

  async fetchPatients(): Promise<Patient[]> {
    const response = await fetch(this.apiUrl, {
      method: "GET",
      headers: { Accept: "application/json" },
    })

    if (!response.ok) {
      throw new Error(`Erreur serveur: ${response.status}`)
    }

    const data = await response.json()
    this.patients = Array.isArray(data) ? data : data.patients ?? []
    return this.patients
  }

  getPatients(): Patient[] {
    return this.patients
  }

  searchPatients(query: string): Patient[] {
    if (!query.trim()) return this.patients

    const q = query.toLowerCase().trim()

    return this.patients.filter((p) => {
      const fullName    = `${p.prenom} ${p.nom}`.toLowerCase()
      const reverseName = `${p.nom} ${p.prenom}`.toLowerCase()
      const id          = String(p.id).toLowerCase()
      const cin         = p.cin.toLowerCase()
      const mutuelle    = p.mutuelle.toLowerCase()
      const date        = p.date.toLowerCase()

      return (
        fullName.includes(q)    ||
        reverseName.includes(q) ||
        id.includes(q)          ||
        cin.includes(q)         ||
        mutuelle.includes(q)    ||
        date.includes(q)
      )
    })
  }

  getPatientCount(): number {
    return this.patients.length
  }
}

// ---------------------------------------------------------------------------
// Utility — parse YYYY-MM-DD string safely (avoids UTC shift of new Date())
// ---------------------------------------------------------------------------
function formatDate(dateString: string): string {
  if (!dateString) return "—"
  // Split manually to avoid timezone-induced off-by-one day errors
  const parts = dateString.split("-")
  if (parts.length !== 3) return dateString
  const [year, month, day] = parts.map(Number)
  const d = new Date(year, month - 1, day) // local time
  return d.toLocaleDateString("fr-FR", {
    day:   "2-digit",
    month: "long",
    year:  "numeric",
  })
}

// ---------------------------------------------------------------------------
// Mutuelle Badge
// ---------------------------------------------------------------------------
function MutuelleBadge({ value }: { value: string }) {
  const isEmpty = !value || value.trim() === "" || value.toLowerCase() === "aucune"

  if (isEmpty) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/50 px-2.5 py-1 text-xs font-medium text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5" />
        Aucune
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
      <ShieldCheck className="h-3.5 w-3.5" />
      {value}
    </span>
  )
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------
export default function ListePatientsPage() {
  const [patients,         setPatients]         = useState<Patient[]>([])
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([])
  const [searchQuery,      setSearchQuery]      = useState("")
  const [isLoading,        setIsLoading]        = useState(true)
  const [error,            setError]            = useState<string | null>(null)

  const patientManager = useMemo(
    () => new PatientManager("api/get_patients.php"),
    []
  )

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const data = await patientManager.fetchPatients()
        setPatients(data)
        setFilteredPatients(data)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Une erreur est survenue lors du chargement des patients."
        )
      } finally {
        setIsLoading(false)
      }
    }
    loadPatients()
  }, [patientManager])

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query)
      setFilteredPatients(patientManager.searchPatients(query))
    },
    [patientManager]
  )

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <main className="ml-64 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-sm">
          <div className="flex h-16 items-center justify-between px-8">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-foreground">Liste des Patients</h2>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {patients.length} patients
              </span>
            </div>
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
        </header>

        {/* Content */}
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">Gestion des Patients</h1>
            <p className="mt-1 text-muted-foreground">
              Consultez et recherchez les patients enregistrés dans le système
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-destructive/50 bg-destructive/10 px-5 py-4 text-destructive">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="text-sm font-semibold">Erreur de chargement</p>
                <p className="mt-0.5 text-sm opacity-90">{error}</p>
              </div>
            </div>
          )}

          {/* Table Card */}
          <Card className="border-border bg-card shadow-lg">
            <CardHeader className="border-b border-border pb-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-foreground">
                      Tous les Patients
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {filteredPatients.length} patient{filteredPatients.length !== 1 ? "s" : ""} trouvé{filteredPatients.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                {/* Live Search */}
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Rechercher (nom, CIN, mutuelle…)"
                    className="h-11 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  <p className="mt-4 text-sm text-muted-foreground">Chargement des patients...</p>
                </div>
              ) : filteredPatients.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="mt-4 text-sm font-medium text-muted-foreground">
                    {searchQuery ? "Aucun patient trouvé" : "Aucun patient enregistré"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {searchQuery
                      ? "Essayez de modifier votre recherche"
                      : "Les patients apparaîtront ici une fois ajoutés"}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        {/* ID */}
                        <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Hash className="h-4 w-4" />
                            ID
                          </div>
                        </th>
                        {/* Nom Complet */}
                        <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Nom Complet
                          </div>
                        </th>
                        {/* CIN */}
                        <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            CIN
                          </div>
                        </th>
                        {/* Date de Naissance */}
                        <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Date de Naissance
                          </div>
                        </th>
                        {/* Mutuelle */}
                        <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4" />
                            Mutuelle
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredPatients.map((patient, index) => (
                        <tr
                          key={patient.id}
                          className="transition-colors hover:bg-muted/30"
                          style={{ animation: `fadeIn 0.3s ease-out ${index * 0.05}s both` }}
                        >
                          {/* ID */}
                          <td className="whitespace-nowrap px-6 py-4">
                            <span className="inline-flex items-center justify-center rounded-lg bg-muted px-3 py-1 font-mono text-sm font-medium text-foreground">
                              #{String(patient.id).padStart(4, "0")}
                            </span>
                          </td>

                          {/* Nom Complet */}
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                                {patient.prenom.charAt(0).toUpperCase()}
                                {patient.nom.charAt(0).toUpperCase()}
                              </div>
                              <p className="font-medium text-foreground">
                                {patient.prenom} {patient.nom}
                              </p>
                            </div>
                          </td>

                          {/* CIN */}
                          <td className="whitespace-nowrap px-6 py-4">
                            <span className="font-mono text-sm font-medium text-foreground">
                              {patient.cin || "—"}
                            </span>
                          </td>

                          {/* Date de Naissance */}
                          <td className="whitespace-nowrap px-6 py-4">
                            <span className="text-sm text-muted-foreground">
                              {formatDate(patient.date)}
                            </span>
                          </td>

                          {/* Mutuelle */}
                          <td className="whitespace-nowrap px-6 py-4">
                            <MutuelleBadge value={patient.mutuelle} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Footer */}
              {!isLoading && filteredPatients.length > 0 && (
                <div className="flex items-center justify-between border-t border-border px-6 py-4">
                  <p className="text-sm text-muted-foreground">
                    Affichage de{" "}
                    <span className="font-medium text-foreground">{filteredPatients.length}</span>{" "}
                    sur{" "}
                    <span className="font-medium text-foreground">{patients.length}</span>{" "}
                    patients
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
