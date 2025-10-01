import { api } from './api'
import { Order, OrderCreate, OrderUpdate } from '../types'

export const orderService = {
  async getAll(
    skip = 0,
    limit = 100,
    statusFilter?: string,
    customerId?: number
  ): Promise<Order[]> {
    const { data } = await api.get<Order[]>('/orders/', {
      params: {
        skip,
        limit,
        status_filter: statusFilter,
        customer_id: customerId,
      },
    })
    return data
  },

  async getById(id: number): Promise<Order> {
    const { data } = await api.get<Order>(`/orders/${id}`)
    return data
  },

  async create(order: OrderCreate): Promise<Order> {
    const { data } = await api.post<Order>('/orders/', order)
    return data
  },

  async update(id: number, order: OrderUpdate): Promise<Order> {
    const { data } = await api.put<Order>(`/orders/${id}`, order)
    return data
  },

  async complete(id: number): Promise<Order> {
    const { data } = await api.post<Order>(`/orders/${id}/complete`)
    return data
  },

  async getCustomerHistory(customerId: number): Promise<Order[]> {
    const { data } = await api.get<Order[]>(`/orders/customer/${customerId}/history`)
    return data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/orders/${id}`)
  },
}