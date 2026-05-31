import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import {
  RiArrowRightLine, RiWhatsappLine, RiStarFill,
  RiLeafLine, RiTruckLine, RiShieldCheckLine, RiArrowDownLine
} from 'react-icons/ri'
import { productService } from '../services/productService'
import { configService } from '../services/configService'
import ProductCard from '../components/ProductCard'
import { ProductSkeleton } from '../components/Loader'

const HERO_SLIDES = [
  'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=700&q=80',
  'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=1400&q=85',
  'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=1400&q=85',
  
]

const CATEGORIES = [
  { name:'Tortas',             img:'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=700&q=80', big:true  },
  { name:'Chocolates',         img:'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=500&q=80', big:false },
  { name:'Brownies',           img:'https://images.unsplash.com/photo-1515037893149-de7f840978e2?w=500&q=80', big:false },
  { name:'Alfajores',          img:'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=500&q=80', big:false },
  { name:'Regalos',            img:'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&q=80', big:false },
  { name:'Desayunos sorpresa', img:'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=500&q=80', big:false },
]

const PERKS = [
  { Icon:RiLeafLine,        label:'100% Artesanal',       desc:'Sin conservantes ni aditivos' },
  { Icon:RiStarFill,        label:'Calidad premium',       desc:'Ingredientes seleccionados' },
  { Icon:RiTruckLine,       label:'Delivery Moquegua',     desc:'Llega fresquito a tu puerta' },
  { Icon:RiShieldCheckLine, label:'Pedido garantizado',    desc:'Confirmación por WhatsApp' },
]

function FadeUp({ children, delay=0, className='' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once:true, margin:'-80px' })
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity:0, y:40 }}
      animate={inView ? { opacity:1, y:0 } : {}}
      transition={{ duration:0.85, delay, ease:[0.22,1,0.36,1] }}>
      {children}
    </motion.div>
  )
}

