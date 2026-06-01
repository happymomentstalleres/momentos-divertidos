import {
  RiDashboardLine, RiStore2Line, RiShoppingBag3Line,
  RiSettings3Line, RiLogoutBoxLine, RiMenuLine, RiMegaphoneLine,
  RiArrowRightSLine, RiCloseLine, RiStoreLine  // ← agrega RiStoreLine
} from 'react-icons/ri'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RiDashboardLine, RiStore2Line, RiShoppingBag3Line,
  RiSettings3Line, RiLogoutBoxLine, RiMenuLine, RiMegaphoneLine,
  RiArrowRightSLine, RiCloseLine
} from 'react-icons/ri'
import { useAuth } from '../contexts/AuthContext'

const NAV = [
  { to:'/admin',               label:'Dashboard',    icon:RiDashboardLine,   exact:true },
  { to:'/admin/productos',     label:'Productos',    icon:RiStore2Line },
  { to:'/admin/pedidos',       label:'Pedidos',      icon:RiShoppingBag3Line },
  { to:'/admin/anuncios',      label:'Anuncios',     icon:RiMegaphoneLine },
  { to:'/admin/configuracion', label:'Configuración',icon:RiSettings3Line },
]

/* Paleta admin oscura */
const A = {
  bg:      '#0E0A06',
  sidebar: '#130E08',
  card:    'rgba(28,20,12,0.90)',
  border:  'rgba(201,150,58,0.10)',
  text:    '#F5EDD6',
  muted:   'rgba(245,237,214,0.38)',
  gold:    '#C9963A',
}

function SidebarContent({ onClose }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate  = useNavigate()
  const isActive  = (item) => item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to)
  const handleLogout = () => { logout(); navigate('/admin/login') }

  return (
    <div className="flex flex-col h-full" style={{ background: A.sidebar }}>
      {/* Logo */}
      <div className="px-5 py-5 flex items-center justify-between" style={{ borderBottom:`1px solid ${A.border}` }}>
        <Link to="/"  className="flex items-center gap-3">
          <img src="/logo.png" alt="" className="w-10 h-10 object-contain"
            style={{ opacity:0.85 }}
            onError={e => e.target.style.display='none'} />
          </Link>
            <p className="font-cormorant font-bold leading-none" style={{ color:A.text, fontSize:'17px' }}>Momentos</p>
            <p className="font-poppins text-[10px] tracking-[0.22em] uppercase mt-0.5" style={{ color:`${A.gold}88` }}>
              Admin Panel
            </p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg"
            style={{ color:A.muted }}>
            <RiCloseLine size={18} />
          </button>
        )}
      </div>

      {/* User */}
      <div className="px-4 py-3" style={{ borderBottom:`1px solid ${A.border}` }}>
        <div className="px-3 py-3 rounded-xl" style={{ background:'rgba(201,150,58,0.07)', border:`1px solid rgba(201,150,58,0.12)` }}>
          <p className="font-poppins font-semibold text-sm leading-none" style={{ color:A.text }}>{user?.name}</p>
          <p className="font-poppins text-xs mt-1" style={{ color:A.muted }}>{user?.email}</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV.map((item) => {
          const Icon   = item.icon
          const active = isActive(item)
          return (
            <Link key={item.to} to={item.to} onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 rounded-xl font-poppins text-sm font-medium transition-all duration-200"
              style={{
                background: active ? 'linear-gradient(135deg,rgba(201,150,58,0.22),rgba(201,150,58,0.08))' : 'transparent',
                color:      active ? A.gold : A.muted,
                border:     active ? `1px solid rgba(201,150,58,0.22)` : '1px solid transparent',
              }}
              onMouseEnter={e => { if(!active){ e.currentTarget.style.background='rgba(245,237,214,0.04)'; e.currentTarget.style.color='rgba(245,237,214,0.75)' }}}
              onMouseLeave={e => { if(!active){ e.currentTarget.style.background='transparent'; e.currentTarget.style.color=A.muted }}}>
              <Icon size={18} />
              {item.label}
              {active && <RiArrowRightSLine size={14} className="ml-auto" style={{ color:`${A.gold}70` }} />}
            </Link>
          )
        })}
      </nav>
      {/* Botón Ver tienda — pega ANTES del botón logout */}
        <Link to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-poppins text-sm font-medium w-full transition-all duration-200"
          style={{ color:'rgba(201,150,58,0.65)', background:'rgba(201,150,58,0.06)', border:'1px solid rgba(201,150,58,0.14)' }}>
          <RiStoreLine size={18} />
          Ver tienda
        </Link>

      {/* Logout */}
      <div className="p-3" style={{ borderTop:`1px solid ${A.border}` }}>
        <button onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-poppins text-sm font-medium w-full transition-all duration-200"
          style={{ color:'rgba(245,237,214,0.28)' }}
          onMouseEnter={e => { e.currentTarget.style.background='rgba(248,113,113,0.08)'; e.currentTarget.style.color='rgba(248,113,113,0.75)' }}
          onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='rgba(245,237,214,0.28)' }}>
          <RiLogoutBoxLine size={18} />
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}

export default function AdminLayout() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: A.bg }}>
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex w-56 flex-shrink-0 flex-col" style={{ borderRight:`1px solid ${A.border}` }}>
        <SidebarContent />
      </aside>

      {/* Sidebar móvil */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              onClick={() => setOpen(false)} className="fixed inset-0 z-40 lg:hidden"
              style={{ background:'rgba(0,0,0,0.65)', backdropFilter:'blur(6px)' }} />
            <motion.aside initial={{x:'-100%'}} animate={{x:0}} exit={{x:'-100%'}}
              transition={{type:'spring', damping:26, stiffness:220}}
              className="fixed left-0 top-0 h-full w-56 z-50 lg:hidden"
              style={{ borderRight:`1px solid ${A.border}` }}>
              <SidebarContent onClose={() => setOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar móvil */}
        <header className="lg:hidden flex items-center justify-between px-4 h-14 flex-shrink-0"
          style={{ background: A.sidebar, borderBottom:`1px solid ${A.border}` }}>
          <button onClick={() => setOpen(true)} className="p-2 rounded-xl transition-colors"
            style={{ color:A.muted }}
            onMouseEnter={e => e.currentTarget.style.color=A.text}
            onMouseLeave={e => e.currentTarget.style.color=A.muted}>
            <RiMenuLine size={22} />
          </button>
          <span className="font-cormorant font-bold text-lg" style={{ color:A.text }}>Panel Admin</span>
          <div className="w-9" />
        </header>

        {/* Contenido */}
        <main className="flex-1 overflow-y-auto scrollbar-thin p-5 sm:p-7"
          style={{ background: A.bg }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
