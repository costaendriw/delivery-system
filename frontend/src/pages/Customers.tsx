import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Phone, MapPin } from 'lucide-react'
import { Customer, CustomerCreate } from '../types'
import { customerService } from '../services/customers'
import { useForm } from 'react-hook-form'
import Modal from '../components/Modal'
import Loading from '../components/Loading'

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CustomerCreate>()

  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = async () => {
    try {
      const data = await customerService.getAll()
      setCustomers(data)
    } catch (error) {
      console.error('Erro ao carregar clientes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const openModal = (customer?: Customer) => {
    if (customer) {
      setEditingCustomer(customer)
      reset(customer)
    } else {
      setEditingCustomer(null)
      reset({
        name: '',
        phone: '',
        address: '',
        consumption_pattern_days: 30,
      })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingCustomer(null)
    reset()
  }

  const onSubmit = async (data: CustomerCreate) => {
    try {
      if (editingCustomer) {
        await customerService.update(editingCustomer.id, data)
        alert('Cliente atualizado com sucesso!')
      } else {
        await customerService.create(data)
        alert('Cliente criado com sucesso!')
      }
      closeModal()
      loadCustomers()
    } catch (error: any) {
      console.error('Erro ao salvar cliente:', error)
      alert(error.response?.data?.detail || 'Erro ao salvar cliente')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este cliente?')) return

    try {
      await customerService.delete(id)
      alert('Cliente excluído com sucesso!')
      loadCustomers()
    } catch (error) {
      console.error('Erro ao excluir cliente:', error)
      alert('Erro ao excluir cliente')
    }
  }

  if (isLoading) return <Loading />

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Clientes</h1>
          <p className="text-gray-600 mt-1">Gerencie seus clientes</p>
        </div>
        <button onClick={() => openModal()} className="btn btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Novo Cliente</span>
        </button>
      </div>

      {customers.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600">Nenhum cliente cadastrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map((customer) => (
            <div key={customer.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{customer.name}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openModal(customer)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(customer.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{customer.phone}</span>
                </div>
                <div className="flex items-start space-x-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mt-0.5" />
                  <span>{customer.address}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Padrão de consumo:</span>
                  <span className="font-semibold text-gray-800">
                    {customer.consumption_pattern_days} dias
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingCustomer ? 'Editar Cliente' : 'Novo Cliente'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome Completo *
            </label>
            <input
              {...register('name', { required: 'Nome é obrigatório' })}
              type="text"
              className="input"
              placeholder="João Silva"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefone *
            </label>
            <input
              {...register('phone', {
                required: 'Telefone é obrigatório',
                pattern: {
                  value: /^[0-9]{10,11}$/,
                  message: 'Telefone inválido (apenas números, 10 ou 11 dígitos)',
                },
              })}
              type="tel"
              className="input"
              placeholder="27999999999"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Endereço Completo *
            </label>
            <textarea
              {...register('address', { required: 'Endereço é obrigatório' })}
              className="input"
              rows={3}
              placeholder="Rua, número, bairro, cidade - ES"
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Padrão de Consumo (dias) *
            </label>
            <input
              {...register('consumption_pattern_days', {
                required: 'Padrão de consumo é obrigatório',
                min: { value: 1, message: 'Mínimo de 1 dia' },
                max: { value: 365, message: 'Máximo de 365 dias' },
              })}
              type="number"
              className="input"
              placeholder="30"
            />
            {errors.consumption_pattern_days && (
              <p className="mt-1 text-sm text-red-600">{errors.consumption_pattern_days.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Intervalo médio entre pedidos em dias
            </p>
          </div>

          <div className="flex space-x-3 pt-4">
            <button type="button" onClick={closeModal} className="btn btn-secondary flex-1">
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary flex-1">
              {editingCustomer ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Customers