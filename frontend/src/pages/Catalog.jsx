import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { RiSearchLine, RiCloseLine } from 'react-icons/ri'
import { productService } from '../services/productService'
import ProductCard from '../components/ProductCard'
import { ProductSkeleton } from '../components/Loader'

const CATEGORIES = [
  'Todos','Postres tradicionales','Chocolates','Bocaditos dulces','Bocaditos salados',
  'Pays','Desayunos sorpresa','Alfajores','Brownies','Tortas','Postres saludables','Regalos',
]

const S = { /* inline style helpers */
  page:   { background:'#0E0A06', minHeight:'100vh' },
  header: { background:'linear-gradient(180deg,rgba(14,10,6,0) 0%,rgba(22,16,10,0.95) 100%)', borderBottom:'1px solid rgba(201,150,58,0.08)' },
  chip:   (active) => ({
    padding:'8px 18px', borderRadius:'999px', cursor:'pointer', transition:'all .2s', fontFamily:'Poppins,sans-serif', fontSize:'13px', fontWeight:500,
    background: active ? 'linear-gradient(135deg,#C9963A,#E8B86D)' : 'rgba(245,237,214,0.05)',
    color:      active ? '#0E0A06' : 'rgba(245,237,214,0.50)',
    border:     active ? 'none' : '1px solid rgba(245,237,214,0.08)',
    boxShadow:  active ? '0 0 20px rgba(201,150,58,0.35)' : 'none',
  }),
  input: {
    width:'100%', padding:'12px 16px 12px 44px', borderRadius:'14px', outline:'none',
    fontFamily:'Poppins,sans-serif', fontSize:'14px', transition:'all .2s',
    background:'rgba(245,237,214,0.05)', border:'1px solid rgba(245,237,214,0.08)',
    color:'#F5EDD6',
  },
}

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')
  const [inputVal, setInputVal] = useState('')
  const catParam = searchParams.get('category') || 'Todos'
  const [activeCategory, setActiveCategory] = useState(catParam)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = { limit:60 }
      if (activeCategory !== 'Todos') params.category = activeCategory
      if (search) params.search = search
      const res = await productService.getAll(params)
      setProducts(res.data.products)
    } catch { setProducts([]) }
    finally { setLoading(false) }
  }, [activeCategory, search])

  useEffect(() => { fetchProducts() }, [fetchProducts])
  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat && cat !== activeCategory) setActiveCategory(cat)
  }, [searchParams])

  const handleCat = (cat) => {
    setActiveCategory(cat)
    if (cat === 'Todos') searchParams.delete('category')
    else searchParams.set('category', cat)
    setSearchParams(searchParams)
  }

  return (
    <>
      <Helmet>
        <title>Catálogo – Momentos Divertidos</title>
        <meta name="description" content="Explora nuestro catálogo de postres artesanales." />
      </Helmet>

      <div style={S.page}>
        {/* Header */}
        <div className="pt-28 pb-12 px-6 sm:px-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none"
            style={{background:'radial-gradient(ellipse at 50% 0%, rgba(201,150,58,0.12) 0%, transparent 65%)'}} />
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.8}}>
            <p className="font-poppins text-[11px] tracking-[0.32em] uppercase mb-4" style={{color:'rgba(201,150,58,0.70)'}}>
              Nuestra selección
            </p>
            <h1 className="font-cormorant font-bold mb-4" style={{color:'#F5EDD6', fontSize:'clamp(40px,6vw,72px)'}}>
              Catálogo completo
            </h1>
            <p className="font-poppins text-sm max-w-md mx-auto mb-8" style={{color:'rgba(245,237,214,0.40)'}}>
              Encuentra el postre perfecto para cada momento especial
            </p>

            {/* Search */}
            <div className="relative max-w-sm mx-auto">
              <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2" size={17} style={{color:'rgba(245,237,214,0.30)'}} />
              <input type="text" placeholder="Buscar postres..." value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                onKeyDown={e => e.key==='Enter' && setSearch(inputVal)}
                style={S.input}
                onFocus={e => { e.target.style.borderColor='rgba(201,150,58,0.35)'; e.target.style.background='rgba(245,237,214,0.08)' }}
                onBlur={e => { e.target.style.borderColor='rgba(245,237,214,0.08)'; e.target.style.background='rgba(245,237,214,0.05)' }}
              />
              {inputVal && (
                <button className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{color:'rgba(245,237,214,0.35)'}}
                  onClick={() => { setInputVal(''); setSearch('') }}>
                  <RiCloseLine size={17} />
                </button>
              )}
            </div>
          </motion.div>
        </div>

        <div className="max-w-6xl mx-auto px-6 sm:px-10 pb-24">
          {/* Chips categorías */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-10 scrollbar-thin" style={{scrollbarWidth:'thin'}}>
            {CATEGORIES.map(cat => (
              <motion.button key={cat} whileTap={{scale:0.94}}
                onClick={() => handleCat(cat)}
                style={S.chip(activeCategory === cat)}
                className="flex-shrink-0">
                {cat}
              </motion.button>
            ))}
          </div>

          {/* Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="font-poppins text-xs" style={{color:'rgba(245,237,214,0.30)'}}>
              {loading ? 'Cargando...' : `${products.length} producto${products.length!==1?'s':''} encontrado${products.length!==1?'s':''}`}
            </p>
            {search && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full font-poppins text-xs"
                style={{background:'rgba(201,150,58,0.10)', border:'1px solid rgba(201,150,58,0.20)', color:'rgba(201,150,58,0.80)'}}>
                "{search}"
                <button onClick={() => { setSearch(''); setInputVal('') }}><RiCloseLine size={13} /></button>
              </div>
            )}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {[...Array(8)].map((_,i) => <ProductSkeleton key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="text-center py-24">
              <p className="text-5xl mb-4">🍰</p>
              <h3 className="font-cormorant text-2xl mb-2" style={{color:'rgba(245,237,214,0.50)'}}>Sin resultados</h3>
              <p className="font-poppins text-sm mb-8" style={{color:'rgba(245,237,214,0.25)'}}>
                Prueba con otra categoría o búsqueda
              </p>
              <button onClick={() => { setActiveCategory('Todos'); setSearch(''); setInputVal('') }}
                className="btn-outline" style={{fontSize:'13px', padding:'10px 24px'}}>
                Ver todos los productos
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {products.map((p,i) => (
                <motion.div key={p._id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
                  transition={{delay:i*0.04, duration:0.5}}>
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
