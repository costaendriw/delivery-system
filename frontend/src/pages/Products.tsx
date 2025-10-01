import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Package as PackageIcon } from 'lucide-react'
import { Product, ProductCreate } from '../types'
import { productService } from '../services/products'
import { useForm } from 'react-hook-form'
import Modal from '../components/Modal'
import Loading from '../components/Loading'

const Products = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductCreate>()

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const data = await productService.getAll()
      setProducts(data)
    } catch (error) {
      console.error('Erro ao carregar produtos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product)
      reset(product)
    } else {
      setEditingProduct(null)
      reset({
        name: '',
        description: '',
        price: 0,
        product_type: 'gas',
        stock_quantity: 0,
        is_active: true,
      })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingProduct(null)
    reset()
  }

  const onSubmit = async (data: ProductCreate) => {
    try {
      if (editingProduct) {
        await productService.update(editingProduct.id, data)
        alert('Produto atualizado com sucesso!')
      } else {
        await productService.create(data)
        alert('Produto criado com sucesso!')
      }
      closeModal()
      loadProducts()
    } catch (error: any) {
      console.error('Erro ao salvar produto:', error)
      alert(error.response?.data?.detail || 'Erro ao salvar produto')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return

    try {
      await productService.delete(id)
      alert('Produto excluído com sucesso!')
      loadProducts()
    } catch (error) {
      console.error('Erro ao excluir produto:', error)
      alert('Erro ao excluir produto')
    }
  }

  if (isLoading) return <Loading />

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Produtos</h1>
          <p className="text-gray-600 mt-1">Gerencie seu catálogo de produtos</p>
        </div>
        <button onClick={() => openModal()} className="btn btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Novo Produto</span>
        </button>
      </div>

      {products.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600">Nenhum produto cadastrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-lg ${
                    product.product_type === 'gas' ? 'bg-orange-100' : 'bg-blue-100'
                  }`}>
                    <PackageIcon className={`w-6 h-6 ${
                      product.product_type === 'gas' ? 'text-orange-600' : 'text-blue-600'
                    }`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                    <span className={`badge ${
                      product.product_type === 'gas' ? 'badge-warning' : 'badge-info'
                    }`}>
                      {product.product_type === 'gas' ? 'Gás' : 'Água'}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openModal(product)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {product.description && (
                <p className="text-sm text-gray-600 mb-4">{product.description}</p>
              )}

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Preço:</span>
                  <span className="text-xl font-bold text-gray-800">
                    R$ {product.price.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Estoque:</span>
                  <span className={`font-semibold ${
                    product.stock_quantity > 10 ? 'text-green-600' :
                    product.stock_quantity > 0 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {product.stock_quantity} unidades
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status:</span>
                  <span className={`badge ${
                    product.is_active ? 'badge-success' : 'badge-danger'
                  }`}>
                    {product.is_active ? 'Ativo' : 'Inativo'}
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
        title={editingProduct ? 'Editar Produto' : 'Novo Produto'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Produto *
            </label>
            <input
              {...register('name', { required: 'Nome é obrigatório' })}
              type="text"
              className="input"
              placeholder="Botijão de Gás P13"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              {...register('description')}
              className="input"
              rows={3}
              placeholder="Descrição detalhada do produto..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo *
              </label>
              <select {...register('product_type', { required: true })} className="input">
                <option value="gas">Gás</option>
                <option value="water">Água</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preço (R$) *
              </label>
              <input
                {...register('price', {
                  required: 'Preço é obrigatório',
                  min: { value: 0.01, message: 'Preço deve ser maior que 0' },
                })}
                type="number"
                step="0.01"
                className="input"
                placeholder="110.00"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estoque *
              </label>
              <input
                {...register('stock_quantity', {
                  required: 'Estoque é obrigatório',
                  min: { value: 0, message: 'Estoque não pode ser negativo' },
                })}
                type="number"
                className="input"
                placeholder="50"
              />
              {errors.stock_quantity && (
                <p className="mt-1 text-sm text-red-600">{errors.stock_quantity.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select {...register('is_active')} className="input">
                <option value="true">Ativo</option>
                <option value="false">Inativo</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button type="button" onClick={closeModal} className="btn btn-secondary flex-1">
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary flex-1">
              {editingProduct ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Products