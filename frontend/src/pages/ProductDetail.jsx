import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { RiShoppingBagLine, RiArrowLeftLine, RiArrowLeftSLine, RiArrowRightSLine, RiSubtractLine, RiAddLine } from 'react-icons/ri'
import { productService } from '../services/productService'
import { useCart } from '../contexts/CartContext'
import { formatPrice, TAG_LABELS, getImageUrl } from '../utils/formatters'
import Loader from '../components/Loader'
import toast from 'react-hot-toast'

export default function ProductDetail() {
  const { id } = useParams()
  const { addItem, updateQuantity, items, toggleDrawer } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState(0)
  const [qty, setQty] = useState(1)
  const cartItem = items.find(i => i._id === id)

  useEffect(() => {
    window.scrollTo(0,0)
    productService.getById(id)
      .then(res => setProduct(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <Loader fullScreen />
  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{background:'#0E0A06'}}>
      <span className="text-6xl">🍰</span>
      <h2 className="font-cormorant text-2xl" style={{color:'#F5EDD6'}}>Producto no encontrado</h2>
      <Link to="/catalogo" className="btn-primary">Ver catálogo</Link>
    </div>
  )

  const allImages = [product.mainImage, ...(product.additionalImages||[])].filter(Boolean)

  const handleAdd = () => {
    if (cartItem) updateQuantity(product._id, cartItem.quantity + qty)
    else for (let i=0; i<qty; i++) addItem(product)
    toast.success(`${product.name} agregado 🛍️`)
    toggleDrawer(true)
  }

  return (
    <>
      <Helmet>
        <title>{product.name} – Momentos Divertidos</title>
        <meta name="description" content={product.shortDescription || product.name} />
      </Helmet>

      <div style={{background:'#0E0A06', minHeight:'100vh'}}>
        <div className="max-w-5xl mx-auto px-6 sm:px-10 pt-28 pb-24">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-10 font-poppins text-xs" style={{color:'rgba(245,237,214,0.30)'}}>
            <Link to="/" style={{color:'rgba(245,237,214,0.30)'}}
              onMouseEnter={e=>e.currentTarget.style.color='#C9963A'}
              onMouseLeave={e=>e.currentTarget.style.color='rgba(245,237,214,0.30)'}>Inicio</Link>
            <RiArrowRightSLine size={13} />
            <Link to="/catalogo" style={{color:'rgba(245,237,214,0.30)'}}
              onMouseEnter={e=>e.currentTarget.style.color='#C9963A'}
              onMouseLeave={e=>e.currentTarget.style.color='rgba(245,237,214,0.30)'}>Catálogo</Link>
            <RiArrowRightSLine size={13} />
            <span style={{color:'rgba(245,237,214,0.60)'}}>{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Galería */}
            <div>
              <div className="relative rounded-2xl overflow-hidden aspect-square mb-4"
                style={{background:'rgba(22,16,10,0.90)', border:'1px solid rgba(201,150,58,0.08)'}}>
                <AnimatePresence mode="wait">
                  <motion.img key={activeImg}
                    src={getImageUrl(allImages[activeImg])}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                    transition={{duration:0.35}}
                    onError={e => { e.target.src='https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=70' }}
                  />
                </AnimatePresence>

                {/* Tags */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {product.tags?.map(tag => {
                    const info = TAG_LABELS[tag]
                    return info ? <span key={tag} className={`product-tag ${info.color}`}>{info.label}</span> : null
                  })}
                </div>

                {/* Nav flechas */}
                {allImages.length > 1 && (
                  <>
                    <button onClick={() => setActiveImg(i => (i-1+allImages.length)%allImages.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
                      style={{background:'rgba(14,10,6,0.65)', backdropFilter:'blur(8px)', border:'1px solid rgba(245,237,214,0.12)', color:'rgba(245,237,214,0.70)'}}>
                      <RiArrowLeftSLine size={20} />
                    </button>
                    <button onClick={() => setActiveImg(i => (i+1)%allImages.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
                      style={{background:'rgba(14,10,6,0.65)', backdropFilter:'blur(8px)', border:'1px solid rgba(245,237,214,0.12)', color:'rgba(245,237,214,0.70)'}}>
                      <RiArrowRightSLine size={20} />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex gap-3">
                  {allImages.map((img,i) => (
                    <button key={i} onClick={() => setActiveImg(i)}
                      className="w-16 h-16 rounded-xl overflow-hidden transition-all duration-200"
                      style={{
                        border: activeImg===i ? '2px solid #C9963A' : '2px solid transparent',
                        opacity: activeImg===i ? 1 : 0.45,
                        boxShadow: activeImg===i ? '0 0 16px rgba(201,150,58,0.40)' : 'none',
                      }}>
                      <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover"
                        onError={e => { e.target.src='https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&q=60' }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <motion.div initial={{opacity:0,x:24}} animate={{opacity:1,x:0}} transition={{duration:0.6}}>
              <p className="font-poppins text-[11px] tracking-[0.28em] uppercase mb-3" style={{color:'rgba(201,150,58,0.65)'}}>
                {product.category}
              </p>
              <h1 className="font-cormorant font-bold leading-tight mb-5" style={{color:'#F5EDD6', fontSize:'clamp(30px,4vw,48px)'}}>
                {product.name}
              </h1>

              {product.shortDescription && (
                <p className="font-poppins text-sm leading-relaxed mb-6" style={{color:'rgba(245,237,214,0.50)'}}>
                  {product.shortDescription}
                </p>
              )}

              {/* Precio */}
              <div className="flex items-center gap-4 mb-8">
                <span className="font-cormorant font-bold" style={{
                  fontSize:'clamp(36px,5vw,52px)',
                  background:'linear-gradient(135deg,#C9963A,#E8B86D)',
                  WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
                }}>
                  {formatPrice(product.price)}
                </span>
                {product.stock > 0 ? (
                  <span className="font-poppins text-xs px-3 py-1.5 rounded-full"
                    style={{background:'rgba(74,222,128,0.10)', border:'1px solid rgba(74,222,128,0.20)', color:'rgba(74,222,128,0.85)'}}>
                    {product.stock <= 5 ? `Últimas ${product.stock} unidades` : 'En stock'}
                  </span>
                ) : (
                  <span className="font-poppins text-xs px-3 py-1.5 rounded-full"
                    style={{background:'rgba(248,113,113,0.10)', border:'1px solid rgba(248,113,113,0.20)', color:'rgba(248,113,113,0.80)'}}>
                    Agotado
                  </span>
                )}
              </div>

              {/* Cantidad */}
              {product.stock > 0 && (
                <div className="flex items-center gap-4 mb-7">
                  <span className="font-poppins text-sm" style={{color:'rgba(245,237,214,0.50)'}}>Cantidad:</span>
                  <div className="flex items-center gap-3 rounded-xl p-1"
                    style={{background:'rgba(245,237,214,0.05)', border:'1px solid rgba(245,237,214,0.08)'}}>
                    <button onClick={() => setQty(q => Math.max(1,q-1))}
                      className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-200"
                      style={{color:'rgba(245,237,214,0.60)'}}
                      onMouseEnter={e => { e.currentTarget.style.background='rgba(245,237,214,0.08)'; e.currentTarget.style.color='#F5EDD6' }}
                      onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='rgba(245,237,214,0.60)' }}>
                      <RiSubtractLine size={16} />
                    </button>
                    <span className="w-8 text-center font-poppins font-bold text-lg" style={{color:'#F5EDD6'}}>{qty}</span>
                    <button onClick={() => setQty(q => Math.min(product.stock,q+1))}
                      className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-200"
                      style={{color:'rgba(245,237,214,0.60)'}}
                      onMouseEnter={e => { e.currentTarget.style.background='rgba(245,237,214,0.08)'; e.currentTarget.style.color='#F5EDD6' }}
                      onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='rgba(245,237,214,0.60)' }}>
                      <RiAddLine size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* CTA */}
              <button onClick={handleAdd} disabled={product.stock===0}
                className="btn-primary w-full text-base py-4 mb-5"
                style={{borderRadius:'14px'}}>
                <RiShoppingBagLine size={20} />
                {product.stock===0 ? 'Sin stock' : `Agregar – ${formatPrice(product.price * qty)}`}
              </button>

              <Link to="/catalogo"
                className="flex items-center gap-2 font-poppins text-sm transition-colors duration-200"
                style={{color:'rgba(245,237,214,0.30)'}}
                onMouseEnter={e => e.currentTarget.style.color='rgba(201,150,58,0.70)'}
                onMouseLeave={e => e.currentTarget.style.color='rgba(245,237,214,0.30)'}>
                <RiArrowLeftLine size={15} /> Seguir comprando
              </Link>

              {/* Descripción larga */}
              {product.longDescription && (
                <div className="mt-8 pt-8" style={{borderTop:'1px solid rgba(245,237,214,0.06)'}}>
                  <h3 className="font-cormorant font-semibold text-xl mb-4" style={{color:'#F5EDD6'}}>Descripción</h3>
                  <p className="font-poppins text-sm leading-relaxed whitespace-pre-line" style={{color:'rgba(245,237,214,0.45)'}}>
                    {product.longDescription}
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </>
  )
}
