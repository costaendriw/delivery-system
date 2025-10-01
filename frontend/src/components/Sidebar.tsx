import { NavLink } from 'react-router-dom'
import { Home, ShoppingCart, Users, Package } from 'lucide-react'

const Sidebar = () => {
  const menuItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/orders', icon: ShoppingCart, label: 'Pedidos' },
    { path: '/customers', icon: Users, label: 'Clientes' },
    { path: '/products', icon: Package, label: 'Produtos' },
  ]

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white shadow-md">
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar