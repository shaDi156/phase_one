import { useMemo, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Products from './components/Products.jsx'
import Footer from './components/Footer.jsx'
import Dashboard from './components/Dashboard.jsx'
import { ALL_PRODUCTS } from './data/products.js'

export default function App() {
  const [cartItems, setCartItems] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [items, setItems] = useState(ALL_PRODUCTS)
  const [view, setView] = useState('catalog') // 'catalog' | 'dashboard'
  const [isAdmin, setIsAdmin] = useState(false)

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        )
      }
      return [...prev, { ...product, qty: 1 }]
    })
    setCartOpen(true)
  }

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId))
  }

  const addItemToCatalog = (item) => {
    setItems((prev) => {
      const nextId = prev.length ? Math.max(...prev.map((p) => p.id)) + 1 : 1
      const newItem = { ...item, id: nextId }
      return [...prev, newItem]
    })
    setView('catalog')
  }

  const updateItem = (id, updates) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)))
  }

  const deleteItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const products = useMemo(() => items, [items])

  return (
    <>
      <Navbar
        cartItems={cartItems}
        cartOpen={cartOpen}
        onToggleCart={setCartOpen}
        onRemoveFromCart={removeFromCart}
        isAdmin={isAdmin}
        showDashboardButton={isAdmin && view === 'catalog'}
        onLoginSuccess={() => {
          setIsAdmin(true)
          setView('dashboard')
        }}
        onNavigateHome={() => setView('catalog')}
        onLogout={() => {
          setIsAdmin(false)
          setView('catalog')
        }}
        onOpenDashboard={() => setView('dashboard')}
      />
      <main className="container">
        {view === 'dashboard' ? (
          <Dashboard
            items={items}
            onAddItem={addItemToCatalog}
            onUpdateItem={updateItem}
            onDeleteItem={deleteItem}
          />
        ) : (
          <Products products={products} onAddToCart={addToCart} />
        )}
      </main>
      <Footer />
    </>
  )
}