function Counter({ to, suffix='' }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once:true })
  useEffect(() => {
    if (!inView) return
    let n = 0
    const step = to / 55
    const t = setInterval(() => {
      n = Math.min(n + step, to)
      setVal(Math.floor(n))
      if (n >= to) clearInterval(t)
    }, 28)
    return () => clearInterval(t)
  }, [inView, to])
  return <span ref={ref}>{val}{suffix}</span>
}

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [config,   setConfig]   = useState(null)
  const [slide,    setSlide]    = useState(0)

  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start','end start'] })
  const imgY  = useTransform(scrollYProgress, [0,1], ['0%','28%'])
  const textY = useTransform(scrollYProgress, [0,1], ['0%','14%'])
  const fadeO = useTransform(scrollYProgress, [0,0.75], [1, 0])

  useEffect(() => {
    Promise.all([
      productService.getAll({ featured:true, limit:8 }),
      configService.get(),
    ]).then(([p,c]) => { setFeatured(p.data.products); setConfig(c.data) })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s+1) % HERO_SLIDES.length), 5500)
    return () => clearInterval(t)
  }, [])

  const wa = `https://wa.me/${config?.whatsappNumber || '975335798'}`

  return (
    <>
      <Helmet>
        <title>Momentos Divertidos – Postres y Regalos Dulces</title>
        <meta name="description" content="Postres artesanales premium en Moquegua. Tortas, chocolates, brownies y regalos dulces." />
      </Helmet>

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative h-screen min-h-[640px] overflow-hidden" style={{background:'#0E0A06'}}>

        {/* Fondo parallax */}
        <motion.div style={{ y:imgY }} className="absolute inset-0 scale-110">
          {HERO_SLIDES.map((src,i) => (
            <motion.div key={src} className="absolute inset-0"
              animate={{ opacity: i===slide ? 1 : 0 }}
              transition={{ duration:1.8, ease:'easeInOut' }}>
              <img src={src} alt="" className="w-full h-full object-cover" />
            </motion.div>
          ))}
          <div className="absolute inset-0" style={{background:'linear-gradient(105deg, rgba(14,10,6,0.97) 0%, rgba(14,10,6,0.70) 45%, rgba(14,10,6,0.15) 100%)'}} />
          <div className="absolute inset-0" style={{background:'linear-gradient(0deg, rgba(14,10,6,0.90) 0%, transparent 40%, rgba(14,10,6,0.30) 100%)'}} />
        </motion.div>

        {/* Blur orbs */}
        <div className="absolute top-1/3 right-1/3 w-80 h-80 pointer-events-none animate-float-slow"
          style={{background:'radial-gradient(ellipse, rgba(201,150,58,0.28) 0%, transparent 70%)', filter:'blur(48px)', borderRadius:'50%'}} />
        <div className="absolute bottom-1/4 left-1/4 w-56 h-56 pointer-events-none animate-float"
          style={{background:'radial-gradient(ellipse, rgba(180,80,80,0.18) 0%, transparent 70%)', filter:'blur(56px)', borderRadius:'50%'}} />

        {/* Texto */}
        <motion.div style={{ y:textY, opacity:fadeO }}
          className="relative z-10 h-full flex flex-col justify-center max-w-6xl mx-auto px-6 sm:px-10 pt-20">
          <motion.div initial={{ opacity:0, y:50 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:1.1, ease:[0.22,1,0.36,1] }}>

            <motion.div initial={{ opacity:0, x:-24 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.35 }}
              className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full"
              style={{ background:'rgba(201,150,58,0.10)', border:'1px solid rgba(201,150,58,0.22)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <span className="font-poppins text-[11px] tracking-[0.28em] uppercase" style={{color:'rgba(201,150,58,0.85)'}}>
                Postres Artesanales · Moquegua, Perú
              </span>
            </motion.div>

            <h1 className="font-cormorant font-light leading-[0.88] mb-6" style={{color:'#F5EDD6', fontSize:'clamp(54px,9vw,118px)'}}>
              Dulces que
              <br />
              <em className="font-bold italic" style={{
                fontSize:'clamp(62px,10vw,128px)',
                background:'linear-gradient(135deg, #C9963A, #F0D080, #C9963A)',
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
              }}>
                enamoran
              </em>
            </h1>

            <p className="font-poppins font-light text-lg leading-relaxed mb-10 max-w-md"
              style={{color:'rgba(245,237,214,0.50)', letterSpacing:'0.01em'}}>
              Tortas, chocolates y regalos dulces elaborados con amor para hacer de cada momento algo extraordinario.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/catalogo" className="btn-primary">
                Explorar catálogo <RiArrowRightLine size={17} />
              </Link>
              <a href={`${wa}?text=Hola! Quiero hacer un pedido`} target="_blank" rel="noopener noreferrer"
                className="btn-ghost">
                <RiWhatsappLine size={17} /> WhatsApp
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* Dots slide */}
        <div className="absolute bottom-10 left-6 sm:left-10 flex gap-2 z-10">
          {HERO_SLIDES.map((_,i) => (
            <button key={i} onClick={() => setSlide(i)}
              className="rounded-full transition-all duration-500"
              style={{ width:i===slide?'32px':'7px', height:'7px',
                background:i===slide?'#C9963A':'rgba(201,150,58,0.28)' }} />
          ))}
        </div>

        {/* Scroll hint */}
        <motion.div animate={{ y:[0,9,0] }} transition={{ duration:2.2, repeat:Infinity }}
          className="absolute bottom-10 right-8 z-10 flex flex-col items-center gap-2 opacity-30">
          <RiArrowDownLine style={{color:'#F5EDD6'}} size={18} />
        </motion.div>
      </section>

      {/* ── PERKS glass strip ── */}
      <section className="relative z-10 -mt-12 px-6 sm:px-10 mb-0">
        <FadeUp className="max-w-5xl mx-auto">
          <div className="rounded-2xl px-4 py-5 grid grid-cols-2 md:grid-cols-4 gap-px"
            style={{
              background:'rgba(14,10,6,0.65)',
              backdropFilter:'blur(24px) saturate(180%)',
              WebkitBackdropFilter:'blur(24px) saturate(180%)',
              border:'1px solid rgba(201,150,58,0.14)',
              boxShadow:'0 8px 48px rgba(0,0,0,0.5)',
            }}>
            {PERKS.map(({ Icon, label, desc }) => (
              <div key={label} className="flex flex-col items-center text-center gap-2 p-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{background:'rgba(201,150,58,0.12)', border:'1px solid rgba(201,150,58,0.2)'}}>
                  <Icon className="text-gold" size={18} />
                </div>
                <p className="font-cormorant font-semibold text-base leading-tight" style={{color:'#F5EDD6'}}>{label}</p>
                <p className="font-poppins text-[11px]" style={{color:'rgba(245,237,214,0.38)'}}>{desc}</p>
              </div>
            ))}
          </div>
        </FadeUp>
      </section>

      {/* ── STATS ── */}
      <section className="py-28 max-w-6xl mx-auto px-6 sm:px-10">
        <FadeUp>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[{to:500,suffix:'+',label:'Pedidos'},{to:11,suffix:'',label:'Categorías'},{to:100,suffix:'%',label:'Artesanal'}].map(({to,suffix,label})=>(
              <div key={label}>
                <p className="font-cormorant font-bold text-gold" style={{fontSize:'clamp(42px,6vw,76px)'}}>
                  <Counter to={to} suffix={suffix} />
                </p>
                <p className="font-poppins text-[11px] tracking-[0.28em] uppercase mt-2" style={{color:'rgba(245,237,214,0.30)'}}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </FadeUp>
      </section>

      {/* ── CATEGORÍAS editorial grid ── */}
      <section className="pb-28 max-w-6xl mx-auto px-6 sm:px-10">
        <FadeUp className="mb-14">
          <p className="section-label mb-4">Colecciones</p>
          <div className="flex items-end justify-between gap-6">
            <h2 className="font-cormorant font-bold leading-none" style={{color:'#F5EDD6', fontSize:'clamp(36px,5vw,68px)'}}>
              Nuestras<br />categorías
            </h2>
            <Link to="/catalogo" className="btn-outline shrink-0" style={{fontSize:'12px',padding:'10px 20px'}}>
              Ver todo <RiArrowRightLine size={14} />
            </Link>
          </div>
        </FadeUp>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4" style={{gridAutoRows:'200px'}}>
          {CATEGORIES.map(({ name, img, big }, i) => (
            <FadeUp key={name} delay={i * 0.07}
              className={big ? 'col-span-2 row-span-2' : ''}>
              <Link to={`/catalogo?category=${encodeURIComponent(name)}`}
                className="block relative overflow-hidden rounded-2xl h-full group">
                <img src={img} alt={name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
                <div className="absolute inset-0 transition-opacity duration-500"
                  style={{background:'linear-gradient(0deg, rgba(14,10,6,0.82) 0%, rgba(14,10,6,0.15) 60%, transparent 100%)'}} />

                {/* Hover blur pill */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="px-5 py-2.5 rounded-full text-xs tracking-widest uppercase font-poppins font-semibold"
                    style={{
                      background:'rgba(201,150,58,0.20)',
                      backdropFilter:'blur(16px)',
                      WebkitBackdropFilter:'blur(16px)',
                      border:'1px solid rgba(201,150,58,0.35)',
                      color:'#F0D080',
                    }}>
                    Ver productos
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                  <p className="font-poppins text-[10px] tracking-[0.25em] uppercase mb-1.5" style={{color:'rgba(201,150,58,0.70)'}}>
                    Categoría
                  </p>
                  <h3 className="font-cormorant font-bold text-cream leading-tight"
                    style={{fontSize: big ? 'clamp(24px,3vw,36px)' : 'clamp(18px,2.5vw,24px)'}}>
                    {name}
                  </h3>
                </div>

                {/* Gold line bottom reveal */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                  style={{background:'linear-gradient(90deg, transparent, #C9963A, transparent)'}} />
              </Link>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── PRODUCTOS DESTACADOS ── */}
      <section className="pb-28" style={{background:'linear-gradient(180deg,#0E0A06 0%,#16100A 100%)'}}>
        <div className="max-w-6xl mx-auto px-6 sm:px-10">
          <FadeUp className="pt-24 mb-14">
            <p className="section-label mb-4">Selección especial</p>
            <h2 className="font-cormorant font-bold" style={{color:'#F5EDD6', fontSize:'clamp(36px,5vw,68px)'}}>
              Más destacados
            </h2>
          </FadeUp>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[...Array(4)].map((_,i) => <ProductSkeleton key={i} />)}
            </div>
          ) : featured.length === 0 ? (
            <p className="text-center font-cormorant text-2xl" style={{color:'rgba(245,237,214,0.25)'}}>
              Próximamente nuevos productos
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featured.map((p,i) => (
                <FadeUp key={p._id} delay={i * 0.08}><ProductCard product={p} /></FadeUp>
              ))}
            </div>
          )}

          <FadeUp className="text-center mt-14">
            <Link to="/catalogo" className="btn-outline">
              Ver catálogo completo <RiArrowRightLine size={16} />
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-8 px-6 sm:px-10">
        <FadeUp className="max-w-6xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl" style={{minHeight:'380px'}}>
            <img src="https://images.unsplash.com/photo-1488477181946-6428a0291777?w=1400&q=80"
              alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0"
              style={{background:'linear-gradient(105deg, rgba(14,10,6,0.97) 0%, rgba(14,10,6,0.82) 45%, rgba(14,10,6,0.35) 100%)'}} />
            {/* blur glow */}
            <div className="absolute top-1/2 right-1/3 -translate-y-1/2 w-72 h-72 pointer-events-none"
              style={{background:'radial-gradient(ellipse, rgba(201,150,58,0.25) 0%, transparent 70%)', filter:'blur(48px)', borderRadius:'50%'}} />
            <div className="relative z-10 flex flex-col justify-center h-full p-10 sm:p-16" style={{minHeight:'380px'}}>
              <p className="section-label mb-4">Pedidos especiales</p>
              <h3 className="font-cormorant font-bold leading-tight mb-4"
                style={{color:'#F5EDD6', fontSize:'clamp(30px,4vw,58px)'}}>
                ¿Tienes una<br />ocasión especial?
              </h3>
              <p className="font-poppins text-sm leading-relaxed mb-8 max-w-sm"
                style={{color:'rgba(245,237,214,0.45)'}}>
                Diseñamos el postre perfecto para cumpleaños, bodas, baby showers o cualquier celebración.
              </p>
              <a href={`${wa}?text=Hola! Quiero un pedido personalizado`}
                target="_blank" rel="noopener noreferrer"
                className="btn-primary self-start">
                <RiWhatsappLine size={17} /> Escribirnos ahora
              </a>
            </div>
          </div>
        </FadeUp>
      </section>

      {/* ── MARQUEE ── */}
      <div className="py-14 overflow-hidden my-16" style={{borderTop:'1px solid rgba(201,150,58,0.08)', borderBottom:'1px solid rgba(201,150,58,0.08)'}}>
        <motion.div animate={{ x:['0%','-50%'] }} transition={{ duration:25, repeat:Infinity, ease:'linear' }}
          className="flex whitespace-nowrap gap-14">
          {[...Array(8)].map((_,i) => (
            <span key={i} className="font-cormorant font-bold shrink-0"
              style={{ fontSize:'clamp(36px,5vw,60px)', color: i%2===0 ? 'rgba(201,150,58,0.10)' : 'rgba(245,237,214,0.04)' }}>
              Tortas · Chocolates · Brownies · Alfajores · Regalos · Desayunos ·&nbsp;
            </span>
          ))}
        </motion.div>
      </div>
    </>
  )
}
