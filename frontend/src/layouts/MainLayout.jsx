import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CartDrawer from '../components/CartDrawer'
import PromoPopup from '../components/PromoPopup'

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col" style={{background:'#0E0A06'}}>
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <PromoPopup />
    </div>
  )
}
