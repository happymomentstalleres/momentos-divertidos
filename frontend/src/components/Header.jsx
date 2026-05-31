import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { RiShoppingBagLine, RiMenuLine, RiCloseLine, RiShieldKeyholeLine } from 'react-icons/ri'
import { useCart } from '../contexts/CartContext'

export default function Header() {
  const { toggleDrawer, itemCount } = useCart()
  const [scrolled, setScrolled]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])
  useEffect(() => setMobileOpen(false), [location])

  const NAV = [{ to:'/', label:'Inicio' }, { to:'/catalogo', label:'Catálogo' }]

  return (
    <motion.header
      initial={{ y:-80 }}
      animate={{ y:0 }}
      transition={{ duration:0.7, ease:[0.22,1,0.36,1] }}
      className="fixed top-0 left-0 right-0 z-30 transition-all duration-500"
      style={{
        background: scrolled
          ? 'rgba(14,10,6,0.80)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(201,150,58,0.10)' : '1px solid transparent',
      }}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-10 h-18 flex items-center justify-between py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img src="/logo.png" alt="Momentos Divertidos" className="w-11 h-11 object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
            onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex' }} />
          <div style={{display:'none'}} className="items-center">
            <span className="font-cormorant font-bold text-2xl" style={{color:'#C9963A'}}>MD</span>
          </div>
          <div className="hidden sm:block">
            <p className="font-cormorant font-bold text-xl leading-none tracking-wide" style={{color:'#F5EDD6'}}>Momentos Divertidos</p>
            <p className="font-poppins text-[10px] tracking-[0.22em] uppercase mt-0.5" style={{color:'rgba(201,150,58,0.75)'}}>Postres & Regalos Dulces</p>
          </div>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV.map(({ to, label }) => {
            const active = location.pathname === to
            return (
              <Link key={to} to={to}
                className="font-poppins text-sm font-medium transition-colors duration-200 relative group"
                style={{ color: active ? '#C9963A' : 'rgba(245,237,214,0.60)' }}
                onMouseEnter={e => { if(!active) e.currentTarget.style.color='#F5EDD6' }}
                onMouseLeave={e => { if(!active) e.currentTarget.style.color='rgba(245,237,214,0.60)' }}>
                {label}
                <span className="absolute -bottom-1 left-0 h-px transition-all duration-300 rounded-full"
                  style={{
                    width: active ? '100%' : '0%',
                    background:'linear-gradient(90deg, #C9963A, #E8B86D)',
                  }} />
              </Link>
            )
          })}
        </nav>

        {/* Acciones */}
        <div className="flex items-center gap-2">
          <Link to="/admin/login"
            className="hidden sm:flex items-center gap-1.5 font-poppins text-xs font-medium px-4 py-2 rounded-full transition-all duration-200"
            style={{
              color:'rgba(245,237,214,0.40)',
              border:'1px solid rgba(245,237,214,0.10)',
            }}
            onMouseEnter={e => { e.currentTarget.style.color='rgba(201,150,58,0.85)'; e.currentTarget.style.borderColor='rgba(201,150,58,0.30)'; e.currentTarget.style.background='rgba(201,150,58,0.06)' }}
            onMouseLeave={e => { e.currentTarget.style.color='rgba(245,237,214,0.40)'; e.currentTarget.style.borderColor='rgba(245,237,214,0.10)'; e.currentTarget.style.background='transparent' }}>
            <RiShieldKeyholeLine size={14} /> Admin
          </Link>

          <motion.button whileTap={{ scale:0.88 }} onClick={() => toggleDrawer()}
            className="relative p-2.5 rounded-full transition-colors duration-200"
            style={{color:'rgba(245,237,214,0.75)'}}
            onMouseEnter={e => e.currentTarget.style.color='#F5EDD6'}
            onMouseLeave={e => e.currentTarget.style.color='rgba(245,237,214,0.75)'}>
            <RiShoppingBagLine size={22} />
            <AnimatePresence>
              {itemCount > 0 && (
                <motion.span key={itemCount}
                  initial={{ scale:0 }} animate={{ scale:1 }} exit={{ scale:0 }}
                  className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center font-poppins font-bold text-[10px]"
                  style={{ background:'linear-gradient(135deg,#C9963A,#E8B86D)', color:'#0E0A06' }}>
                  {itemCount > 9 ? '9+' : itemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <button className="md:hidden p-2.5 rounded-full transition-colors duration-200"
            style={{color:'rgba(245,237,214,0.65)'}}
            onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <RiCloseLine size={22} /> : <RiMenuLine size={22} />}
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}
            className="md:hidden border-t"
            style={{
              background:'rgba(14,10,6,0.95)',
              backdropFilter:'blur(24px)',
              WebkitBackdropFilter:'blur(24px)',
              borderColor:'rgba(201,150,58,0.10)',
            }}>
            <nav className="px-5 py-4 flex flex-col gap-1">
              {NAV.map(({ to, label }) => (
                <Link key={to} to={to}
                  className="font-poppins font-medium py-3 px-4 rounded-xl transition-colors"
                  style={{ color: location.pathname===to ? '#C9963A' : 'rgba(245,237,214,0.60)',
                    background: location.pathname===to ? 'rgba(201,150,58,0.08)' : 'transparent' }}>
                  {label}
                </Link>
              ))}
              <Link to="/admin/login"
                className="flex items-center gap-2 font-poppins text-sm py-3 px-4 rounded-xl mt-1 border-t pt-4"
                style={{ color:'rgba(245,237,214,0.35)', borderColor:'rgba(201,150,58,0.10)' }}>
                <RiShieldKeyholeLine size={15} /> Panel de administración
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
