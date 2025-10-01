import { useEffect, useState } from 'react'
import { Plus, Filter } from 'lucide-react'
import { Order, Customer, Product, OrderCreate } from '../types'
import { orderService } from '../services/orders'
import { customerService } from '../services/customers'
import { productService } from '../services/products'
import { useForm } from 'react-hook-form'
import OrderCard from '../components/OrderCard'
import Modal from '../components/Modal'
import Loading from '../components/Loading'

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [selectedItems, setSelectedItems] = useState<{ product_id: number; quantity: number }[]>([])

  const { register, handleSubmit, reset, formState: { errors } } = useForm<OrderCreate>()

  useEffect(() => {
    loadData()
  }, [filterStatus])

  const loadData = async () => {
    try {
      const [ordersData, customersData, productsData] = await Promise.all([
        orderService.getAll(0, 100, filterStatus || undefined),
        customerService.getAll(),
        productService.getAll(),
      ])
      setOrders(ordersData)
      setCustomers(customersData)
      setProducts(productsData)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      await orderService.update(orderId, { status: newStatus as any })
      loadData()
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      alert('Erro ao atualizar status do pedido')
    }
  }

  const handleComplete = async (orderId: number) => {
    try {
      await orderService.complete(orderId)
      loadData()
    } catch (error) {
      console.error('Erro ao concluir pedido:', error)
      alert('Erro ao concluir pedido')
    }
  }

  const addItem = () => {
    setSelectedItems([...selectedItems, { product_id: 0, quantity: 1 }])
  }

  const removeItem = (index: number) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: 'product_id' | 'quantity', value: number) => {
    const newItems = [...selectedItems]
    newItems[index][field] = value
    setSelectedItems(newItems)
  }

  const onSubmit = async (data: OrderCreate) => {
    if (selectedItems.length === 0) {
      alert('Adicione pelo menos um item ao pedido')
      return
    }

    try {
      await orderService.create({
        ...data,
        customer_id: Number(data.customer_id),
        items: selectedItems,
      })
      setIsModalOpen(false)
      reset()
      setSelectedItems([])
      loadData()
      alert('Pedido criado com sucesso! WhatsApp enviado.')
    } catch (error: any) {
      console.error('Erro ao criar pedido:', error)
      alert(error.response?.data?.detail || 'Erro ao criar pedido')
    }
  }

  if (isLoading) return <Loading />

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Pedidos</h1>
          <p className="text-gray-600 mt-1">Gerencie todos os pedidos</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Novo Pedido</span>
        </button>
      </div>

      {/* Filter */}
      <div className="card">
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input flex-1"
          >
            <option value="">Todos os status</option>
            <option value="novo">Novo</option>
            <option value="em_entrega">Em Entrega</option>
            <option value="concluido">Concluído</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>
      </div>

      {/* Orders Grid */}
      {orders.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600">Nenhum pedido encontrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onStatusChange={handleStatusChange}
              onComplete={handleComplete}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          reset()
          setSelectedItems([])
        }}
        title="Novo Pedido"
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cliente *
            </label>
            <select
              {...register('customer_id', { required: 'Cliente é obrigatório' })}
              className="input"
            >
              <option value="">Selecione um cliente</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} - {customer.phone}
                </option>
              ))}
            </select>
            {errors.customer_id && (
              <p className="mt-1 text-sm text-red-600">{errors.customer_id.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observações
            </label>
            <textarea
              {...register('notes')}
              className="input"
              rows={3}
              placeholder="Observações sobre o pedido..."
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Itens do Pedido *
              </label>
              <button
                type="button"
                onClick={addItem}
                className="btn btn-secondary text-sm"
              >
                + Adicionar Item
              </button>
            </div>

            {selectedItems.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">
                Nenhum item adicionado
              </p>
            ) : (
              <div className="space-y-3">
                {selectedItems.map((item, index) => (
                  <div key={index} className="flex space-x-2">
                    <select
                      value={item.product_id}
                      onChange={(e) => updateItem(index, 'product_id', Number(e.target.value))}
                      className="input flex-1"
                    >
                      <option value={0}>Selecione um produto</option>
                      {products.filter(p => p.is_active).map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name} - R$ {product.price.toFixed(2)}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                      className="input w-24"
                      placeholder="Qtd"
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="btn btn-danger"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false)
                reset()
                setSelectedItems([])
              }}
              className="btn btn-secondary flex-1"
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary flex-1">
              Criar Pedido
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Orders