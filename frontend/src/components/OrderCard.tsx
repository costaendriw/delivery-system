import { Order } from '../types'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface OrderCardProps {
  order: Order
  onStatusChange?: (orderId: number, newStatus: string) => void
  onComplete?: (orderId: number) => void
}

const OrderCard = ({ order, onStatusChange, onComplete }: OrderCardProps) => {
  const getStatusBadge = (status: string) => {
    const badges = {
      novo: 'badge-info',
      em_entrega: 'badge-warning',
      concluido: 'badge-success',
      cancelado: 'badge-danger',
    }
    return badges[status as keyof typeof badges] || 'badge-info'
  }

  const getStatusLabel = (status: string) => {
    const labels = {
      novo: 'Novo',
      em_entrega: 'Em Entrega',
      concluido: 'Concluído',
      cancelado: 'Cancelado',
    }
    return labels[status as keyof typeof labels] || status
  }

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Pedido #{order.id}
          </h3>
          <p className="text-sm text-gray-500">
            {format(new Date(order.created_at), "dd 'de' MMMM 'de' yyyy", {
              locale: ptBR,
            })}
          </p>
        </div>
        <span className={`badge ${getStatusBadge(order.status)}`}>
          {getStatusLabel(order.status)}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Total:</span>
          <span className="font-semibold text-gray-800">
            R$ {order.total_amount.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Itens:</span>
          <span className="text-gray-800">{order.items.length}</span>
        </div>
      </div>

      {order.notes && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Observações:</span> {order.notes}
          </p>
        </div>
      )}

      {order.status !== 'concluido' && order.status !== 'cancelado' && (
        <div className="flex space-x-2">
          {order.status === 'novo' && (
            <button
              onClick={() => onStatusChange?.(order.id, 'em_entrega')}
              className="btn btn-secondary flex-1 text-sm"
            >
              Iniciar Entrega
            </button>
          )}
          {order.status === 'em_entrega' && (
            <button
              onClick={() => onComplete?.(order.id)}
              className="btn btn-primary flex-1 text-sm"
            >
              Concluir Entrega
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default OrderCard