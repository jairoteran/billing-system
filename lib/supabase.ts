import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para las tablas (actualizados según el esquema real)
export interface Product {
  id: number
  name: string
  description: string | null
  price: number
  tax_rate: number
  unit: string
  active: boolean
  created_at: string
  updated_at: string
}

export interface Customer {
  id: number
  name: string
  email: string
  phone: string | null
  address: string | null
  tax_id: string | null
  created_at: string
  updated_at: string
}

export interface Invoice {
  id: number
  invoice_number: string
  customer_id: number
  issue_date: string
  due_date: string
  subtotal: number
  tax_amount: number
  total: number
  status: 'draft' | 'sent' | 'paid' | 'overdue'
  notes: string | null
  created_at: string
  updated_at: string
}

export interface InvoiceItem {
  id: number
  invoice_id: number
  product_id: number | null
  description: string
  quantity: number
  unit_price: number
  tax_rate: number
  line_total: number
  created_at: string
}

// Funciones para productos
export const getProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export const addProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> => {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const updateProduct = async (id: number, updates: Partial<Product>): Promise<Product> => {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const deleteProduct = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// Funciones para clientes
export const getCustomers = async (): Promise<Customer[]> => {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export const addCustomer = async (customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>): Promise<Customer> => {
  const { data, error } = await supabase
    .from('customers')
    .insert([customer])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const updateCustomer = async (id: number, updates: Partial<Customer>): Promise<Customer> => {
  const { data, error } = await supabase
    .from('customers')
    .update(updates)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const deleteCustomer = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// Funciones para facturas
export const getInvoices = async (): Promise<Invoice[]> => {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export const addInvoice = async (invoice: Omit<Invoice, 'id' | 'created_at' | 'updated_at'>): Promise<Invoice> => {
  const { data, error } = await supabase
    .from('invoices')
    .insert([invoice])
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Función para obtener estadísticas del dashboard (optimizada)
export const getDashboardStats = async () => {
  try {
    // Hacer una sola consulta para obtener todos los datos necesarios
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, active, price')
    
    if (productsError) throw productsError

    const { data: customers, error: customersError } = await supabase
      .from('customers')
      .select('id')
    
    if (customersError) throw customersError

    const { data: invoices, error: invoicesError } = await supabase
      .from('invoices')
      .select('total, status')
    
    if (invoicesError) throw invoicesError

    // Calcular estadísticas en memoria
    const activeProducts = products?.filter(p => p.active)?.length || 0
    const totalProductValue = products?.reduce((sum, p) => sum + (p.price || 0), 0) || 0
    const paidInvoices = invoices?.filter(i => i.status === 'paid') || []
    const totalRevenue = paidInvoices.reduce((sum, i) => sum + (i.total || 0), 0)

    return {
      totalProducts: products?.length || 0,
      activeProducts,
      totalProductValue,
      totalCustomers: customers?.length || 0,
      totalInvoices: invoices?.length || 0,
      totalRevenue
    }
  } catch (error) {
    console.error('Error getting dashboard stats:', error)
    // Retornar valores por defecto en caso de error
    return {
      totalProducts: 0,
      activeProducts: 0,
      totalProductValue: 0,
      totalCustomers: 0,
      totalInvoices: 0,
      totalRevenue: 0
    }
  }
}
