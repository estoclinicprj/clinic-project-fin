import { NextResponse } from "next/server"

// Types for the dashboard data
interface DashboardStats {
  kpis: {
    totalPatients: { value: number; change: number; changeLabel: string }
    consultationsToday: { value: number; change: number; changeLabel: string }
    medecinsEnService: { value: number; change: number; changeLabel: string }
    chiffreAffaires: { value: number; change: number; changeLabel: string }
  }
  consultationsChart: { jour: string; consultations: number }[]
  dernieresConsultations: {
    id: string
    patient: string
    heure: string
    status: "terminée" | "en-cours" | "en-attente"
  }[]
}

// Simulated data - in production, this would come from a database
function generateDashboardStats(): DashboardStats {
  const jours = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]
  const today = new Date()
  const dayIndex = today.getDay()
  
  // Generate last 7 days chart data
  const consultationsChart = jours.map((jour, index) => ({
    jour,
    consultations: Math.floor(Math.random() * 40) + 20 + (index === dayIndex ? 15 : 0),
  }))

  return {
    kpis: {
      totalPatients: {
        value: 2847,
        change: 12.5,
        changeLabel: "par rapport au mois dernier",
      },
      consultationsToday: {
        value: 156,
        change: 8.2,
        changeLabel: "par rapport à hier",
      },
      medecinsEnService: {
        value: 24,
        change: 4,
        changeLabel: "médecins disponibles",
      },
      chiffreAffaires: {
        value: 45680,
        change: 15.3,
        changeLabel: "par rapport à hier",
      },
    },
    consultationsChart,
    dernieresConsultations: [
      { id: "C001", patient: "Marie Dupont", heure: "08:30", status: "terminée" },
      { id: "C002", patient: "Pierre Leroy", heure: "09:15", status: "terminée" },
      { id: "C003", patient: "Isabelle Moreau", heure: "10:00", status: "en-cours" },
      { id: "C004", patient: "François Lambert", heure: "10:45", status: "en-attente" },
      { id: "C005", patient: "Camille Petit", heure: "11:30", status: "en-attente" },
    ],
  }
}

export async function GET() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  
  const stats = generateDashboardStats()
  
  return NextResponse.json(stats)
}
