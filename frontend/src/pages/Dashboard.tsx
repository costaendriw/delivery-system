import { useEffect, useState } from 'react'
import { ShoppingCart, CheckCircle, Clock, TrendingUp } from 'lucide-react'
import { Order } from '../types'
import { orderService } from '../services/orders'
import StatCard from '../components/StatCard'
import OrderCard from '../components/OrderCard'
import Loading from '../components/Loading'

const Dashboard = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      const data = await orderService.getAll(0, 10)
      setOrders(data)
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      await orderService.update(orderId, { status: newStatus as any })
      loadOrders()
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
    }
  }

  const handleComplete = async (orderId: number) => {
    try {
      await orderService.complete(orderId)
      loadOrders()
    } catch (error) {
      console.error('Erro ao concluir pedido:', error)
    }
  }

  if (isLoading) return <Loading />

  const stats = {
    total: orders.length,
    novo: orders.filter((o) => o.status === 'novo').length,
    em_entrega: orders.filter((o) => o.status === 'em_entrega').length,
    concluido: orders.filter((o) => o.status === 'concluido').length,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-1">Visão geral do sistema</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Pedidos"
          value={stats.total}
          icon={ShoppingCart}
          color="blue"
        />
        <StatCard
          title="Novos Pedidos"
          value={stats.novo}
          icon={TrendingUp}
          color="yellow"
        />
        <StatCard
          title="Em Entrega"
          value={stats.em_entrega}
          icon={Clock}
          color="blue"
        />
        <StatCard
          title="Concluídos"
          value={stats.concluido}
          icon={CheckCircle}
          color="green"
        />
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Pedidos Recentes</h2>
        </div>

        {orders.length === 0 ? (
          <div className="card text-center py-12">
            <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Nenhum pedido encontrado</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.slice(0, 6).map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onStatusChange={handleStatusChange}
                onComplete={handleComplete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
