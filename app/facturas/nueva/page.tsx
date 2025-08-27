"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Textarea } from "../../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { Badge } from "../../../components/ui/badge"
import { Separator } from "../../../components/ui/separator"
import { ArrowLeft, Plus, Trash2, FileText, Send, Save, Eye } from "lucide-react"
import Link from "next/link"
import { Customer, Product, getCustomers, getProducts, supabase } from "../../../lib/supabase"
import { useToast } from "../../../hooks/use-toast"

interface InvoiceItem {
  id: string
  product_id: number
  description: string
  quantity: number
  unit_price: number
  tax_rate: number
  line_total: number
}

export default function NewInvoicePage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const { toast } = useToast()

  // Load customers and products from Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [customersData, productsData] = await Promise.all([
          getCustomers(),
          getProducts()
        ])
        setCustomers(customersData)
        setProducts(productsData.filter(p => p.active)) // Only active products
      } catch (error) {
        console.error('Error loading data:', error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [toast])
  const [invoiceData, setInvoiceData] = useState({
    invoice_number: "",
    issue_date: new Date().toISOString().split("T")[0],
    due_date: "",
    notes: "",
  })
  const [items, setItems] = useState<InvoiceItem[]>([])
  const [newItem, setNewItem] = useState({
    product_id: "",
    quantity: "1",
    custom_description: "",
    custom_price: "",
  })

  // Generate invoice number on component mount
  useEffect(() => {
    const generateInvoiceNumber = async () => {
      try {
        // Get the last invoice number from Supabase to generate the next one
        const { data: lastInvoice } = await supabase
          .from('invoices')
          .select('invoice_number')
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        let nextNumber = 1
        if (lastInvoice) {
          // Extract number from last invoice (e.g., "FAC-2024-001" -> 1)
          const match = lastInvoice.invoice_number.match(/FAC-\d{4}-(\d+)/)
          if (match) {
            nextNumber = parseInt(match[1]) + 1
          }
        }

        const year = new Date().getFullYear()
        const month = String(new Date().getMonth() + 1).padStart(2, "0")
        const numberStr = String(nextNumber).padStart(3, "0")
        
        const invoiceNumber = `FAC-${year}${month}-${numberStr}`
        
        setInvoiceData((prev) => ({
          ...prev,
          invoice_number: invoiceNumber,
        }))
      } catch (error) {
        console.error('Error generating invoice number:', error)
        // Fallback to random number
        const year = new Date().getFullYear()
        const month = String(new Date().getMonth() + 1).padStart(2, "0")
        const random = Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, "0")
        setInvoiceData((prev) => ({
          ...prev,
          invoice_number: `FAC-${year}${month}-${random}`,
        }))
      }

      // Set due date to 30 days from issue date
      const dueDate = new Date()
      dueDate.setDate(dueDate.getDate() + 30)
      setInvoiceData((prev) => ({
        ...prev,
        due_date: dueDate.toISOString().split("T")[0],
      }))
    }

    generateInvoiceNumber()
  }, [])

  const handleCustomerSelect = (customerId: string) => {
    const customer = customers.find((c) => c.id === Number.parseInt(customerId))
    setSelectedCustomer(customer || null)
  }

  const handleAddItem = () => {
    if (!newItem.product_id) return

    const product = products.find((p) => p.id === Number.parseInt(newItem.product_id))
    if (!product) return

    const quantity = Number.parseFloat(newItem.quantity) || 1
    const unitPrice = newItem.custom_price ? Number.parseFloat(newItem.custom_price) : product.price
    const lineTotal = quantity * unitPrice

    const item: InvoiceItem = {
      id: Math.random().toString(36).substr(2, 9),
      product_id: product.id,
      description: newItem.custom_description || (product.description || ""),
      quantity,
      unit_price: unitPrice,
      tax_rate: product.tax_rate,
      line_total: lineTotal,
    }

    setItems([...items, item])
    setNewItem({
      product_id: "",
      quantity: "1",
      custom_description: "",
      custom_price: "",
    })
  }

  const handleRemoveItem = (itemId: string) => {
    setItems(items.filter((item) => item.id !== itemId))
  }

  const handleItemChange = (itemId: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(
      items.map((item) => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value }
          if (field === "quantity" || field === "unit_price") {
            updatedItem.line_total = updatedItem.quantity * updatedItem.unit_price
          }
          return updatedItem
        }
        return item
      }),
    )
  }

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.line_total, 0)
  const taxAmount = items.reduce((sum, item) => sum + (item.line_total * item.tax_rate) / 100, 0)
  const total = subtotal + taxAmount

  const handleSaveInvoice = (status: "draft" | "sent") => {
    if (!selectedCustomer || items.length === 0) {
      alert("Por favor selecciona un cliente y añade al menos un producto.")
      return
    }

    const invoice = {
      ...invoiceData,
      customer_id: selectedCustomer.id,
      subtotal,
      tax_amount: taxAmount,
      total,
      status,
      items,
    }

    console.log("Guardando factura:", invoice)
    alert(`Factura ${status === "draft" ? "guardada como borrador" : "enviada"} correctamente!`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando datos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Nueva Factura</h1>
                <p className="text-sm text-muted-foreground">Crea una nueva factura para tus clientes</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleSaveInvoice("draft")}>
                <Save className="w-4 h-4 mr-2" />
                Guardar Borrador
              </Button>
              <Button
                onClick={() => handleSaveInvoice("sent")}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                <Send className="w-4 h-4 mr-2" />
                Enviar Factura
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Invoice Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Invoice Details */}
            <Card>
              <CardHeader>
                <CardTitle>Detalles de la Factura</CardTitle>
                <CardDescription>Información básica de la factura</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="invoice_number">Número de Factura</Label>
                    <Input
                      id="invoice_number"
                      value={invoiceData.invoice_number}
                      onChange={(e) => setInvoiceData({ ...invoiceData, invoice_number: e.target.value })}
                      placeholder="FAC-2024-001"
                    />
                  </div>
                  <div>
                    <Label htmlFor="issue_date">Fecha de Emisión</Label>
                    <Input
                      id="issue_date"
                      type="date"
                      value={invoiceData.issue_date}
                      onChange={(e) => setInvoiceData({ ...invoiceData, issue_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="due_date">Fecha de Vencimiento</Label>
                    <Input
                      id="due_date"
                      type="date"
                      value={invoiceData.due_date}
                      onChange={(e) => setInvoiceData({ ...invoiceData, due_date: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Cliente</CardTitle>
                <CardDescription>Selecciona el cliente para esta factura</CardDescription>
              </CardHeader>
              <CardContent>
                <Select onValueChange={handleCustomerSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id.toString()}>
                        {customer.name} - {customer.tax_id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedCustomer && (
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <h4 className="font-medium text-foreground">{selectedCustomer.name}</h4>
                    <p className="text-sm text-muted-foreground">{selectedCustomer.email}</p>
                    <p className="text-sm text-muted-foreground">{selectedCustomer.address}</p>
                    <p className="text-sm text-muted-foreground">NIF/CIF: {selectedCustomer.tax_id}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Add Items */}
            <Card>
              <CardHeader>
                <CardTitle>Añadir Productos/Servicios</CardTitle>
                <CardDescription>Selecciona productos de tu catálogo o crea elementos personalizados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="product">Producto</Label>
                    <Select
                      value={newItem.product_id}
                      onValueChange={(value: string) => setNewItem({ ...newItem, product_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un producto" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id.toString()}>
                            {product.name} - €{product.price.toFixed(2)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="quantity">Cantidad</Label>
                    <Input
                      id="quantity"
                      type="number"
                      step="0.01"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                      placeholder="1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="custom_price">Precio Personalizado</Label>
                    <Input
                      id="custom_price"
                      type="number"
                      step="0.01"
                      value={newItem.custom_price}
                      onChange={(e) => setNewItem({ ...newItem, custom_price: e.target.value })}
                      placeholder="Precio por defecto"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={handleAddItem} className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Añadir
                    </Button>
                  </div>
                </div>
                <div className="mb-4">
                  <Label htmlFor="custom_description">Descripción Personalizada (Opcional)</Label>
                  <Textarea
                    id="custom_description"
                    value={newItem.custom_description}
                    onChange={(e) => setNewItem({ ...newItem, custom_description: e.target.value })}
                    placeholder="Descripción personalizada del producto o servicio..."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Invoice Items */}
            {items.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Elementos de la Factura</CardTitle>
                  <CardDescription>Revisa y edita los elementos añadidos</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Descripción</TableHead>
                        <TableHead>Cantidad</TableHead>
                        <TableHead>Precio Unit.</TableHead>
                        <TableHead>IVA</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Input
                              value={item.description}
                              onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                              className="min-w-[200px]"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              step="0.01"
                              value={item.quantity}
                              onChange={(e) =>
                                handleItemChange(item.id, "quantity", Number.parseFloat(e.target.value) || 0)
                              }
                              className="w-20"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              step="0.01"
                              value={item.unit_price}
                              onChange={(e) =>
                                handleItemChange(item.id, "unit_price", Number.parseFloat(e.target.value) || 0)
                              }
                              className="w-24"
                            />
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{item.tax_rate}%</Badge>
                          </TableCell>
                          <TableCell className="font-medium">€{item.line_total.toFixed(2)}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" onClick={() => handleRemoveItem(item.id)}>
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Notas Adicionales</CardTitle>
                <CardDescription>Información adicional para el cliente</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={invoiceData.notes}
                  onChange={(e) => setInvoiceData({ ...invoiceData, notes: e.target.value })}
                  placeholder="Términos de pago, condiciones especiales, etc..."
                  rows={4}
                />
              </CardContent>
            </Card>
          </div>

          {/* Invoice Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Resumen de Factura
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-medium">€{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">IVA:</span>
                    <span className="font-medium">€{taxAmount.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-accent">€{total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Número:</span>
                    <span className="ml-2 font-medium">{invoiceData.invoice_number}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Fecha:</span>
                    <span className="ml-2 font-medium">
                      {new Date(invoiceData.issue_date).toLocaleDateString("es-ES")}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Vencimiento:</span>
                    <span className="ml-2 font-medium">
                      {new Date(invoiceData.due_date).toLocaleDateString("es-ES")}
                    </span>
                  </div>
                  {selectedCustomer && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Cliente:</span>
                      <span className="ml-2 font-medium">{selectedCustomer.name}</span>
                    </div>
                  )}
                </div>

                <Button variant="outline" className="w-full mt-4 bg-transparent" onClick={() => setShowPreview(!showPreview)}>
                  <Eye className="w-4 h-4 mr-2" />
                  {showPreview ? "Ocultar Vista Previa" : "Vista Previa"}
                </Button>
              </CardContent>
            </Card>

            {items.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Elementos ({items.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {items.map((item, index) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground truncate">
                          {index + 1}. {products.find((p) => p.id === item.product_id)?.name}
                        </span>
                        <span className="font-medium">€{item.line_total.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

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

        {/* Invoice Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Vista Previa de Factura</h2>
                <Button variant="outline" onClick={() => setShowPreview(false)}>
                  Cerrar
                </Button>
              </div>
              
              {/* Invoice Header */}
              <div className="border-b pb-6 mb-6">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Tu Empresa</h3>
                    <p className="text-gray-600">Dirección de tu empresa</p>
                    <p className="text-gray-600">NIF/CIF: Tu NIF</p>
                  </div>
                  <div className="text-right">
                    <h1 className="text-3xl font-bold text-blue-600 mb-2">FACTURA</h1>
                    <p className="text-gray-600">Número: {invoiceData.invoice_number}</p>
                    <p className="text-gray-600">Fecha: {new Date(invoiceData.issue_date).toLocaleDateString("es-ES")}</p>
                    <p className="text-gray-600">Vencimiento: {new Date(invoiceData.due_date).toLocaleDateString("es-ES")}</p>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              {selectedCustomer && (
                <div className="mb-6">
                  <h3 className="font-bold mb-2">Cliente:</h3>
                  <p className="text-gray-600">{selectedCustomer.name}</p>
                  <p className="text-gray-600">{selectedCustomer.address}</p>
                  <p className="text-gray-600">NIF/CIF: {selectedCustomer.tax_id}</p>
                </div>
              )}

              {/* Invoice Items */}
              <div className="mb-6">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Descripción</th>
                      <th className="text-right py-2">Cantidad</th>
                      <th className="text-right py-2">Precio</th>
                      <th className="text-right py-2">IVA</th>
                      <th className="text-right py-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={item.id} className="border-b">
                        <td className="py-2">{item.description}</td>
                        <td className="text-right py-2">{item.quantity}</td>
                        <td className="text-right py-2">€{item.unit_price.toFixed(2)}</td>
                        <td className="text-right py-2">{item.tax_rate}%</td>
                        <td className="text-right py-2">€{item.line_total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="text-right">
                <div className="mb-2">
                  <span className="font-medium">Subtotal: </span>
                  <span>€{subtotal.toFixed(2)}</span>
                </div>
                <div className="mb-2">
                  <span className="font-medium">IVA: </span>
                  <span>€{taxAmount.toFixed(2)}</span>
                </div>
                <div className="text-xl font-bold">
                  <span>Total: </span>
                  <span className="text-blue-600">€{total.toFixed(2)}</span>
                </div>
              </div>

              {invoiceData.notes && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-bold mb-2">Notas:</h3>
                  <p className="text-gray-600">{invoiceData.notes}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
