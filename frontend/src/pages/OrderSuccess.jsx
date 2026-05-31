import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { RiCheckboxCircleLine, RiShoppingBag3Line } from 'react-icons/ri'

export default function OrderSuccess() {
  const [order, setOrder] = useState(null)
  useEffect(() => {
    const saved = sessionStorage.getItem('lastOrder')
    if (saved) { setOrder(JSON.parse(saved)); sessionStorage.removeItem('lastOrder') }
  }, [])

  return (
    <>
      <Helmet><title>¡Pedido enviado! – Momentos Divertidos</title></Helmet>
      <div className="min-h-screen flex items-center justify-center px-4" style={{background:'#0E0A06'}}>
        {/* Glow blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 pointer-events-none"
          style={{background:'radial-gradient(ellipse, rgba(74,222,128,0.10) 0%, transparent 70%)', filter:'blur(48px)', borderRadius:'50%'}} />

        <motion.div initial={{opacity:0,scale:0.9,y:30}} animate={{opacity:1,scale:1,y:0}}
          transition={{type:'spring',damping:20}}
          className="relative w-full max-w-md rounded-3xl p-10 text-center"
          style={{background:'rgba(22,16,10,0.95)', border:'1px solid rgba(74,222,128,0.15)', boxShadow:'0 0 80px rgba(74,222,128,0.08)'}}>

          <div className="absolute top-0 left-0 right-0 h-px"
            style={{background:'linear-gradient(90deg,transparent,rgba(74,222,128,0.40),transparent)'}} />

          <motion.div initial={{scale:0}} animate={{scale:1}} transition={{delay:0.2,type:'spring',stiffness:200}}
            className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{background:'rgba(74,222,128,0.10)', border:'1px solid rgba(74,222,128,0.20)'}}>
            <RiCheckboxCircleLine size={44} style={{color:'rgba(74,222,128,0.90)'}} />
          </motion.div>

          <motion.h1 initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.3}}
            className="font-cormorant font-bold mb-2" style={{color:'#F5EDD6', fontSize:'clamp(28px,5vw,40px)'}}>
            ¡Pedido enviado!
          </motion.h1>

          {order?.customerName && (
            <p className="font-poppins text-sm mb-2" style={{color:'rgba(245,237,214,0.50)'}}>
              Gracias, <span style={{color:'rgba(245,237,214,0.80)', fontWeight:600}}>{order.customerName}</span>
            </p>
          )}

          <p className="font-poppins text-sm leading-relaxed mb-8" style={{color:'rgba(245,237,214,0.38)'}}>
            Tu pedido fue registrado. Se abrió WhatsApp con el resumen — solo envía el mensaje y te confirmamos en breve.
          </p>

          <div className="rounded-2xl p-4 mb-8" style={{background:'rgba(201,150,58,0.07)', border:'1px solid rgba(201,150,58,0.14)'}}>
            <p className="font-poppins text-xs leading-relaxed" style={{color:'rgba(201,150,58,0.75)'}}>
              📱 Si WhatsApp no abrió automáticamente, puedes escribirnos directamente al número indicado.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/" className="btn-ghost flex-1" style={{borderRadius:'12px'}}>Volver al inicio</Link>
            <Link to="/catalogo" className="btn-primary flex-1" style={{borderRadius:'12px'}}>
              <RiShoppingBag3Line size={17} /> Seguir comprando
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  )
}
