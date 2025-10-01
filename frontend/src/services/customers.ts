import { api } from './api'
import { Customer, CustomerCreate, CustomerUpdate } from '../types'

export const customerService = {
  async getAll(skip = 0, limit = 100): Promise<Customer[]> {
    const { data } = await api.get<Customer[]>('/customers/', {
      params: { skip, limit },
    })
    return data
  },

  async getById(id: number): Promise<Customer> {
    const { data } = await api.get<Customer>(`/customers/${id}`)
    return data
  },

  async create(customer: CustomerCreate): Promise<Customer> {
    const { data } = await api.post<Customer>('/customers/', customer)
    return data
  },

  async update(id: number, customer: CustomerUpdate): Promise<Customer> {
    const { data } = await api.put<Customer>(`/customers/${id}`, customer)
    return data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/customers/${id}`)
  },
}