import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { RiStore2Line, RiShoppingBag3Line, RiTimeLine, RiArrowRightLine, RiAddLine, RiMegaphoneLine } from 'react-icons/ri'
import { productService } from '../../services/productService'
import { orderService } from '../../services/orderService'
import { formatPrice, formatDate, STATUS_LABELS } from '../../utils/formatters'
import Loader from '../../components/Loader'

const A = {
  card:   'rgba(28,20,12,0.90)',
  border: 'rgba(201,150,58,0.10)',
  text:   '#F5EDD6',
  muted:  'rgba(245,237,214,0.40)',
  gold:   '#C9963A',
}

function StatCard({ label, value, Icon, color, link, delay }) {
  return (
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay}}>
      <Link to={link} className="block rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1"
        style={{ background:A.card, border:`1px solid ${A.border}`, boxShadow:'0 4px 24px rgba(0,0,0,0.30)' }}
        onMouseEnter={e => e.currentTarget.style.borderColor='rgba(201,150,58,0.25)'}
        onMouseLeave={e => e.currentTarget.style.borderColor=A.border}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background:color.bg, border:`1px solid ${color.border}` }}>
            <Icon size={22} style={{ color:color.icon }} />
          </div>
          <div>
            <p className="font-poppins text-xs mb-1" style={{ color:A.muted }}>{label}</p>
            <p className="font-cormorant font-bold text-3xl" style={{ color:A.text }}>{value}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats]           = useState(null)
  const [recentOrders, setRecent]   = useState([])
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    Promise.all([
      productService.getAllAdmin({ limit:1 }),
      orderService.getAll({ limit:6 }),
    ]).then(([p, o]) => {
      setStats({ totalProducts: p.data.total, totalOrders: o.data.total })
      setRecent(o.data.orders)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader />

  const pending = recentOrders.filter(o => o.status === 'pendiente').length

  return (
    <>
      <Helmet><title>Dashboard – Admin Momentos Divertidos</title></Helmet>

      <div className="space-y-6">
        {/* Título */}
        <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}}>
          <p className="section-label mb-1">Panel de control</p>
          <h1 className="font-cormorant font-bold text-3xl" style={{ color:A.text }}>Dashboard</h1>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Total productos"   value={stats?.totalProducts ?? 0} Icon={RiStore2Line}      link="/admin/productos"    delay={0.05} color={{ bg:'rgba(201,150,58,0.10)', border:'rgba(201,150,58,0.18)', icon:'#C9963A' }} />
          <StatCard label="Total pedidos"     value={stats?.totalOrders ?? 0}   Icon={RiShoppingBag3Line} link="/admin/pedidos"      delay={0.10} color={{ bg:'rgba(96,165,250,0.10)', border:'rgba(96,165,250,0.18)', icon:'#60a5fa' }} />
          <StatCard label="Pedidos pendientes" value={pending}                   Icon={RiTimeLine}         link="/admin/pedidos"      delay={0.15} color={{ bg:'rgba(251,191,36,0.10)', border:'rgba(251,191,36,0.18)', icon:'#fbbf24' }} />
        </div>

        {/* Pedidos recientes */}
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.2}}
          className="rounded-2xl overflow-hidden" style={{ background:A.card, border:`1px solid ${A.border}` }}>
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom:`1px solid ${A.border}` }}>
            <h2 className="font-cormorant font-semibold text-xl" style={{ color:A.text }}>Pedidos recientes</h2>
            <Link to="/admin/pedidos" className="flex items-center gap-1 font-poppins text-xs font-medium transition-colors"
              style={{ color:A.gold }}
              onMouseEnter={e => e.currentTarget.style.opacity='0.75'}
              onMouseLeave={e => e.currentTarget.style.opacity='1'}>
              Ver todos <RiArrowRightLine size={13} />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-14">
              <RiShoppingBag3Line size={40} style={{ color:'rgba(245,237,214,0.10)', margin:'0 auto 12px' }} />
              <p className="font-poppins text-sm" style={{ color:A.muted }}>Aún no hay pedidos</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom:`1px solid ${A.border}` }}>
                    {['Cliente','Total','Estado','Fecha'].map(h => (
                      <th key={h} className="text-left font-poppins text-[11px] font-semibold tracking-widest uppercase px-6 py-3"
                        style={{ color:'rgba(245,237,214,0.30)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, i) => {
                    const s = STATUS_LABELS[order.status]
                    return (
                      <tr key={order._id} style={{ borderBottom: i < recentOrders.length-1 ? `1px solid rgba(245,237,214,0.04)` : 'none' }}
                        onMouseEnter={e => e.currentTarget.style.background='rgba(245,237,214,0.02)'}
                        onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                        <td className="px-6 py-3 font-poppins text-sm font-medium" style={{ color:A.text }}>{order.customerName}</td>
                        <td className="px-6 py-3 font-cormorant font-bold text-lg" style={{ color:A.gold }}>{formatPrice(order.grandTotal)}</td>
                        <td className="px-6 py-3">
                          <span className="font-poppins text-[10px] font-semibold px-2.5 py-1 rounded-full" style={{ background:`${s?.bg||'rgba(245,237,214,0.08)'}`, color:`${s?.text||A.muted}` }}>
                            {s?.label || order.status}
                          </span>
                        </td>
                        <td className="px-6 py-3 font-poppins text-xs" style={{ color:A.muted }}>{formatDate(order.createdAt)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Accesos rápidos */}
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.28}}
          className="rounded-2xl p-6" style={{ background:A.card, border:`1px solid ${A.border}` }}>
          <h2 className="font-cormorant font-semibold text-xl mb-4" style={{ color:A.text }}>Accesos rápidos</h2>
          <div className="flex flex-wrap gap-3">
            <Link to="/admin/productos/nuevo" className="btn-primary text-xs" style={{ padding:'10px 20px', borderRadius:'12px' }}>
              <RiAddLine size={15} /> Nuevo producto
            </Link>
            <Link to="/admin/anuncios" className="btn-outline text-xs" style={{ padding:'10px 20px', borderRadius:'12px' }}>
              <RiMegaphoneLine size={15} /> Anuncios
            </Link>
            <Link to="/admin/pedidos" className="btn-outline text-xs" style={{ padding:'10px 20px', borderRadius:'12px' }}>
              Ver pedidos
            </Link>
            <Link to="/admin/configuracion" className="btn-outline text-xs" style={{ padding:'10px 20px', borderRadius:'12px' }}>
              Configuración
            </Link>
            <a href="/" target="_blank" className="btn-ghost text-xs" style={{ padding:'10px 20px', borderRadius:'12px' }}>
              Ver tienda ↗
            </a>
          </div>
        </motion.div>
      </div>
    </>
  )
}
