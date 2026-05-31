import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { RiAddLine, RiEdit2Line, RiDeleteBinLine, RiSearchLine, RiEyeLine, RiEyeOffLine, RiStarFill } from 'react-icons/ri'
import { productService } from '../../services/productService'
import { formatPrice, getImageUrl, TAG_LABELS } from '../../utils/formatters'
import Loader from '../../components/Loader'
import toast from 'react-hot-toast'

const A = {
  card:'rgba(28,20,12,0.90)', border:'rgba(201,150,58,0.10)',
  text:'#F5EDD6', muted:'rgba(245,237,214,0.38)', gold:'#C9963A',
}

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [total,    setTotal]    = useState(0)
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')
  const [deleting, setDeleting] = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const res = await productService.getAllAdmin({ limit:60, ...(search ? {search} : {}) })
      setProducts(res.data.products); setTotal(res.data.total)
    } finally { setLoading(false) }
  }, [search])

  useEffect(() => { fetch() }, [fetch])

  const handleDelete = async (product) => {
    if (!window.confirm(`¿Eliminar "${product.name}"?`)) return
    setDeleting(product._id)
    try {
      await productService.delete(product._id)
      toast.success('Producto eliminado')
      setProducts(ps => ps.filter(p => p._id !== product._id))
    } catch { toast.error('Error al eliminar') }
    finally { setDeleting(null) }
  }

  return (
    <>
      <Helmet><title>Productos – Admin</title></Helmet>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="section-label mb-1">Gestión</p>
            <h1 className="font-cormorant font-bold text-3xl" style={{ color:A.text }}>
              Productos <span className="font-poppins text-base font-normal" style={{ color:A.muted }}>({total})</span>
            </h1>
          </div>
          <Link to="/admin/productos/nuevo" className="btn-primary self-start text-xs" style={{ padding:'10px 20px', borderRadius:'12px' }}>
            <RiAddLine size={16} /> Nuevo producto
          </Link>
        </div>

        {/* Search */}
        <div className="rounded-2xl p-4" style={{ background:A.card, border:`1px solid ${A.border}` }}>
          <div className="relative max-w-sm">
            <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2" size={16} style={{ color:A.muted }} />
            <input type="text" placeholder="Buscar producto..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-base pl-11 py-2.5" style={{ maxWidth:'320px' }} />
          </div>
        </div>

        {/* Tabla */}
        {loading ? <Loader /> : products.length === 0 ? (
          <div className="rounded-2xl p-16 text-center" style={{ background:A.card, border:`1px solid ${A.border}` }}>
            <p className="font-cormorant text-2xl mb-5" style={{ color:A.muted }}>No hay productos</p>
            <Link to="/admin/productos/nuevo" className="btn-primary inline-flex items-center gap-2 text-xs" style={{ padding:'10px 20px', borderRadius:'12px' }}>
              <RiAddLine size={15} /> Crear primer producto
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden" style={{ background:A.card, border:`1px solid ${A.border}` }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom:`1px solid ${A.border}` }}>
                    {['Producto','Categoría','Precio','Stock','Estado','Acciones'].map(h => (
                      <th key={h} className="text-left font-poppins text-[10px] font-semibold tracking-widest uppercase px-5 py-3"
                        style={{ color:'rgba(245,237,214,0.28)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((p, i) => (
                    <motion.tr key={p._id} layout initial={{opacity:0}} animate={{opacity:1}}
                      style={{ borderBottom: i < products.length-1 ? `1px solid rgba(245,237,214,0.04)` : 'none' }}
                      onMouseEnter={e => e.currentTarget.style.background='rgba(245,237,214,0.02)'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                      {/* Producto */}
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <img src={getImageUrl(p.mainImage)} alt={p.name}
                            className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                            style={{ background:'rgba(201,150,58,0.08)' }}
                            onError={e => { e.target.src='https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=80&q=60' }} />
                          <div>
                            <p className="font-poppins font-medium text-sm line-clamp-1" style={{ color:A.text }}>{p.name}</p>
                            <div className="flex items-center gap-1 mt-0.5">
                              {p.isFeatured && <RiStarFill size={11} style={{ color:A.gold }} />}
                              {p.tags?.slice(0,1).map(tag => {
                                const t = TAG_LABELS[tag]
                                return t ? <span key={tag} className="font-poppins text-[9px] font-semibold px-1.5 py-0.5 rounded-md" style={{ background:'rgba(201,150,58,0.12)', color:A.gold }}>{t.label}</span> : null
                              })}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 font-poppins text-xs" style={{ color:A.muted }}>{p.category}</td>
                      <td className="px-5 py-3 font-cormorant font-bold text-lg" style={{ color:A.gold }}>{formatPrice(p.price)}</td>
                      <td className="px-5 py-3">
                        <span className="font-poppins text-xs font-semibold px-2.5 py-1 rounded-full"
                          style={{
                            background: p.stock===0 ? 'rgba(248,113,113,0.12)' : p.stock<=5 ? 'rgba(251,191,36,0.12)' : 'rgba(74,222,128,0.12)',
                            color:      p.stock===0 ? 'rgba(248,113,113,0.85)' : p.stock<=5 ? 'rgba(251,191,36,0.85)' : 'rgba(74,222,128,0.85)',
                          }}>
                          {p.stock} uds
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1.5 font-poppins text-xs"
                          style={{ color: p.available ? 'rgba(74,222,128,0.75)' : 'rgba(245,237,214,0.28)' }}>
                          {p.available ? <><RiEyeLine size={13} /> Visible</> : <><RiEyeOffLine size={13} /> Oculto</>}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1">
                          <Link to={`/admin/productos/editar/${p._id}`}
                            className="p-2 rounded-lg transition-all duration-200"
                            style={{ color:A.muted }}
                            onMouseEnter={e => { e.currentTarget.style.background='rgba(201,150,58,0.10)'; e.currentTarget.style.color=A.gold }}
                            onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color=A.muted }}>
                            <RiEdit2Line size={16} />
                          </Link>
                          <button onClick={() => handleDelete(p)} disabled={deleting===p._id}
                            className="p-2 rounded-lg transition-all duration-200"
                            style={{ color:A.muted }}
                            onMouseEnter={e => { e.currentTarget.style.background='rgba(248,113,113,0.10)'; e.currentTarget.style.color='rgba(248,113,113,0.75)' }}
                            onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color=A.muted }}>
                            <RiDeleteBinLine size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
