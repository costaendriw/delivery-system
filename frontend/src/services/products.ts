import { api } from './api'
import { Product, ProductCreate, ProductUpdate } from '../types'

export const productService = {
  async getAll(
    skip = 0,
    limit = 100,
    productType?: 'gas' | 'water',
    isActive?: boolean
  ): Promise<Product[]> {
    const { data } = await api.get<Product[]>('/products/', {
      params: {
        skip,
        limit,
        product_type: productType,
        is_active: isActive,
      },
    })
    return data
  },

  async getById(id: number): Promise<Product> {
    const { data} = await api.get<Product>(`/products/${id}`)
    return data
  },

  async create(product: ProductCreate): Promise<Product> {
    const { data } = await api.post<Product>('/products/', product)
    return data
  },

  async update(id: number, product: ProductUpdate): Promise<Product> {
    const { data } = await api.put<Product>(`/products/${id}`, product)
    return data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/products/${id}`)
  },
}