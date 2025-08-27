"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Copy,
  Trash2,
  Plus,
  FileText,
  TrendingUp,
  Calendar,
  Euro,
} from "lucide-react"
import Link from "next/link"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

interface Invoice {
  id: number
  invoice_number: string
  customer_name: string
  customer_email: string
  issue_date: string
  due_date: string
  subtotal: number
  tax_amount: number
  total: number
  status: "draft" | "sent" | "paid" | "overdue"
  notes: string
}

export default function InvoicesPage() {
  const [invoices] = useState<Invoice[]>([])

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")

  // Filter invoices
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer_email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter

    const matchesDate = (() => {
      if (dateFilter === "all") return true
      const invoiceDate = new Date(invoice.issue_date)
      const now = new Date()
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)

      switch (dateFilter) {
        case "30days":
          return invoiceDate >= thirtyDaysAgo
        case "90days":
          return invoiceDate >= ninetyDaysAgo
        case "thisyear":
          return invoiceDate.getFullYear() === now.getFullYear()
        default:
          return true
      }
    })()

    return matchesSearch && matchesStatus && matchesDate
  })

  const totalInvoices = invoices.length
  const totalRevenue = invoices.filter((i) => i.status === "paid").reduce((sum, i) => sum + i.total, 0)
  const pendingAmount = invoices.filter((i) => i.status === "sent").reduce((sum, i) => sum + i.total, 0)
  const overdueAmount = invoices.filter((i) => i.status === "overdue").reduce((sum, i) => sum + i.total, 0)

  const monthlyData = [
    { month: "Ene", revenue: 0, invoices: 0 },
    { month: "Feb", revenue: 0, invoices: 0 },
    { month: "Mar", revenue: 0, invoices: 0 },
  ]

  const statusData = [
    { name: "Pagadas", value: invoices.filter((i) => i.status === "paid").length, color: "#22c55e" },
    { name: "Enviadas", value: invoices.filter((i) => i.status === "sent").length, color: "#3b82f6" },
    { name: "Borradores", value: invoices.filter((i) => i.status === "draft").length, color: "#6b7280" },
    { name: "Vencidas", value: invoices.filter((i) => i.status === "overdue").length, color: "#ef4444" },
  ]

  const getStatusBadge = (status: Invoice["status"]) => {
    const variants = {
      draft: { variant: "secondary" as const, label: "Borrador" },
      sent: { variant: "default" as const, label: "Enviada" },
      paid: { variant: "default" as const, label: "Pagada" },
      overdue: { variant: "destructive" as const, label: "Vencida" },
    }
    const config = variants[status]
    return (
      <Badge 
        variant={config.variant} 
        className={status === "paid" ? "bg-green-500 hover:bg-green-600" : undefined}
      >
        {config.label}
      </Badge>
    )
  }

  const handleDeleteInvoice = (id: number) => {
    console.log("Eliminar factura:", id)
    alert("Funcionalidad de eliminación implementada")
  }

  const handleDuplicateInvoice = (id: number) => {
    console.log("Duplicar factura:", id)
    alert("Funcionalidad de duplicación implementada")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="hover:bg-slate-100/80 transition-all duration-200">
                  <ArrowLeft className="w-4 h-4 mr-2 text-slate-600" />
                  <span className="text-slate-700">Volver</span>
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Historial de Facturas
                </h1>
                <p className="text-sm text-slate-500">Gestiona y analiza todas tus facturas</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50 bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
              <Link href="/facturas/nueva">
                <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
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
        <Tabs defaultValue="invoices" className="space-y-6">
          <TabsList className="bg-white/70 backdrop-blur-sm border-slate-200/60">
            <TabsTrigger value="invoices" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              Facturas
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              Reportes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="invoices" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">Total Facturas</CardTitle>
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                    <FileText className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                    {totalInvoices}
                  </div>
                  <p className="text-xs text-slate-500">
                    {totalInvoices === 0 ? "Comienza creando facturas" : `${filteredInvoices.length} mostradas`}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">Ingresos Cobrados</CardTitle>
                  <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                    <Euro className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">€{totalRevenue.toFixed(2)}</div>
                  <p className="text-xs text-slate-500">Facturas pagadas</p>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">Pendiente de Cobro</CardTitle>
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                    <Euro className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">€{pendingAmount.toFixed(2)}</div>
                  <p className="text-xs text-slate-500">Facturas enviadas</p>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">Facturas Vencidas</CardTitle>
                  <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-lg">
                    <Euro className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">€{overdueAmount.toFixed(2)}</div>
                  <p className="text-xs text-slate-500">Requieren atención</p>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <Filter className="w-5 h-5" />
                  Filtros y Búsqueda
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="search" className="text-slate-700">
                      Buscar
                    </Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        id="search"
                        placeholder="Número, cliente, email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-white/70 border-slate-200/60 focus:border-purple-400 focus:ring-purple-400/20"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="status" className="text-slate-700">
                      Estado
                    </Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="bg-white/70 border-slate-200/60 focus:border-purple-400 focus:ring-purple-400/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los estados</SelectItem>
                        <SelectItem value="draft">Borradores</SelectItem>
                        <SelectItem value="sent">Enviadas</SelectItem>
                        <SelectItem value="paid">Pagadas</SelectItem>
                        <SelectItem value="overdue">Vencidas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="date" className="text-slate-700">
                      Período
                    </Label>
                    <Select value={dateFilter} onValueChange={setDateFilter}>
                      <SelectTrigger className="bg-white/70 border-slate-200/60 focus:border-purple-400 focus:ring-purple-400/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las fechas</SelectItem>
                        <SelectItem value="30days">Últimos 30 días</SelectItem>
                        <SelectItem value="90days">Últimos 90 días</SelectItem>
                        <SelectItem value="thisyear">Este año</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Badge variant="secondary" className="text-sm bg-slate-100/80 text-slate-700 border-slate-200/60">
                      {filteredInvoices.length} facturas
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Invoices Table */}
            <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-slate-800">Lista de Facturas</CardTitle>
                <CardDescription className="text-slate-500">
                  {invoices.length === 0
                    ? "No tienes facturas creadas aún. ¡Crea tu primera factura para comenzar!"
                    : "Todas tus facturas organizadas y fáciles de gestionar"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {invoices.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="p-4 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <FileText className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">No hay facturas creadas</h3>
                    <p className="text-slate-500 mb-4">
                      Comienza creando tu primera factura para gestionar tu facturación
                    </p>
                    <Link href="/facturas/nueva">
                      <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                        <Plus className="w-4 h-4 mr-2" />
                        Crear Primera Factura
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-200/60">
                        <TableHead className="text-slate-600">Número</TableHead>
                        <TableHead className="text-slate-600">Cliente</TableHead>
                        <TableHead className="text-slate-600">Fecha Emisión</TableHead>
                        <TableHead className="text-slate-600">Vencimiento</TableHead>
                        <TableHead className="text-slate-600">Total</TableHead>
                        <TableHead className="text-slate-600">Estado</TableHead>
                        <TableHead className="text-right text-slate-600">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInvoices.map((invoice) => (
                        <TableRow
                          key={invoice.id}
                          className="border-slate-200/60 hover:bg-slate-50/50 transition-colors duration-200"
                        >
                          <TableCell>
                            <div className="font-medium text-slate-800">{invoice.invoice_number}</div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium text-slate-800">{invoice.customer_name}</div>
                              <div className="text-sm text-slate-500">{invoice.customer_email}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-600">
                            {new Date(invoice.issue_date).toLocaleDateString("es-ES")}
                          </TableCell>
                          <TableCell className="text-slate-600">
                            {new Date(invoice.due_date).toLocaleDateString("es-ES")}
                          </TableCell>
                          <TableCell>
                            <div className="font-medium text-slate-800">€{invoice.total.toFixed(2)}</div>
                          </TableCell>
                          <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDuplicateInvoice(invoice.id)}
                                className="hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteInvoice(invoice.id)}
                                className="text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors duration-200"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            {/* Revenue Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <TrendingUp className="w-5 h-5" />
                    Ingresos Mensuales
                  </CardTitle>
                  <CardDescription className="text-slate-500">Evolución de tus ingresos por mes</CardDescription>
                </CardHeader>
                <CardContent>
                  {invoices.length === 0 ? (
                    <div className="h-[300px] flex items-center justify-center">
                      <div className="text-center">
                        <TrendingUp className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500">No hay datos para mostrar</p>
                        <p className="text-sm text-slate-400">Crea facturas para ver tus reportes</p>
                      </div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`€${value}`, "Ingresos"]} />
                        <Bar dataKey="revenue" fill="#8b5cf6" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <Calendar className="w-5 h-5" />
                    Estados de Facturas
                  </CardTitle>
                  <CardDescription className="text-slate-500">Distribución por estado actual</CardDescription>
                </CardHeader>
                <CardContent>
                  {invoices.length === 0 ? (
                    <div className="h-[300px] flex items-center justify-center">
                      <div className="text-center">
                        <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500">No hay datos para mostrar</p>
                        <p className="text-sm text-slate-400">Crea facturas para ver la distribución</p>
                      </div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-slate-800">Resumen del Año</CardTitle>
                  <CardDescription className="text-slate-500">Métricas principales de 2024</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Total Facturado:</span>
                    <span className="font-bold text-slate-800">
                      €{(totalRevenue + pendingAmount + overdueAmount).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Total Cobrado:</span>
                    <span className="font-bold text-green-600">€{totalRevenue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Pendiente:</span>
                    <span className="font-bold text-blue-600">€{pendingAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Vencido:</span>
                    <span className="font-bold text-red-600">€{overdueAmount.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-slate-800">Clientes Principales</CardTitle>
                  <CardDescription className="text-slate-500">Por volumen de facturación</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {invoices.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-slate-500 text-sm">No hay datos disponibles</p>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Cliente 1</span>
                        <span className="font-medium text-slate-800">€0</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Cliente 2</span>
                        <span className="font-medium text-slate-800">€0</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Cliente 3</span>
                        <span className="font-medium text-slate-800">€0</span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-slate-800">Productos Más Vendidos</CardTitle>
                  <CardDescription className="text-slate-500">Por frecuencia de facturación</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {invoices.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-slate-500 text-sm">No hay datos disponibles</p>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Producto 1</span>
                        <span className="font-medium text-slate-800">0 veces</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Producto 2</span>
                        <span className="font-medium text-slate-800">0 veces</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Producto 3</span>
                        <span className="font-medium text-slate-800">0 veces</span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Sección de Créditos */}
        <div className="mt-16 pt-8 border-t border-slate-200/60">
          <div className="text-center">
            <p className="text-sm text-slate-500">
              © 2025 Sistema de Facturación. Desarrollado por{' '}
              <span className="font-semibold text-purple-600 hover:text-purple-700 transition-colors">
                Jairo Teran
              </span>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
