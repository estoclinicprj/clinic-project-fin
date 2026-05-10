"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import {
  UserPlus,
  Stethoscope,
  Users,
  ClipboardPlus,
  ClipboardList,
  UserCheck,
  Activity,
  Sun,
  Moon,
  LayoutDashboard,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navItems = [
  {
    label: "Tableau de Bord",
    href: "/tableau-de-bord",
    icon: LayoutDashboard,
  },
  {
    label: "Liste des Patients",
    href: "/liste-patients",
    icon: Users,
  },
  {
    label: "Ajouter Patient",
    href: "/ajouter-patient",
    icon: UserPlus,
  },
  {
    label: "Liste des Médecins",
    href: "/liste-medecins",
    icon: UserCheck,
  },
  {
    label: "Ajouter Médecin",
    href: "/ajouter-medecin",
    icon: Stethoscope,
  },
  {
    label: "Liste des Consultations",
    href: "/liste-consultations",
    icon: ClipboardList,
  },
  {
    label: "Nouvelle Consultation",
    href: "/nouvelle-consultation",
    icon: ClipboardPlus,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-sidebar-border bg-sidebar">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-20 items-center gap-3 border-b border-sidebar-border px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary">
            <Activity className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-sidebar-foreground">EstoClinic</h1>
            <p className="text-xs text-sidebar-muted">Clinique Médicale</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-muted hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5",
                  isActive ? "text-sidebar-primary" : "text-sidebar-muted"
                )} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-accent">
                <span className="text-sm font-medium text-sidebar-foreground">AD</span>
              </div>
              <div>
                <p className="text-sm font-medium text-sidebar-foreground">Admin</p>
                <p className="text-xs text-sidebar-muted">admin@estoclinic.fr</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-9 w-9 text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Basculer le thème</span>
            </Button>
          </div>
        </div>
      </div>
    </aside>
  )
}
