// Usuário
export interface User {
  id: number
  email: string
  full_name: string
  is_active: boolean
  is_admin: boolean
  created_at: string
}

// Login
export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
}

// Cliente
export interface Customer {
  id: number
  name: string
  phone: string
  address: string
  consumption_pattern_days: number
  created_at: string
  updated_at?: string
}

export interface CustomerCreate {
  name: string
  phone: string
  address: string
  consumption_pattern_days: number
}

export interface CustomerUpdate {
  name?: string
  phone?: string
  address?: string
  consumption_pattern_days?: number
}

// Produto
export interface Product {
  id: number
  name: string
  description?: string
  price: number
  product_type: 'gas' | 'water'
  stock_quantity: number
  is_active: boolean
  created_at: string
  updated_at?: string
}

export interface ProductCreate {
  name: string
  description?: string
  price: number
  product_type: 'gas' | 'water'
  stock_quantity: number
  is_active: boolean
}

export interface ProductUpdate {
  name?: string
  description?: string
  price?: number
  product_type?: 'gas' | 'water'
  stock_quantity?: number
  is_active?: boolean
}

// Pedido
export interface OrderItem {
  id: number
  product_id: number
  quantity: number
  unit_price: number
  subtotal: number
}

export interface Order {
  id: number
  customer_id: number
  status: 'novo' | 'em_entrega' | 'concluido' | 'cancelado'
  total_amount: number
  notes?: string
  created_at: string
  updated_at?: string
  delivered_at?: string
  items: OrderItem[]
}

export interface OrderItemCreate {
  product_id: number
  quantity: number
}

export interface OrderCreate {
  customer_id: number
  notes?: string
  items: OrderItemCreate[]
}

export interface OrderUpdate {
  status?: 'novo' | 'em_entrega' | 'concluido' | 'cancelado'
  notes?: string
}