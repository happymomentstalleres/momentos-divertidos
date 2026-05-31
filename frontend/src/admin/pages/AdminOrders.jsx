import { useState, useEffect, useCallback } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { RiShoppingBag3Line, RiArrowDownSLine } from 'react-icons/ri'
import { orderService } from '../../services/orderService'
import { formatPrice, formatDate, STATUS_LABELS } from '../../utils/formatters'
import Loader from '../../components/Loader'
import toast from 'react-hot-toast'

const A = {
  card:'rgba(28,20,12,0.90)', border:'rgba(201,150,58,0.10)',
  text:'#F5EDD6', muted:'rgba(245,237,214,0.38)', gold:'#C9963A',
}
const STATUS_OPTS = ['pendiente','confirmado','en_preparacion','enviado','entregado','cancelado']

// Colores para status badge (oscuro)
const STATUS_DARK = {
  pendiente:      { bg:'rgba(251,191,36,0.12)',  text:'rgba(251,191,36,0.85)'  },
  confirmado:     { bg:'rgba(96,165,250,0.12)',  text:'rgba(96,165,250,0.85)'  },
  en_preparacion: { bg:'rgba(251,146,60,0.12)',  text:'rgba(251,146,60,0.85)'  },
  enviado:        { bg:'rgba(167,139,250,0.12)', text:'rgba(167,139,250,0.85)' },
  entregado:      { bg:'rgba(74,222,128,0.12)',  text:'rgba(74,222,128,0.85)'  },
  cancelado:      { bg:'rgba(248,113,113,0.12)', text:'rgba(248,113,113,0.85)' },
}

