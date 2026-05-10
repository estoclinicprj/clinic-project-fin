"use client"

import useSWR from "swr"
import { Sidebar } from "@/components/dashboard/sidebar"
import { DashboardStatCards } from "@/components/dashboard/dashboard-stat-cards"
import { ConsultationsChart } from "@/components/dashboard/consultations-chart"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface DashboardStats {
  kpis: {
    totalPatients: { value: number; change: number; changeLabel: string }
    consultationsToday: { value: number; change: number; changeLabel: string }
    medecinsEnService: { value: number; change: number; changeLabel: string }
    chiffreAffaires: { value: number; change: number; changeLabel: string }
  }
  consultationsChart: { jour: string; consultations: number }[]
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function TableauDeBord() {
  const { data, error, isLoading } = useSWR<DashboardStats>(
    "/api/get_dashboard_stats",
    fetcher,
    { refreshInterval: 30000 } // Refresh every 30 seconds
  )

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Tableau de Bord
            </h1>
            <p className="mt-1 text-muted-foreground">
              Vue d&apos;ensemble de l&apos;activité de la clinique EstoClinic
            </p>
          </div>

          {/* KPI Cards */}
          {isLoading ? (
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="border-0 bg-card shadow-sm">
                  <CardContent className="p-6">
                    <Skeleton className="mb-2 h-4 w-24" />
                    <Skeleton className="mb-2 h-8 w-20" />
                    <Skeleton className="h-3 w-32" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="mb-8 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-destructive">
              Erreur lors du chargement des statistiques
            </div>
          ) : data ? (
            <DashboardStatCards kpis={data.kpis} />
          ) : null}

          {/* Consultations Chart — full width */}
          <div>
            {isLoading ? (
              <Card className="border-0 bg-card shadow-sm">
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="mt-1 h-4 w-64" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-[300px] w-full" />
                </CardContent>
              </Card>
            ) : error ? (
              <Card className="border-0 bg-card shadow-sm">
                <CardContent className="flex h-[380px] items-center justify-center">
                  <p className="text-muted-foreground">
                    Impossible de charger le graphique
                  </p>
                </CardContent>
              </Card>
            ) : data ? (
              <ConsultationsChart data={data.consultationsChart} />
            ) : null}
          </div>
        </div>
      </main>
    </div>
  )
}
