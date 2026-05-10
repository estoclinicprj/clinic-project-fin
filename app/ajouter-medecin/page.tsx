"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Bell, Search, Stethoscope, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type NotificationState = {
  type: "success" | "error"
  message: string
} | null

type FieldErrors = {
  email?: string
  telephone?: string
}

const SPECIALITES = [
  "Cardiologie",
  "Pédiatrie",
  "Médecine Générale",
  "Neurologie",
  "Dermatologie",
  "Gynécologie",
  "Orthopédie",
  "Ophtalmologie",
  "Psychiatrie",
  "Radiologie",
  "Rhumatologie",
  "Urologie",
  "Endocrinologie",
  "Pneumologie",
  "Gastro-entérologie",
]

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEX = /^[+\d\s\-().]{6,20}$/

export default function AjouterMedecinPage() {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    email: "",
    specialite: "",
  })
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notification, setNotification] = useState<NotificationState>(null)

  const validateField = (name: string, value: string): string | undefined => {
    if (name === "email") {
      if (!value) return "L'adresse email est obligatoire."
      if (!EMAIL_REGEX.test(value)) return "Format d'email invalide (ex: nom@domaine.fr)."
    }
    if (name === "telephone") {
      if (!value) return "Le numéro de téléphone est obligatoire."
      if (!PHONE_REGEX.test(value))
        return "Numéro invalide. Utilisez uniquement des chiffres, +, espace ou tiret."
    }
    return undefined
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (name === "email" || name === "telephone") {
      const error = validateField(name, value)
      setFieldErrors((prev) => ({ ...prev, [name]: error }))
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === "email" || name === "telephone") {
      const error = validateField(name, value)
      setFieldErrors((prev) => ({ ...prev, [name]: error }))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const emailError = validateField("email", formData.email)
    const phoneError = validateField("telephone", formData.telephone)

    if (emailError || phoneError) {
      setFieldErrors({ email: emailError, telephone: phoneError })
      return
    }

    setIsSubmitting(true)
    setNotification(null)

    try {
      const response = await fetch("api/ajouter_medecin.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          nom: formData.nom,
          prenom: formData.prenom,
          telephone: formData.telephone,
          email: formData.email,
          specialite: formData.specialite,
        }),
      })

      if (response.ok) {
        setNotification({
          type: "success",
          message: "Le médecin a été enregistré avec succès dans le système.",
        })
        setFormData({ nom: "", prenom: "", telephone: "", email: "", specialite: "" })
        setFieldErrors({})
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
    formData.nom &&
    formData.prenom &&
    formData.telephone &&
    formData.email &&
    formData.specialite &&
    !fieldErrors.email &&
    !fieldErrors.telephone

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <main className="ml-64 min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-sm">
          <div className="flex h-16 items-center justify-between px-8">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-foreground">Ajouter Médecin</h2>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                Nouveau Médecin
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
              Enregistrer un nouveau médecin
            </h1>
            <p className="mt-1 text-muted-foreground">
              Remplissez le formulaire ci-dessous pour ajouter un médecin au système
            </p>
          </div>

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
                  <Stethoscope className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-foreground">
                    Informations du Médecin
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">Tous les champs sont obligatoires</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>

                {/* Nom & Prénom */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="nom" className="block text-sm font-medium text-foreground">
                      Nom
                    </label>
                    <input
                      type="text"
                      id="nom"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      placeholder="Entrez le nom"
                      autoComplete="family-name"
                      className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="prenom" className="block text-sm font-medium text-foreground">
                      Prénom
                    </label>
                    <input
                      type="text"
                      id="prenom"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleInputChange}
                      placeholder="Entrez le prénom"
                      autoComplete="given-name"
                      className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      required
                    />
                  </div>
                </div>

                {/* Téléphone */}
                <div className="space-y-2">
                  <label htmlFor="telephone" className="block text-sm font-medium text-foreground">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    id="telephone"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="+33 6 12 34 56 78"
                    autoComplete="tel"
                    className={`h-11 w-full rounded-lg border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:ring-1 ${
                      fieldErrors.telephone
                        ? "border-destructive focus:border-destructive focus:ring-destructive"
                        : "border-input focus:border-primary focus:ring-primary"
                    }`}
                    required
                  />
                  {fieldErrors.telephone && (
                    <div className="flex items-center gap-1.5 text-xs text-destructive">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      {fieldErrors.telephone}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-foreground">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="medecin@clinique.fr"
                    autoComplete="email"
                    className={`h-11 w-full rounded-lg border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:ring-1 ${
                      fieldErrors.email
                        ? "border-destructive focus:border-destructive focus:ring-destructive"
                        : "border-input focus:border-primary focus:ring-primary"
                    }`}
                    required
                  />
                  {fieldErrors.email && (
                    <div className="flex items-center gap-1.5 text-xs text-destructive">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      {fieldErrors.email}
                    </div>
                  )}
                </div>

                {/* Spécialité */}
                <div className="space-y-2">
                  <label htmlFor="specialite" className="block text-sm font-medium text-foreground">
                    Spécialité
                  </label>
                  <select
                    id="specialite"
                    name="specialite"
                    value={formData.specialite}
                    onChange={handleInputChange}
                    className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  >
                    <option value="" disabled className="text-muted-foreground">
                      Sélectionnez une spécialité
                    </option>
                    {SPECIALITES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Submit */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
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
                      "Enregistrer le Médecin"
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
