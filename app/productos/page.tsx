"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Badge } from "../../components/ui/badge"
import { Switch } from "../../components/ui/switch"
import { Plus, Search, Edit, Trash2, ArrowLeft, Package, Euro } from "lucide-react"
import Link from "next/link"
import { Product, getProducts, addProduct, updateProduct, deleteProduct } from "../../lib/supabase"
import { useToast } from "../../hooks/use-toast"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    tax_rate: "21.00",
    unit: "unidad",
    active: true,
  })
  const { toast } = useToast()

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const productsData = await getProducts()
      setProducts(productsData)
    } catch (error) {
      console.error('Error loading products:', error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los productos",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      product.unit.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const activeProducts = products.filter((p) => p.active).length
  const totalValue = products.reduce((sum, p) => sum + p.price, 0)

  const handleAddProduct = () => {
    setEditingProduct(null)
    setFormData({
      name: "",
      description: "",
      price: "",
      tax_rate: "21.00",
      unit: "unidad",
      active: true,
    })
    setIsDialogOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      tax_rate: product.tax_rate.toString(),
      unit: product.unit,
      active: product.active,
    })
    setIsDialogOpen(true)
  }

  const handleSaveProduct = async () => {
    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: Number.parseFloat(formData.price),
        tax_rate: Number.parseFloat(formData.tax_rate),
        unit: formData.unit,
        active: formData.active,
      }

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData)
        toast({
          title: "Producto actualizado",
          description: "El producto se ha actualizado correctamente",
        })
      } else {
        await addProduct(productData)
        toast({
          title: "Producto creado",
          description: "El producto se ha creado correctamente",
        })
      }
      
      setIsDialogOpen(false)
      loadProducts() // Recargar productos para actualizar el dashboard
    } catch (error) {
      console.error('Error saving product:', error)
      toast({
        title: "Error",
        description: "No se pudo guardar el producto",
        variant: "destructive",
      })
    }
  }

  const handleDeleteProduct = async (id: number) => {
    try {
      await deleteProduct(id)
      toast({
        title: "Producto eliminado",
        description: "El producto se ha eliminado correctamente",
      })
      loadProducts() // Recargar productos para actualizar el dashboard
    } catch (error) {
      console.error('Error deleting product:', error)
      toast({
        title: "Error",
        description: "No se pudo eliminar el producto",
        variant: "destructive",
      })
    }
  }

  const handleToggleActive = async (id: number) => {
    try {
      const product = products.find(p => p.id === id)
      if (product) {
        await updateProduct(id, { active: !product.active })
        loadProducts() // Recargar productos para actualizar el dashboard
      }
    } catch (error) {
      console.error('Error toggling product status:', error)
      toast({
        title: "Error",
        description: "No se pudo cambiar el estado del producto",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-lime-50">
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
                  Gestión de Productos
                </h1>
                <p className="text-sm text-slate-500">Administra tu catálogo de productos y servicios</p>
              </div>
            </div>
            <Button
              onClick={handleAddProduct}
              className="bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Producto
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Productos</CardTitle>
              <div className="p-2 bg-gradient-to-br from-lime-500 to-lime-600 rounded-lg">
                <Package className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold bg-gradient-to-r from-lime-600 to-lime-700 bg-clip-text text-transparent">
                {loading ? "..." : products.length}
              </div>
              <p className="text-xs text-slate-500">
                {products.length === 0 ? "Comienza agregando productos" : `${activeProducts} activos`}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Valor Promedio</CardTitle>
              <div className="p-2 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg">
                <Euro className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-cyan-700 bg-clip-text text-transparent">
                €{loading ? "..." : (products.length > 0 ? (totalValue / products.length).toFixed(2) : "0.00")}
              </div>
              <p className="text-xs text-slate-500">Por producto</p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Valor Total</CardTitle>
              <div className="p-2 bg-gradient-to-br from-slate-500 to-slate-600 rounded-lg">
                <Euro className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent">
                €{loading ? "..." : totalValue.toFixed(2)}
              </div>
              <p className="text-xs text-slate-500">Catálogo completo</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Buscar productos por nombre, descripción o unidad..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/70 backdrop-blur-sm border-slate-200/60 focus:border-lime-400 focus:ring-lime-400/20 transition-all duration-200"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-sm bg-slate-100/80 text-slate-700 border-slate-200/60">
              {filteredProducts.length} productos
            </Badge>
          </div>
        </div>

        {/* Products Table */}
        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-slate-800">Catálogo de Productos</CardTitle>
            <CardDescription className="text-slate-500">
              {products.length === 0
                ? "No tienes productos registrados aún. ¡Agrega tu primer producto para comenzar!"
                : "Gestiona todos tus productos y servicios desde aquí"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <div className="p-4 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Package className="w-8 h-8 text-slate-400 animate-pulse" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">Cargando productos...</h3>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <div className="p-4 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Package className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">No hay productos registrados</h3>
                <p className="text-slate-500 mb-4">
                  Comienza agregando tu primer producto o servicio para gestionar tu catálogo
                </p>
                <Button
                  onClick={handleAddProduct}
                  className="bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Primer Producto
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200/60">
                    <TableHead className="text-slate-600">Producto</TableHead>
                    <TableHead className="text-slate-600">Precio</TableHead>
                    <TableHead className="text-slate-600">IVA</TableHead>
                    <TableHead className="text-slate-600">Unidad</TableHead>
                    <TableHead className="text-slate-600">Estado</TableHead>
                    <TableHead className="text-slate-600">Fecha Alta</TableHead>
                    <TableHead className="text-right text-slate-600">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow
                      key={product.id}
                      className="border-slate-200/60 hover:bg-slate-50/50 transition-colors duration-200"
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium text-slate-800">{product.name}</div>
                          <div className="text-sm text-slate-500 max-w-xs truncate">{product.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-slate-800">€{product.price.toFixed(2)}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-slate-300 text-slate-700">
                          {product.tax_rate}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-slate-600">{product.unit}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={product.active}
                            onCheckedChange={() => handleToggleActive(product.id)}
                          />
                          <Badge
                            variant={product.active ? "default" : "secondary"}
                            className={product.active ? "bg-lime-500 hover:bg-lime-600" : ""}
                          >
                            {product.active ? "Activo" : "Inactivo"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {new Date(product.created_at).toLocaleDateString("es-ES")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditProduct(product)}
                            className="hover:bg-lime-50 hover:text-lime-600 transition-colors duration-200"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id)}
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

        {/* Add/Edit Product Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-sm border-slate-200/60">
            <DialogHeader>
              <DialogTitle className="text-slate-800">
                {editingProduct ? "Editar Producto" : "Nuevo Producto"}
              </DialogTitle>
              <DialogDescription className="text-slate-500">
                {editingProduct
                  ? "Modifica la información del producto seleccionado."
                  : "Añade un nuevo producto o servicio a tu catálogo."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-slate-700">
                  Nombre del producto
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Consultoría de Marketing"
                  className="bg-white/70 border-slate-200/60 focus:border-lime-400 focus:ring-lime-400/20"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description" className="text-slate-700">
                  Descripción
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe el producto o servicio..."
                  rows={3}
                  className="bg-white/70 border-slate-200/60 focus:border-lime-400 focus:ring-lime-400/20"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price" className="text-slate-700">
                    Precio (€)
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                    className="bg-white/70 border-slate-200/60 focus:border-lime-400 focus:ring-lime-400/20"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tax_rate" className="text-slate-700">
                    IVA (%)
                  </Label>
                  <Select
                    value={formData.tax_rate}
                    onValueChange={(value: string) => setFormData({ ...formData, tax_rate: value })}
                  >
                    <SelectTrigger className="bg-white/70 border-slate-200/60 focus:border-lime-400 focus:ring-lime-400/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.00">0% (Exento)</SelectItem>
                      <SelectItem value="4.00">4% (Superreducido)</SelectItem>
                      <SelectItem value="10.00">10% (Reducido)</SelectItem>
                      <SelectItem value="21.00">21% (General)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="unit" className="text-slate-700">
                    Unidad
                  </Label>
                                      <Select value={formData.unit} onValueChange={(value: string) => setFormData({ ...formData, unit: value })}>
                    <SelectTrigger className="bg-white/70 border-slate-200/60 focus:border-lime-400 focus:ring-lime-400/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unidad">Unidad</SelectItem>
                      <SelectItem value="hora">Hora</SelectItem>
                      <SelectItem value="día">Día</SelectItem>
                      <SelectItem value="mes">Mes</SelectItem>
                      <SelectItem value="año">Año</SelectItem>
                      <SelectItem value="proyecto">Proyecto</SelectItem>
                      <SelectItem value="kg">Kilogramo</SelectItem>
                      <SelectItem value="metro">Metro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="active" className="text-slate-700">
                    Estado
                  </Label>
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch
                      id="active"
                      checked={formData.active}
                      onCheckedChange={(checked: boolean) => setFormData({ ...formData, active: checked })}
                    />
                    <Label htmlFor="active" className="text-sm text-slate-600">
                      {formData.active ? "Activo" : "Inactivo"}
                    </Label>
                  </div>
                </div>
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
                onClick={handleSaveProduct}
                className="bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {editingProduct ? "Guardar Cambios" : "Crear Producto"}
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