export default function AdminOrders() {
  const [orders,      setOrders]      = useState([])
  const [total,       setTotal]       = useState(0)
  const [loading,     setLoading]     = useState(true)
  const [filter,      setFilter]      = useState('')
  const [expanded,    setExpanded]    = useState(null)
  const [updatingId,  setUpdatingId]  = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const res = await orderService.getAll({ limit:60, ...(filter ? {status:filter} : {}) })
      setOrders(res.data.orders); setTotal(res.data.total)
    } finally { setLoading(false) }
  }, [filter])

  useEffect(() => { fetch() }, [fetch])

  const handleStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId)
    try {
      const res = await orderService.updateStatus(orderId, newStatus)
      setOrders(prev => prev.map(o => o._id === orderId ? res.data : o))
      toast.success('Estado actualizado')
    } catch { toast.error('Error al actualizar') }
    finally { setUpdatingId(null) }
  }

  return (
    <>
      <Helmet><title>Pedidos – Admin</title></Helmet>
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="section-label mb-1">Gestión</p>
            <h1 className="font-cormorant font-bold text-3xl" style={{ color:A.text }}>
              Pedidos <span className="font-poppins text-base font-normal" style={{ color:A.muted }}>({total})</span>
            </h1>
          </div>
          {/* Filtro */}
          <select value={filter} onChange={e => setFilter(e.target.value)}
            className="input-base" style={{ maxWidth:'200px', cursor:'pointer' }}>
            <option value="">Todos los estados</option>
            {STATUS_OPTS.map(s => (
              <option key={s} value={s}>{STATUS_LABELS[s]?.label || s}</option>
            ))}
          </select>
        </div>

        {loading ? <Loader /> : orders.length === 0 ? (
          <div className="rounded-2xl p-16 text-center" style={{ background:A.card, border:`1px solid ${A.border}` }}>
            <RiShoppingBag3Line size={48} style={{ color:'rgba(245,237,214,0.10)', margin:'0 auto 12px' }} />
            <p className="font-cormorant text-2xl" style={{ color:A.muted }}>No hay pedidos</p>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {orders.map((order) => {
                const s       = STATUS_DARK[order.status]
                const isOpen  = expanded === order._id
                return (
                  <motion.div key={order._id} layout initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}
                    className="rounded-2xl overflow-hidden" style={{ background:A.card, border:`1px solid ${A.border}` }}>

                    {/* Fila resumen */}
                    <div className="flex items-center gap-4 px-5 py-4 cursor-pointer select-none"
                      onClick={() => setExpanded(isOpen ? null : order._id)}
                      onMouseEnter={e => e.currentTarget.style.background='rgba(245,237,214,0.02)'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                      <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-2 min-w-0">
                        <div>
                          <p className="font-poppins font-semibold text-sm line-clamp-1" style={{ color:A.text }}>{order.customerName}</p>
                          <p className="font-poppins text-xs mt-0.5" style={{ color:A.muted }}>{formatDate(order.createdAt)}</p>
                        </div>
                        <div>
                          <p className="font-cormorant font-bold text-xl" style={{ color:A.gold }}>{formatPrice(order.grandTotal)}</p>
                          <p className="font-poppins text-xs" style={{ color:A.muted }}>{order.items.length} producto(s)</p>
                        </div>
                        <div className="hidden sm:block">
                          <span className="font-poppins text-[10px] font-semibold px-2.5 py-1 rounded-full"
                            style={{ background:s?.bg, color:s?.text }}>
                            {STATUS_LABELS[order.status]?.label || order.status}
                          </span>
                        </div>
                        <p className="hidden sm:block font-poppins text-xs line-clamp-1" style={{ color:A.muted }}>
                          {order.address}
                        </p>
                      </div>
                      <RiArrowDownSLine size={18} style={{ color:A.muted, flexShrink:0, transition:'transform .3s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
                    </div>

                    {/* Detalle expandido */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}}
                          style={{ borderTop:`1px solid ${A.border}` }}>
                          <div className="px-5 py-5 grid grid-cols-1 sm:grid-cols-2 gap-6"
                            style={{ background:'rgba(245,237,214,0.02)' }}>
                            {/* Items */}
                            <div>
                              <p className="font-poppins text-[10px] font-semibold tracking-wider uppercase mb-3" style={{ color:A.muted }}>
                                Productos
                              </p>
                              <div className="space-y-2 mb-4">
                                {order.items.map((item,i) => (
                                  <div key={i} className="flex justify-between font-poppins text-sm">
                                    <span style={{ color:'rgba(245,237,214,0.65)' }}>{item.name} × {item.quantity}</span>
                                    <span style={{ color:A.text }}>{formatPrice(item.price * item.quantity)}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="space-y-1.5 pt-3" style={{ borderTop:`1px solid ${A.border}` }}>
                                <div className="flex justify-between font-poppins text-xs" style={{ color:A.muted }}>
                                  <span>Subtotal</span><span>{formatPrice(order.subtotal)}</span>
                                </div>
                                <div className="flex justify-between font-poppins text-xs" style={{ color:A.muted }}>
                                  <span>Delivery</span><span>{formatPrice(order.deliveryCost)}</span>
                                </div>
                                <div className="flex justify-between font-cormorant font-bold text-xl pt-1"
                                  style={{ borderTop:`1px solid ${A.border}` }}>
                                  <span style={{ color:A.text }}>Total</span>
                                  <span style={{ color:A.gold }}>{formatPrice(order.grandTotal)}</span>
                                </div>
                              </div>
                            </div>

                            {/* Datos + estado */}
                            <div className="space-y-4">
                              <div>
                                <p className="font-poppins text-[10px] font-semibold tracking-wider uppercase mb-2" style={{ color:A.muted }}>
                                  Entrega
                                </p>
                                <p className="font-poppins text-sm" style={{ color:'rgba(245,237,214,0.65)' }}>📍 {order.address}</p>
                                {order.reference && <p className="font-poppins text-sm mt-1" style={{ color:A.muted }}>📝 {order.reference}</p>}
                              </div>
                              <div>
                                <p className="font-poppins text-[10px] font-semibold tracking-wider uppercase mb-2" style={{ color:A.muted }}>
                                  Actualizar estado
                                </p>
                                <select value={order.status}
                                  onChange={e => handleStatus(order._id, e.target.value)}
                                  disabled={updatingId === order._id}
                                  className="input-base" style={{ cursor:'pointer', fontSize:'13px' }}>
                                  {STATUS_OPTS.map(s => (
                                    <option key={s} value={s}>{STATUS_LABELS[s]?.label || s}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </>
  )
}
