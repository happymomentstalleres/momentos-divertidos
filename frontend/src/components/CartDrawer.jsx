import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { RiCloseLine, RiShoppingBagLine, RiAddLine, RiSubtractLine, RiDeleteBinLine } from 'react-icons/ri'
import { useCart } from '../contexts/CartContext'
import { formatPrice, getImageUrl } from '../utils/formatters'

export default function CartDrawer() {
  const { items, isOpen, toggleDrawer, removeItem, updateQuantity, subtotal, itemCount } = useCart()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div key="overlay" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            onClick={() => toggleDrawer(false)} className="fixed inset-0 z-40"
            style={{background:'rgba(0,0,0,0.65)', backdropFilter:'blur(10px)', WebkitBackdropFilter:'blur(10px)'}} />

          <motion.div key="drawer"
            initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}}
            transition={{type:'spring', damping:28, stiffness:220}}
            className="fixed right-0 top-0 h-full w-full max-w-md z-50 flex flex-col"
            style={{background:'rgba(14,10,6,0.97)', backdropFilter:'blur(24px)', WebkitBackdropFilter:'blur(24px)', borderLeft:'1px solid rgba(201,150,58,0.10)'}}>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5" style={{borderBottom:'1px solid rgba(245,237,214,0.06)'}}>
              <div className="flex items-center gap-3">
                <RiShoppingBagLine className="text-gold" size={22} />
                <h2 className="font-cormorant font-bold text-2xl" style={{color:'#F5EDD6'}}>Mi carrito</h2>
                {itemCount > 0 && (
                  <span className="w-6 h-6 rounded-full flex items-center justify-center font-poppins font-bold text-[11px]"
                    style={{background:'linear-gradient(135deg,#C9963A,#E8B86D)', color:'#0E0A06'}}>
                    {itemCount}
                  </span>
                )}
              </div>
              <button onClick={() => toggleDrawer(false)}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
                style={{background:'rgba(245,237,214,0.05)', border:'1px solid rgba(245,237,214,0.08)', color:'rgba(245,237,214,0.50)'}}>
                <RiCloseLine size={18} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-4 space-y-3">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-5">
                  <RiShoppingBagLine size={60} style={{color:'rgba(245,237,214,0.10)'}} />
                  <div className="text-center">
                    <p className="font-cormorant text-2xl" style={{color:'rgba(245,237,214,0.35)'}}>Carrito vacío</p>
                    <p className="font-poppins text-sm mt-1" style={{color:'rgba(245,237,214,0.20)'}}>Añade algo delicioso</p>
                  </div>
                  <button onClick={() => toggleDrawer(false)} className="btn-outline" style={{fontSize:'12px',padding:'10px 22px'}}>
                    Ver productos
                  </button>
                </div>
              ) : (
                <AnimatePresence>
                  {items.map(item => (
                    <motion.div key={item._id} layout
                      initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20,height:0}}
                      className="flex gap-3 p-3 rounded-2xl"
                      style={{background:'rgba(245,237,214,0.04)', border:'1px solid rgba(245,237,214,0.06)'}}>
                      <img src={getImageUrl(item.mainImage)} alt={item.name}
                        className="w-16 h-16 object-cover rounded-xl flex-shrink-0"
                        style={{background:'rgba(201,150,58,0.08)'}}
                        onError={e => { e.target.src='https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=100&q=60' }} />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-cormorant font-semibold text-base leading-tight line-clamp-1" style={{color:'#F5EDD6'}}>
                          {item.name}
                        </h4>
                        <p className="font-poppins text-sm mt-0.5" style={{color:'rgba(201,150,58,0.75)'}}>
                          {formatPrice(item.price)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button onClick={() => updateQuantity(item._id, item.quantity-1)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-200"
                            style={{background:'rgba(245,237,214,0.06)', color:'rgba(245,237,214,0.50)'}}
                            onMouseEnter={e => { e.currentTarget.style.background='rgba(245,237,214,0.12)'; e.currentTarget.style.color='#F5EDD6' }}
                            onMouseLeave={e => { e.currentTarget.style.background='rgba(245,237,214,0.06)'; e.currentTarget.style.color='rgba(245,237,214,0.50)' }}>
                            <RiSubtractLine size={13} />
                          </button>
                          <span className="w-6 text-center font-poppins font-bold text-sm" style={{color:'#F5EDD6'}}>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item._id, item.quantity+1)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-200"
                            style={{background:'rgba(245,237,214,0.06)', color:'rgba(245,237,214,0.50)'}}
                            onMouseEnter={e => { e.currentTarget.style.background='rgba(245,237,214,0.12)'; e.currentTarget.style.color='#F5EDD6' }}
                            onMouseLeave={e => { e.currentTarget.style.background='rgba(245,237,214,0.06)'; e.currentTarget.style.color='rgba(245,237,214,0.50)' }}>
                            <RiAddLine size={13} />
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <button onClick={() => removeItem(item._id)} className="transition-colors duration-200"
                          style={{color:'rgba(245,237,214,0.20)'}}
                          onMouseEnter={e => e.currentTarget.style.color='rgba(248,113,113,0.70)'}
                          onMouseLeave={e => e.currentTarget.style.color='rgba(245,237,214,0.20)'}>
                          <RiDeleteBinLine size={15} />
                        </button>
                        <span className="font-cormorant font-bold text-lg" style={{color:'#F5EDD6'}}>
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 space-y-4" style={{borderTop:'1px solid rgba(245,237,214,0.06)'}}>
                <div className="flex justify-between items-center">
                  <span className="font-poppins text-sm" style={{color:'rgba(245,237,214,0.40)'}}>Subtotal</span>
                  <span className="font-cormorant font-bold text-2xl" style={{color:'#F5EDD6'}}>{formatPrice(subtotal)}</span>
                </div>
                <Link to="/checkout" onClick={() => toggleDrawer(false)}
                  className="btn-primary w-full text-center block" style={{borderRadius:'14px'}}>
                  Finalizar pedido
                </Link>
                <p className="font-poppins text-[11px] text-center" style={{color:'rgba(245,237,214,0.20)'}}>
                  + delivery al confirmar
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
