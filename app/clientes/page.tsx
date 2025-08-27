"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Badge } from "../../components/ui/badge"
import { Plus, Search, Edit, Trash2, ArrowLeft, Mail, Phone, MapPin, Users } from "lucide-react"
import Link from "next/link"
import { Customer, getCustomers, addCustomer, updateCustomer, deleteCustomer } from "../../lib/supabase"
import { useToast } from "../../hooks/use-toast"

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    tax_id: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = async () => {
    try {
      setLoading(true)
      const customersData = await getCustomers()
      setCustomers(customersData)
    } catch (error) {
      console.error('Error loading customers:', error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los clientes",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.tax_id && customer.tax_id.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleAddCustomer = () => {
    setEditingCustomer(null)
    setFormData({ name: "", email: "", phone: "", address: "", tax_id: "" })
    setIsDialogOpen(true)
  }

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer)
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone || "",
      address: customer.address || "",
      tax_id: customer.tax_id || "",
    })
    setIsDialogOpen(true)
  }

  const handleSaveCustomer = async () => {
    try {
      if (editingCustomer) {
        await updateCustomer(editingCustomer.id, formData)
        toast({
          title: "Cliente actualizado",
          description: "El cliente se ha actualizado correctamente",
        })
      } else {
        await addCustomer(formData)
        toast({
          title: "Cliente creado",
          description: "El cliente se ha creado correctamente",
        })
      }
      
      setIsDialogOpen(false)
      loadCustomers() // Recargar clientes para actualizar el dashboard
    } catch (error) {
      console.error('Error saving customer:', error)
      toast({
        title: "Error",
        description: "No se pudo guardar el cliente",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCustomer = async (id: number) => {
    try {
      await deleteCustomer(id)
      toast({
        title: "Cliente eliminado",
        description: "El cliente se ha eliminado correctamente",
      })
      loadCustomers() // Recargar clientes para actualizar el dashboard
    } catch (error) {
      console.error('Error deleting customer:', error)
      toast({
        title: "Error",
        description: "No se pudo eliminar el cliente",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50">
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
                  Gestión de Clientes
                </h1>
                <p className="text-sm text-slate-500">Administra la información de tus clientes</p>
              </div>
            </div>
            <Button
              onClick={handleAddCustomer}
              className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Cliente
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Stats Card */}
        <Card className="mb-6 bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-slate-800">Total de Clientes</CardTitle>
                  <CardDescription className="text-slate-500">Base de datos de clientes</CardDescription>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-cyan-700 bg-clip-text text-transparent">
                  {loading ? "..." : customers.length}
                </div>
                <p className="text-sm text-slate-500">
                  {customers.length === 0 ? "Comienza agregando tu primer cliente" : "clientes registrados"}
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Buscar clientes por nombre, email o NIF..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/70 backdrop-blur-sm border-slate-200/60 focus:border-cyan-400 focus:ring-cyan-400/20 transition-all duration-200"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-sm bg-slate-100/80 text-slate-700 border-slate-200/60">
              {filteredCustomers.length} clientes
            </Badge>
          </div>
        </div>

        {/* Customers Table */}
        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-slate-800">Lista de Clientes</CardTitle>
            <CardDescription className="text-slate-500">
              {customers.length === 0
                ? "No tienes clientes registrados aún. ¡Agrega tu primer cliente para comenzar!"
                : "Gestiona toda la información de tus clientes desde aquí"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <div className="p-4 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-8 h-8 text-slate-400 animate-pulse" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">Cargando clientes...</h3>
              </div>
            ) : customers.length === 0 ? (
              <div className="text-center py-12">
                <div className="p-4 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">No hay clientes registrados</h3>
                <p className="text-slate-500 mb-4">
                  Comienza agregando tu primer cliente para gestionar tu base de datos
                </p>
                <Button
                  onClick={handleAddCustomer}
                  className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Primer Cliente
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200/60">
                    <TableHead className="text-slate-600">Cliente</TableHead>
                    <TableHead className="text-slate-600">Contacto</TableHead>
                    <TableHead className="text-slate-600">Dirección</TableHead>
                    <TableHead className="text-slate-600">NIF/CIF</TableHead>
                    <TableHead className="text-slate-600">Fecha Alta</TableHead>
                    <TableHead className="text-right text-slate-600">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow
                      key={customer.id}
                      className="border-slate-200/60 hover:bg-slate-50/50 transition-colors duration-200"
                    >
                      <TableCell>
                        <div className="font-medium text-slate-800">{customer.name}</div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span className="text-slate-600">{customer.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span className="text-slate-600">{customer.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span className="text-slate-600 max-w-xs truncate">{customer.address}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-slate-300 text-slate-700">
                          {customer.tax_id}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {new Date(customer.created_at).toLocaleDateString("es-ES")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditCustomer(customer)}
                            className="hover:bg-cyan-50 hover:text-cyan-600 transition-colors duration-200"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCustomer(customer.id)}
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

        {/* Add/Edit Customer Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px] bg-white/95 backdrop-blur-sm border-slate-200/60">
            <DialogHeader>
              <DialogTitle className="text-slate-800">
                {editingCustomer ? "Editar Cliente" : "Nuevo Cliente"}
              </DialogTitle>
              <DialogDescription className="text-slate-500">
                {editingCustomer
                  ? "Modifica la información del cliente seleccionado."
                  : "Añade un nuevo cliente a tu base de datos."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-slate-700">
                  Nombre de la empresa
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Empresa ABC S.L."
                  className="bg-white/70 border-slate-200/60 focus:border-cyan-400 focus:ring-cyan-400/20"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-slate-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contacto@empresa.com"
                  className="bg-white/70 border-slate-200/60 focus:border-cyan-400 focus:ring-cyan-400/20"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone" className="text-slate-700">
                  Teléfono
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+34 912 345 678"
                  className="bg-white/70 border-slate-200/60 focus:border-cyan-400 focus:ring-cyan-400/20"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address" className="text-slate-700">
                  Dirección
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Calle Mayor 123, 28001 Madrid"
                  className="bg-white/70 border-slate-200/60 focus:border-cyan-400 focus:ring-cyan-400/20"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tax_id" className="text-slate-700">
                  NIF/CIF
                </Label>
                <Input
                  id="tax_id"
                  value={formData.tax_id}
                  onChange={(e) => setFormData({ ...formData, tax_id: e.target.value })}
                  placeholder="B12345678"
                  className="bg-white/70 border-slate-200/60 focus:border-cyan-400 focus:ring-cyan-400/20"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSaveCustomer}
                className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {editingCustomer ? "Guardar Cambios" : "Crear Cliente"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Sección de Créditos */}
        <div className="mt-16 pt-8 border-t border-border">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              © 2025 Sistema de Facturación. Desarrollado por{' '}
              <span className="font-semibold text-primary hover:text-primary/80 transition-colors">
                Jairo Teran
              </span>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
