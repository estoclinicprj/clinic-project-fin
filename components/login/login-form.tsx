"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { Eye, EyeOff, Activity, Sun, Moon, Lock, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function LoginForm() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!username.trim() || !password.trim()) {
      setError("Veuillez remplir tous les champs.")
      return
    }

    setIsLoading(true)

    // Simulate auth — replace with real API call
    await new Promise((r) => setTimeout(r, 900))

    setIsLoading(false)
    router.push("/tableau-de-bord")
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4 py-12">

      {/* Theme toggle — top right */}
      <div className="absolute right-5 top-5">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="h-9 w-9 rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
          aria-label="Basculer le thème"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
      </div>

      {/* Card */}
      <div className="w-full max-w-md">

        {/* Brand header */}
        <div className="mb-10 flex flex-col items-center gap-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg">
            <Activity className="h-7 w-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              EstoClinic
            </h1>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
              Portail de gestion de la clinique médicale
            </p>
          </div>
        </div>

        {/* Form card */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <div className="mb-7">
            <h2 className="text-lg font-semibold text-foreground">
              Connexion
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Entrez vos identifiants pour accéder à votre espace.
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="mb-5 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Username */}
            <div className="space-y-1.5">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-foreground"
              >
                Nom d&apos;utilisateur
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ex: admin"
                  disabled={isLoading}
                  className={cn(
                    "h-11 w-full rounded-lg border bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground",
                    "transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
                    "disabled:cursor-not-allowed disabled:opacity-60",
                    "border-input hover:border-muted-foreground/60"
                  )}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground"
              >
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className={cn(
                    "h-11 w-full rounded-lg border bg-background pl-10 pr-11 text-sm text-foreground placeholder:text-muted-foreground",
                    "transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
                    "disabled:cursor-not-allowed disabled:opacity-60",
                    "border-input hover:border-muted-foreground/60"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  disabled={isLoading}
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-primary underline-offset-4 hover:underline focus:outline-none focus-visible:underline"
              >
                Mot de passe oublié ?
              </button>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="h-11 w-full rounded-lg text-sm font-semibold"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
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
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Connexion en cours…
                </span>
              ) : (
                "Se connecter"
              )}
            </Button>
          </form>
        </div>

        {/* Footer note */}
        <p className="mt-8 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} EstoClinic &mdash; Accès réservé au personnel autorisé.
        </p>
      </div>
    </div>
  )
}
