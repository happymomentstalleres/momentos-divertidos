import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './contexts/CartContext'
import { AuthProvider } from './contexts/AuthContext'
import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'
import ProtectedRoute from './components/ProtectedRoute'

import Home from './pages/Home'
import Catalog from './pages/Catalog'
import ProductDetail from './pages/ProductDetail'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import Login from './pages/Login'

import AdminDashboard from './admin/pages/AdminDashboard'
import AdminProducts from './admin/pages/AdminProducts'
import AdminProductForm from './admin/pages/AdminProductForm'
import AdminOrders from './admin/pages/AdminOrders'
import AdminConfig from './admin/pages/AdminConfig'
import AdminPromos from './admin/pages/AdminPromos'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/catalogo" element={<Catalog />} />
              <Route path="/producto/:id" element={<ProductDetail />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/pedido-exitoso" element={<OrderSuccess />} />
            </Route>

            <Route path="/admin/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/productos" element={<AdminProducts />} />
                <Route path="/admin/productos/nuevo" element={<AdminProductForm />} />
                <Route path="/admin/productos/editar/:id" element={<AdminProductForm />} />
                <Route path="/admin/pedidos" element={<AdminOrders />} />
                <Route path="/admin/anuncios" element={<AdminPromos />} />
                <Route path="/admin/configuracion" element={<AdminConfig />} />
              </Route>
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
