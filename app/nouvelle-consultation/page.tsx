"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Bell, Search, ClipboardPlus, CheckCircle2, XCircle, AlertCircle, Loader2, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type NotificationState = {
  type: "success" | "error"
  message: string
} | null

type Patient = {
  id: number | string
  nom: string
  prenom: string
}

type Medecin = {
  id: number | string
  nom: string
  prenom: string
  specialite: string
}

export default function NouvelleConsultationPage() {
  const [formData, setFormData] = useState({
    patientId: "",
    medecinId: "",
    dateConsultation: "",
    motif: "",
  })

  const [patients, setPatients] = useState<Patient[]>([])
  const [medecins, setMedecins] = useState<Medecin[]>([])
  const [loadingPatients, setLoadingPatients] = useState(true)
  const [loadingMedecins, setLoadingMedecins] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notification, setNotification] = useState<NotificationState>(null)

  // Fetch patients and medecins on page load
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch("api/get_patients_list.php", {
          method: "GET",
          headers: { Accept: "application/json" },
        })
        if (response.ok) {
          const data = await response.json()
          setPatients(Array.isArray(data) ? data : data.patients || [])
        } else {
          setFetchError("Impossible de charger la liste des patients.")
        }
      } catch {
        setFetchError("Erreur de connexion lors du chargement des patients.")
      } finally {
        setLoadingPatients(false)
      }
    }

    const fetchMedecins = async () => {
      try {
        const response = await fetch("api/get_medecins_list.php", {
          method: "GET",
          headers: { Accept: "application/json" },
        })
        if (response.ok) {
          const data = await response.json()
          setMedecins(Array.isArray(data) ? data : data.medecins || [])
        } else {
          setFetchError("Impossible de charger la liste des médecins.")
        }
      } catch {
        setFetchError("Erreur de connexion lors du chargement des médecins.")
      } finally {
        setLoadingMedecins(false)
      }
    }

    fetchPatients()
    fetchMedecins()
  }, [])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setNotification(null)

    try {
      const response = await fetch("api/ajouter_consultation.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          patient_id: formData.patientId,
          medecin_id: formData.medecinId,
          date_consultation: formData.dateConsultation,
          motif: formData.motif,
        }),
      })

      if (response.ok) {
        setNotification({
          type: "success",
          message: "La consultation a été enregistrée avec succès.",
        })
        setFormData({ patientId: "", medecinId: "", dateConsultation: "", motif: "" })
      } else {
        const errorData = await response.json().catch(() => null)
        setNotification({
          type: "error",
          message:
            errorData?.message ||
            `Une erreur est survenue (code ${response.status}). Veuillez réessayer.`,
        })
      }
    } catch {
      setNotification({
        type: "error",
        message: "Impossible de joindre le serveur. Vérifiez votre connexion et réessayez.",
      })
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setNotification(null), 6000)
    }
  }

  const isFormValid =
    formData.patientId &&
    formData.medecinId &&
    formData.dateConsultation &&
    formData.motif

  const isLoading = loadingPatients || loadingMedecins

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <main className="ml-64 min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-sm">
          <div className="flex h-16 items-center justify-between px-8">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-foreground">Nouvelle Consultation</h2>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                Planifier
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="h-10 w-64 rounded-lg border border-input bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute right-1 top-1 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                </span>
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">
              Planifier une nouvelle consultation
            </h1>
            <p className="mt-1 text-muted-foreground">
              Sélectionnez un patient et un médecin pour créer une consultation
            </p>
          </div>

          {/* Fetch Error */}
          {fetchError && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-destructive/50 bg-destructive/10 px-5 py-4 text-destructive">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold">Erreur de chargement</p>
                <p className="mt-0.5 text-sm opacity-90">{fetchError}</p>
              </div>
            </div>
          )}

          {/* Notification Banner */}
          {notification && (
            <div
              className={`mb-6 flex items-start gap-3 rounded-xl border px-5 py-4 transition-all duration-300 ${
                notification.type === "success"
                  ? "border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400"
                  : "border-destructive/50 bg-destructive/10 text-destructive"
              }`}
            >
              {notification.type === "success" ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
              ) : (
                <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
              )}
              <div className="flex-1">
                <p className="text-sm font-semibold">
                  {notification.type === "success" ? "Succès" : "Erreur"}
                </p>
                <p className="mt-0.5 text-sm opacity-90">{notification.message}</p>
              </div>
              <button
                onClick={() => setNotification(null)}
                className="ml-auto shrink-0 opacity-60 hover:opacity-100"
                aria-label="Fermer la notification"
              >
                <XCircle className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Form Card */}
          <Card className="mx-auto max-w-2xl border-border bg-card shadow-lg">
            <CardHeader className="border-b border-border pb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <ClipboardPlus className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-foreground">
                    Détails de la Consultation
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">Tous les champs sont obligatoires</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>

                {/* Patient Selection */}
                <div className="space-y-2">
                  <label htmlFor="patientId" className="block text-sm font-medium text-foreground">
                    Patient
                  </label>
                  {loadingPatients ? (
                    <div className="flex h-11 items-center gap-2 rounded-lg border border-input bg-background px-4 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Chargement des patients...
                    </div>
                  ) : (
                    <select
                      id="patientId"
                      name="patientId"
                      value={formData.patientId}
                      onChange={handleInputChange}
                      className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      required
                    >
                      <option value="" disabled className="text-muted-foreground">
                        Sélectionnez un patient
                      </option>
                      {patients.map((patient) => (
                        <option key={patient.id} value={patient.id}>
                          {patient.nom} {patient.prenom}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Medecin Selection */}
                <div className="space-y-2">
                  <label htmlFor="medecinId" className="block text-sm font-medium text-foreground">
                    Médecin
                  </label>
                  {loadingMedecins ? (
                    <div className="flex h-11 items-center gap-2 rounded-lg border border-input bg-background px-4 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Chargement des médecins...
                    </div>
                  ) : (
                    <select
                      id="medecinId"
                      name="medecinId"
                      value={formData.medecinId}
                      onChange={handleInputChange}
                      className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      required
                    >
                      <option value="" disabled className="text-muted-foreground">
                        Sélectionnez un médecin
                      </option>
                      {medecins.map((medecin) => (
                        <option key={medecin.id} value={medecin.id}>
                          Dr. {medecin.nom} {medecin.prenom} - {medecin.specialite}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Date de Consultation */}
                <div className="space-y-2">
                  <label htmlFor="dateConsultation" className="block text-sm font-medium text-foreground">
                    Date de Consultation
                  </label>
                  <input
                    type="datetime-local"
                    id="dateConsultation"
                    name="dateConsultation"
                    value={formData.dateConsultation}
                    onChange={handleInputChange}
                    className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>

                {/* Motif */}
                <div className="space-y-2">
                  <label htmlFor="motif" className="block text-sm font-medium text-foreground">
                    Motif de la Consultation
                  </label>
                  <textarea
                    id="motif"
                    name="motif"
                    value={formData.motif}
                    onChange={handleInputChange}
                    placeholder="Décrivez le motif de la consultation..."
                    rows={4}
                    className="w-full resize-none rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>

                {/* Info Note */}
                <div className="flex items-start gap-3 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3">
                  <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div className="text-sm text-foreground">
                    <p className="font-medium">Note importante</p>
                    <p className="mt-1 text-muted-foreground">
                      Le statut final de la consultation (Planifié ou En Attente) sera automatiquement déterminé par les règles de la base de données du système, en fonction de la disponibilité du médecin et des créneaux horaires.
                    </p>
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={!isFormValid || isSubmitting || isLoading}
                    className="h-12 w-full text-base font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Enregistrement en cours...
                      </span>
                    ) : (
                      "Enregistrer la Consultation"
                    )}
                  </Button>
                </div>

              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
