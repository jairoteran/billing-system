"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Plus, Users, Package, FileText, BarChart3, Sparkles, RefreshCw } from "lucide-react"
import Link from "next/link"
import { AnimatedCounter } from "../components/animated-counter"
import { getDashboardStats } from "../lib/supabase"
import { useSupabaseRealtime } from "../hooks/use-supabase-realtime"

interface DashboardStats {
  totalProducts: number
  activeProducts: number
  totalProductValue: number
  totalCustomers: number
  totalInvoices: number
  totalRevenue: number
}

export default function BillingDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    activeProducts: 0,
    totalProductValue: 0,
    totalCustomers: 0,
    totalInvoices: 0,
    totalRevenue: 0
  })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadStats = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true)
      const dashboardStats = await getDashboardStats()
      setStats(dashboardStats)
    } catch (error) {
      console.error('Error loading dashboard stats:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    loadStats()
  }, [loadStats])

  // Actualizaciones en tiempo real
  useSupabaseRealtime('products', () => loadStats(false))
  useSupabaseRealtime('customers', () => loadStats(false))
  useSupabaseRealtime('invoices', () => loadStats(false))

  const handleRefresh = () => {
    setRefreshing(true)
    loadStats(false)
  }

  return (
    <div className="min-h-screen">
      <header className="bg-white/80 backdrop-blur-lg border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="animate-fade-in-up">
              <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
                <Sparkles className="w-8 h-8 text-primary" />
                Sistema de Facturación
              </h1>
              <p className="text-sm text-muted-foreground mt-1">Gestiona tus facturas de manera simple e intuitiva</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleRefresh}
                disabled={refreshing}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Actualizando...' : 'Actualizar'}
              </Button>
              <Link href="/facturas/nueva">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover-lift">
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Factura
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border border-border hover:shadow-lg transition-all duration-300 hover-lift animate-scale-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Facturas Este Mes</CardTitle>
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {loading ? (
                  <div className="h-8 bg-gray-200 rounded animate-pulse" />
                ) : (
                  <AnimatedCounter end={stats.totalInvoices} />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {loading ? "Cargando..." : 
                  stats.totalInvoices === 0 ? "Empezando desde cero" : `${stats.totalInvoices} facturas totales`
                }
              </p>
            </CardContent>
          </Card>

          <Card
            className="bg-white border border-border hover:shadow-lg transition-all duration-300 hover-lift animate-scale-in"
            style={{ animationDelay: "0.1s" }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Ingresos Totales</CardTitle>
              <div className="p-2 rounded-lg bg-accent/10">
                <BarChart3 className="h-4 w-4 text-accent" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {loading ? (
                  <div className="h-8 bg-gray-200 rounded animate-pulse" />
                ) : (
                  <AnimatedCounter end={stats.totalRevenue} prefix="€" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {loading ? "Cargando..." :
                  stats.totalRevenue === 0 ? "Listo para crecer" : "Ingresos generados"
                }
              </p>
            </CardContent>
          </Card>

          <Card
            className="bg-white border border-border hover:shadow-lg transition-all duration-300 hover-lift animate-scale-in"
            style={{ animationDelay: "0.2s" }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Clientes Activos</CardTitle>
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {loading ? (
                  <div className="h-8 bg-gray-200 rounded animate-pulse" />
                ) : (
                  <AnimatedCounter end={stats.totalCustomers} />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {loading ? "Cargando..." :
                  stats.totalCustomers === 0 ? "Agrega tu primer cliente" : `${stats.totalCustomers} clientes registrados`
                }
              </p>
            </CardContent>
          </Card>

          <Card
            className="bg-white border border-border hover:shadow-lg transition-all duration-300 hover-lift animate-scale-in"
            style={{ animationDelay: "0.3s" }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Productos</CardTitle>
              <div className="p-2 rounded-lg bg-accent/10">
                <Package className="h-4 w-4 text-accent" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {loading ? (
                  <div className="h-8 bg-gray-200 rounded animate-pulse" />
                ) : (
                  <AnimatedCounter end={stats.totalProducts} />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {loading ? "Cargando..." :
                  stats.totalProducts === 0 ? "Construye tu catálogo" : `${stats.activeProducts} activos`
                }
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/clientes">
            <Card className="bg-white border border-border hover:shadow-lg transition-all duration-300 cursor-pointer group hover-lift animate-fade-in-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-foreground group-hover:text-primary transition-colors duration-300">
                  <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  Gestionar Clientes
                </CardTitle>
                <CardDescription>Añade, edita y organiza la información de tus clientes</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 bg-transparent"
                >
                  Ver Clientes
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/productos">
            <Card
              className="bg-white border border-border hover:shadow-lg transition-all duration-300 cursor-pointer group hover-lift animate-fade-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-foreground group-hover:text-accent transition-colors duration-300">
                  <div className="p-3 rounded-xl bg-accent/10 group-hover:bg-accent/20 transition-colors duration-300">
                    <Package className="w-6 h-6 text-accent" />
                  </div>
                  Gestionar Productos
                </CardTitle>
                <CardDescription>Administra tu catálogo de productos y servicios</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full border-accent/20 text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-300 bg-transparent"
                >
                  Ver Productos
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/facturas">
            <Card
              className="bg-white border border-border hover:shadow-lg transition-all duration-300 cursor-pointer group hover-lift animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-foreground group-hover:text-primary transition-colors duration-300">
                  <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  Historial de Facturas
                </CardTitle>
                <CardDescription>Revisa y gestiona todas tus facturas anteriores</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 bg-transparent"
                >
                  Ver Historial
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Sección de Créditos */}
        <div className="mt-16 pt-8 border-t border-border">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-sm text-muted-foreground">
                Desarrollado con Next.js, React y Supabase
              </span>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                © 2025 Sistema de Facturación. Creado con ❤️ por{' '}
                <span className="font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer">
                  Jairo Teran
                </span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Desarrollador Full Stack | React | TypeScript | Node.js
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
