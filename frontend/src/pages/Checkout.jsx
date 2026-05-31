import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { RiShoppingBagLine, RiMapPinLine, RiUserLine, RiFileTextLine } from 'react-icons/ri'
import { useCart } from '../contexts/CartContext'
import { orderService } from '../services/orderService'
import { configService } from '../services/configService'
import { generateWhatsAppLink } from '../utils/whatsapp'
import { formatPrice, getImageUrl } from '../utils/formatters'
import toast from 'react-hot-toast'

const inputStyle = {
  width:'100%', padding:'12px 16px', borderRadius:'12px', outline:'none',
  fontFamily:'Poppins,sans-serif', fontSize:'14px', transition:'all .2s',
  background:'rgba(245,237,214,0.05)', border:'1px solid rgba(245,237,214,0.08)',
  color:'#F5EDD6',
}
const labelStyle = { display:'block', fontFamily:'Poppins,sans-serif', fontSize:'11px', fontWeight:500,
  letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(245,237,214,0.40)', marginBottom:'8px' }

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [config,  setConfig]  = useState(null)
  const [loading, setLoading] = useState(false)
  const [form,    setForm]    = useState({ customerName:'', address:'', reference:'' })
  const [errors,  setErrors]  = useState({})

  useEffect(() => {
    configService.get().then(res => setConfig(res.data)).catch(()=>{})
  }, [])

  const deliveryCost = config?.deliveryCost ?? 10
  const grandTotal   = subtotal + deliveryCost

  if (items.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6" style={{background:'#0E0A06'}}>
      <RiShoppingBagLine size={64} style={{color:'rgba(245,237,214,0.15)'}} />
      <h2 className="font-cormorant text-2xl" style={{color:'rgba(245,237,214,0.50)'}}>Tu carrito está vacío</h2>
      <Link to="/catalogo" className="btn-primary">Ver catálogo</Link>
    </div>
  )

  const validate = () => {
    const e = {}
    if (!form.customerName.trim()) e.customerName = 'Tu nombre es requerido'
    if (!form.address.trim()) e.address = 'La dirección es requerida'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      const res = await orderService.create({
        items: items.map(i => ({ productId:i._id, name:i.name, price:i.price, quantity:i.quantity })),
        customerName: form.customerName, address: form.address, reference: form.reference,
      })
      const { order, whatsappNumber } = res.data
      const link = generateWhatsAppLink({
        items:order.items, subtotal:order.subtotal, deliveryCost:order.deliveryCost,
        grandTotal:order.grandTotal, customerName:order.customerName,
        address:order.address, reference:order.reference,
      }, whatsappNumber || config?.whatsappNumber)

      clearCart()
      sessionStorage.setItem('lastOrder', JSON.stringify({ orderId:order._id, customerName:order.customerName }))
      window.open(link, '_blank')
      navigate('/pedido-exitoso')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al procesar el pedido')
    } finally { setLoading(false) }
  }

  return (
    <>
      <Helmet><title>Checkout – Momentos Divertidos</title></Helmet>
      <div style={{background:'#0E0A06', minHeight:'100vh'}}>
        <div className="max-w-4xl mx-auto px-6 sm:px-10 pt-28 pb-24">
          <motion.h1 initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}}
            className="font-cormorant font-bold mb-10" style={{color:'#F5EDD6', fontSize:'clamp(32px,5vw,52px)'}}>
            Finalizar pedido
          </motion.h1>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Formulario */}
            <motion.div initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} className="lg:col-span-3 space-y-5">
              <div className="rounded-2xl p-6" style={{background:'rgba(22,16,10,0.90)', border:'1px solid rgba(201,150,58,0.08)'}}>
                <h2 className="font-cormorant font-semibold text-xl mb-5 flex items-center gap-2" style={{color:'#F5EDD6'}}>
                  <RiUserLine className="text-gold" size={20} /> Datos de entrega
                </h2>
                <div className="space-y-4">
                  <div>
                    <label style={labelStyle}>Nombre completo *</label>
                    <input placeholder="¿Cómo te llamas?" value={form.customerName}
                      onChange={e => setForm(f=>({...f,customerName:e.target.value}))}
                      style={{...inputStyle, borderColor: errors.customerName ? 'rgba(248,113,113,0.50)' : 'rgba(245,237,214,0.08)'}}
                      onFocus={e => e.target.style.borderColor='rgba(201,150,58,0.40)'}
                      onBlur={e => e.target.style.borderColor=errors.customerName?'rgba(248,113,113,0.50)':'rgba(245,237,214,0.08)'} />
                    {errors.customerName && <p className="font-poppins text-xs mt-1" style={{color:'rgba(248,113,113,0.80)'}}>{errors.customerName}</p>}
                  </div>
                  <div>
                    <label style={labelStyle}>Dirección de entrega *</label>
                    <textarea rows={3} placeholder="Calle, número, urbanización..."
                      value={form.address} onChange={e => setForm(f=>({...f,address:e.target.value}))}
                      style={{...inputStyle, resize:'none', borderColor: errors.address?'rgba(248,113,113,0.50)':'rgba(245,237,214,0.08)'}}
                      onFocus={e => e.target.style.borderColor='rgba(201,150,58,0.40)'}
                      onBlur={e => e.target.style.borderColor=errors.address?'rgba(248,113,113,0.50)':'rgba(245,237,214,0.08)'} />
                    {errors.address && <p className="font-poppins text-xs mt-1" style={{color:'rgba(248,113,113,0.80)'}}>{errors.address}</p>}
                  </div>
                  <div>
                    <label style={labelStyle}>Referencia (opcional)</label>
                    <input placeholder="Ej: Casa color azul, portón negro..."
                      value={form.reference} onChange={e => setForm(f=>({...f,reference:e.target.value}))}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor='rgba(201,150,58,0.40)'}
                      onBlur={e => e.target.style.borderColor='rgba(245,237,214,0.08)'} />
                  </div>
                </div>
              </div>

              {config?.freeDeliveryZones?.length > 0 && (
                <div className="rounded-2xl p-4 flex items-start gap-3"
                  style={{background:'rgba(201,150,58,0.07)', border:'1px solid rgba(201,150,58,0.14)'}}>
                  <RiMapPinLine className="text-gold flex-shrink-0 mt-0.5" size={18} />
                  <div>
                    <p className="font-poppins font-semibold text-sm mb-1" style={{color:'rgba(201,150,58,0.85)'}}>
                      Entrega gratuita en:
                    </p>
                    {config.freeDeliveryZones.map((z,i) => (
                      <p key={i} className="font-poppins text-xs" style={{color:'rgba(245,237,214,0.50)'}}>· {z}</p>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Resumen */}
            <motion.div initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} className="lg:col-span-2">
              <div className="rounded-2xl p-6 sticky top-24"
                style={{background:'rgba(22,16,10,0.90)', border:'1px solid rgba(201,150,58,0.08)'}}>
                <h2 className="font-cormorant font-semibold text-xl mb-5 flex items-center gap-2" style={{color:'#F5EDD6'}}>
                  <RiFileTextLine className="text-gold" size={20} /> Resumen
                </h2>

                <div className="space-y-3 mb-5">
                  {items.map(item => (
                    <div key={item._id} className="flex items-center gap-3">
                      <img src={getImageUrl(item.mainImage)} alt={item.name}
                        className="w-12 h-12 object-cover rounded-xl flex-shrink-0"
                        style={{background:'rgba(201,150,58,0.08)'}}
                        onError={e => { e.target.src='https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=100&q=60' }} />
                      <div className="flex-1 min-w-0">
                        <p className="font-poppins text-xs font-medium line-clamp-1" style={{color:'rgba(245,237,214,0.80)'}}>
                          {item.name}
                        </p>
                        <p className="font-poppins text-xs" style={{color:'rgba(245,237,214,0.35)'}}>
                          {item.quantity} × {formatPrice(item.price)}
                        </p>
                      </div>
                      <span className="font-poppins font-semibold text-sm" style={{color:'rgba(245,237,214,0.80)'}}>
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 mb-5 pt-4" style={{borderTop:'1px solid rgba(245,237,214,0.06)'}}>
                  <div className="flex justify-between font-poppins text-sm" style={{color:'rgba(245,237,214,0.40)'}}>
                    <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between font-poppins text-sm" style={{color:'rgba(245,237,214,0.40)'}}>
                    <span>Delivery</span><span>{formatPrice(deliveryCost)}</span>
                  </div>
                  <div className="flex justify-between font-cormorant font-bold text-xl pt-2" style={{borderTop:'1px solid rgba(245,237,214,0.06)'}}>
                    <span style={{color:'#F5EDD6'}}>Total</span>
                    <span style={{
                      background:'linear-gradient(135deg,#C9963A,#E8B86D)',
                      WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
                    }}>{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                <button onClick={handleSubmit} disabled={loading}
                  className="btn-primary w-full py-4 text-sm"
                  style={{borderRadius:'14px'}}>
                  {loading
                    ? <><span className="w-4 h-4 border-2 border-night/30 border-t-night rounded-full animate-spin" />Procesando...</>
                    : 'Confirmar y enviar por WhatsApp 📱'
                  }
                </button>
                <p className="font-poppins text-[11px] text-center mt-3" style={{color:'rgba(245,237,214,0.22)'}}>
                  Se abrirá WhatsApp con tu pedido listo
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  )
}
