import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { RiShoppingBagLine, RiEyeLine } from 'react-icons/ri'
import { useCart } from '../contexts/CartContext'
import { formatPrice, TAG_LABELS, getImageUrl } from '../utils/formatters'
import toast from 'react-hot-toast'

export default function ProductCard({ product }) {
  const { addItem, toggleDrawer } = useCart()

  const handleAdd = (e) => {
    e.preventDefault(); e.stopPropagation()
    addItem(product)
    toast.success(`${product.name} agregado 🛍️`)
    toggleDrawer(true)
  }

  const tagInfo = product.tags?.[0] ? TAG_LABELS[product.tags[0]] : null

  return (
    <motion.div whileHover={{ y:-6 }} transition={{ duration:0.35, ease:[0.22,1,0.36,1] }}
      className="group relative overflow-hidden rounded-2xl"
      style={{
        background:'rgba(22,16,10,0.90)',
        border:'1px solid rgba(201,150,58,0.10)',
        boxShadow:'0 4px 24px rgba(0,0,0,0.40)',
      }}>
      <Link to={`/producto/${product._id}`}>
        {/* Imagen */}
        <div className="relative h-56 overflow-hidden" style={{background:'rgba(14,10,6,0.80)'}}>
          <img src={getImageUrl(product.mainImage)} alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={e => { e.target.src='https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=60' }} />
          <div className="absolute inset-0 bg-gradient-to-t from-night/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {tagInfo && (
            <span className={`absolute top-3 left-3 product-tag ${tagInfo.color}`} style={{fontSize:'10px'}}>
              {tagInfo.label}
            </span>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 flex items-center justify-center"
              style={{background:'rgba(14,10,6,0.70)', backdropFilter:'blur(4px)'}}>
              <span className="font-cormorant font-semibold text-xl" style={{color:'rgba(245,237,214,0.80)'}}>Agotado</span>
            </div>
          )}

          {/* Botones hover */}
          <div className="absolute inset-x-0 bottom-0 p-3 flex gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
            <button onClick={handleAdd} disabled={product.stock===0}
              className="flex-1 flex items-center justify-center gap-2 font-poppins font-semibold text-xs py-2.5 rounded-xl transition-all duration-200 disabled:opacity-40"
              style={{background:'linear-gradient(135deg,#C9963A,#E8B86D)', color:'#0E0A06', boxShadow:'0 4px 16px rgba(201,150,58,0.40)'}}>
              <RiShoppingBagLine size={14} /> Agregar
            </button>
            <Link to={`/producto/${product._id}`} onClick={e => e.stopPropagation()}
              className="w-10 flex items-center justify-center rounded-xl transition-colors duration-200"
              style={{background:'rgba(245,237,214,0.10)', border:'1px solid rgba(245,237,214,0.15)', color:'rgba(245,237,214,0.80)'}}>
              <RiEyeLine size={15} />
            </Link>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="font-poppins text-[10px] font-medium tracking-[0.22em] uppercase mb-1" style={{color:'rgba(201,150,58,0.65)'}}>
            {product.category}
          </p>
          <h3 className="font-cormorant font-semibold text-lg leading-tight line-clamp-2 mb-3" style={{color:'#F5EDD6'}}>
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <span className="font-cormorant font-bold text-2xl" style={{
              background:'linear-gradient(135deg,#C9963A,#E8B86D)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
            }}>
              {formatPrice(product.price)}
            </span>
            {product.stock > 0 && product.stock <= 5 && (
              <span className="font-poppins text-[10px] px-2 py-1 rounded-full"
                style={{background:'rgba(251,146,60,0.12)', color:'rgba(251,146,60,0.85)'}}>
                Solo {product.stock}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
