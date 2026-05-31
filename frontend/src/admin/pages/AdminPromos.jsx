import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { RiAddLine, RiEdit2Line, RiDeleteBinLine, RiEyeLine, RiEyeOffLine, RiCloseLine, RiSaveLine, RiMegaphoneLine } from 'react-icons/ri'
import { promoService } from '../../services/promoService'
import Loader from '../../components/Loader'
import toast from 'react-hot-toast'

const A = {
  card:'rgba(28,20,12,0.90)', border:'rgba(201,150,58,0.10)',
  text:'#F5EDD6', muted:'rgba(245,237,214,0.38)', gold:'#C9963A',
}

const BG_OPTS = [
  { value:'#3D2314', label:'🟫 Chocolate' },
  { value:'#1a1a2e', label:'🟣 Azul noche' },
  { value:'#0d2137', label:'🔵 Azul profundo' },
  { value:'#1a2e1a', label:'🟢 Verde bosque' },
  { value:'#2e1a2e', label:'💜 Violeta' },
  { value:'#2e1a1a', label:'🔴 Rojo oscuro' },
]

const THEMES = {
  '#3D2314':{ text:'#F5EDD6', accent:'#C9963A', sub:'rgba(245,237,214,0.55)' },
  '#1a1a2e':{ text:'#e8e8ff', accent:'#a78bfa', sub:'rgba(232,232,255,0.55)' },
  '#0d2137':{ text:'#e0f0ff', accent:'#60a5fa', sub:'rgba(224,240,255,0.55)' },
  '#1a2e1a':{ text:'#e0ffe0', accent:'#4ade80', sub:'rgba(224,255,224,0.55)' },
  '#2e1a2e':{ text:'#ffe0ff', accent:'#e879f9', sub:'rgba(255,224,255,0.55)' },
  '#2e1a1a':{ text:'#ffe8e8', accent:'#f87171', sub:'rgba(255,232,232,0.55)' },
}

const EMPTY = { title:'', subtitle:'', description:'', badgeText:'', ctaLabel:'Ver más', ctaUrl:'/catalogo', bgColor:'#3D2314', active:true, priority:0, startsAt:'', endsAt:'' }

function PromoPreview({ promo }) {
  const t = THEMES[promo.bgColor] || THEMES['#3D2314']
  return (
    <div className="rounded-2xl overflow-hidden p-5 relative" style={{ background:promo.bgColor, border:`1px solid ${t.accent}25`, minHeight:'130px' }}>
      <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full pointer-events-none"
        style={{ background:`radial-gradient(circle,${t.accent}20 0%,transparent 70%)`, filter:'blur(16px)' }} />
      {promo.badgeText && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-poppins text-[10px] font-semibold tracking-wider uppercase mb-3"
          style={{ background:`${t.accent}20`, border:`1px solid ${t.accent}35`, color:t.accent }}>
          ★ {promo.badgeText}
        </span>
      )}
      <h4 className="font-cormorant font-bold text-xl leading-tight mb-1" style={{ color:t.text }}>
        {promo.title || 'Título del anuncio'}
      </h4>
      {promo.subtitle && <p className="font-poppins text-xs font-semibold mb-1" style={{ color:t.accent }}>{promo.subtitle}</p>}
      {promo.description && <p className="font-poppins text-xs leading-relaxed mb-3" style={{ color:t.sub, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{promo.description}</p>}
      <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-poppins font-semibold"
        style={{ background:`linear-gradient(135deg,${t.accent},${t.accent}cc)`, color:'#0E0A06' }}>
        {promo.ctaLabel||'Ver más'} →
      </div>
    </div>
  )
}

function PromoModal({ promo, onClose, onSave }) {
  const [form,    setForm]    = useState(promo || EMPTY)
  const [loading, setLoading] = useState(false)
  const f = key => e => setForm(p => ({ ...p, [key]: e.target.value }))

  const inStyle = {
    width:'100%', padding:'10px 14px', borderRadius:'10px', outline:'none',
    fontFamily:'Poppins,sans-serif', fontSize:'13px', transition:'all .2s',
    background:'rgba(245,237,214,0.05)', border:'1px solid rgba(201,150,58,0.18)',
    color:A.text,
  }
  const label = (txt) => (
    <label className="block font-poppins text-[10px] font-semibold tracking-widest uppercase mb-1.5" style={{ color:A.muted }}>{txt}</label>
  )

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error('El título es requerido'); return }
    setLoading(true)
    try {
      const data = { ...form, priority:Number(form.priority)||0, startsAt:form.startsAt||null, endsAt:form.endsAt||null }
      if (promo?._id) { const r = await promoService.update(promo._id, data); onSave(r.data,'update'); toast.success('Anuncio actualizado ✅') }
      else             { const r = await promoService.create(data);            onSave(r.data,'create'); toast.success('Anuncio creado ✅')    }
      onClose()
    } catch { toast.error('Error al guardar') }
    finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose}
        className="absolute inset-0" style={{ background:'rgba(0,0,0,0.80)', backdropFilter:'blur(12px)' }} />
      <motion.div initial={{opacity:0,scale:0.92,y:24}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.94}}
        transition={{type:'spring',damping:22,stiffness:200}}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-thin rounded-3xl"
        style={{ background:'#130E08', border:`1px solid ${A.border}`, boxShadow:'0 30px 80px rgba(0,0,0,0.70)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom:`1px solid ${A.border}` }}>
          <h2 className="font-cormorant font-bold text-2xl" style={{ color:A.text }}>
            {promo?._id ? 'Editar anuncio' : 'Nuevo anuncio'}
          </h2>
          <button onClick={onClose} className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
            style={{ background:'rgba(245,237,214,0.05)', border:`1px solid ${A.border}`, color:A.muted }}
            onMouseEnter={e => e.currentTarget.style.color=A.text}
            onMouseLeave={e => e.currentTarget.style.color=A.muted}>
            <RiCloseLine size={18} />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Form */}
          <div className="space-y-4">
            <div>{label('Título *')}<input value={form.title} onChange={f('title')} placeholder="Ej: Aprovecha el 2x1 en Tortas" style={inStyle} onFocus={e=>e.target.style.borderColor=A.gold} onBlur={e=>e.target.style.borderColor='rgba(201,150,58,0.18)'} /></div>
            <div>{label('Subtítulo')}<input value={form.subtitle} onChange={f('subtitle')} placeholder="Solo por este fin de semana" style={inStyle} onFocus={e=>e.target.style.borderColor=A.gold} onBlur={e=>e.target.style.borderColor='rgba(201,150,58,0.18)'} /></div>
            <div>{label('Descripción')}<textarea rows={3} value={form.description} onChange={f('description')} placeholder="Condiciones del anuncio..." style={{...inStyle,resize:'none'}} onFocus={e=>e.target.style.borderColor=A.gold} onBlur={e=>e.target.style.borderColor='rgba(201,150,58,0.18)'} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div>{label('Badge ("2x1")')}<input value={form.badgeText} onChange={f('badgeText')} placeholder="2x1" style={inStyle} onFocus={e=>e.target.style.borderColor=A.gold} onBlur={e=>e.target.style.borderColor='rgba(201,150,58,0.18)'} /></div>
              <div>{label('Prioridad')}<input type="number" min={0} value={form.priority} onChange={f('priority')} style={inStyle} onFocus={e=>e.target.style.borderColor=A.gold} onBlur={e=>e.target.style.borderColor='rgba(201,150,58,0.18)'} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>{label('Texto botón')}<input value={form.ctaLabel} onChange={f('ctaLabel')} placeholder="Ver más" style={inStyle} onFocus={e=>e.target.style.borderColor=A.gold} onBlur={e=>e.target.style.borderColor='rgba(201,150,58,0.18)'} /></div>
              <div>{label('URL botón')}<input value={form.ctaUrl} onChange={f('ctaUrl')} placeholder="/catalogo" style={inStyle} onFocus={e=>e.target.style.borderColor=A.gold} onBlur={e=>e.target.style.borderColor='rgba(201,150,58,0.18)'} /></div>
            </div>
            {/* Color */}
            <div>{label('Color de fondo')}
              <select value={form.bgColor} onChange={f('bgColor')} style={{...inStyle,cursor:'pointer',appearance:'none'}}>
                {BG_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>{label('Válido desde')}<input type="date" value={form.startsAt?.split('T')[0]||''} onChange={f('startsAt')} style={inStyle} /></div>
              <div>{label('Válido hasta')}<input type="date" value={form.endsAt?.split('T')[0]||''} onChange={f('endsAt')} style={inStyle} /></div>
            </div>
            {/* Toggle activo */}
            <label className="flex items-center gap-3 cursor-pointer">
              <div onClick={() => setForm(p => ({ ...p, active:!p.active }))}
                className="w-11 h-6 rounded-full transition-colors relative"
                style={{ background: form.active ? A.gold : 'rgba(245,237,214,0.12)' }}>
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.active ? 'translate-x-5' : ''}`} />
              </div>
              <span className="font-poppins text-sm" style={{ color:A.text }}>
                {form.active ? 'Activo (visible en tienda)' : 'Inactivo'}
              </span>
            </label>
          </div>

          {/* Preview */}
          <div>
            <p className="font-poppins text-[10px] font-semibold tracking-widest uppercase mb-3" style={{ color:A.muted }}>Vista previa</p>
            <PromoPreview promo={form} />
            <p className="font-poppins text-xs text-center mt-3" style={{ color:'rgba(245,237,214,0.22)' }}>Así se verá el popup</p>
          </div>
        </div>

        <div className="px-6 pb-6 flex items-center justify-end gap-3" style={{ borderTop:`1px solid ${A.border}`, paddingTop:'16px' }}>
          <button onClick={onClose} className="font-poppins text-sm transition-colors px-4 py-2"
            style={{ color:A.muted }} onMouseEnter={e=>e.currentTarget.style.color=A.text} onMouseLeave={e=>e.currentTarget.style.color=A.muted}>
            Cancelar
          </button>
          <button onClick={handleSave} disabled={loading} className="btn-primary text-xs" style={{ padding:'10px 22px', borderRadius:'12px' }}>
            {loading ? <><span className="w-3.5 h-3.5 border-2 border-night/30 border-t-night rounded-full animate-spin" />Guardando...</> : <><RiSaveLine size={15} />{promo?._id ? 'Guardar' : 'Crear anuncio'}</>}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default function AdminPromos() {
  const [promos,  setPromos]  = useState([])
  const [loading, setLoading] = useState(true)
  const [modal,   setModal]   = useState(null)

  useEffect(() => {
    promoService.getAll()
      .then(res => setPromos(res.data))
      .catch(() => toast.error('Error al cargar los anuncios'))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = (saved, mode) => setPromos(prev =>
    mode === 'create' ? [saved, ...prev] : prev.map(p => p._id === saved._id ? saved : p)
  )

  const handleToggle = async (promo) => {
    try {
      const r = await promoService.update(promo._id, { active:!promo.active })
      setPromos(prev => prev.map(p => p._id === promo._id ? r.data : p))
      toast.success(r.data.active ? 'Anuncio activado' : 'Anuncio desactivado')
    } catch { toast.error('Error') }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este anuncio?')) return
    try {
      await promoService.delete(id)
      setPromos(prev => prev.filter(p => p._id !== id))
      toast.success('Eliminado')
    } catch { toast.error('Error al eliminar') }
  }

  return (
    <>
      <Helmet><title>Anuncios – Admin</title></Helmet>
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="section-label mb-1">Gestión</p>
            <h1 className="font-cormorant font-bold text-3xl flex items-center gap-2" style={{ color:A.text }}>
              <RiMegaphoneLine style={{ color:A.gold }} size={26} /> Anuncios & Popups
            </h1>
          </div>
          <button onClick={() => setModal('new')} className="btn-primary self-start text-xs" style={{ padding:'10px 20px', borderRadius:'12px' }}>
            <RiAddLine size={16} /> Nuevo anuncio
          </button>
        </div>

        {/* Info */}
        <div className="rounded-2xl p-4 flex gap-3" style={{ background:'rgba(201,150,58,0.06)', border:'1px solid rgba(201,150,58,0.14)' }}>
          <span style={{ color:A.gold }}>💡</span>
          <p className="font-poppins text-sm leading-relaxed" style={{ color:'rgba(245,237,214,0.55)' }}>
            El popup aparece automáticamente al entrar a la tienda, una vez por sesión. Si hay varios activos, se muestran en carrusel por prioridad.
          </p>
        </div>

        {/* Lista */}
        {loading ? <Loader /> : promos.length === 0 ? (
          <div className="rounded-2xl p-16 text-center" style={{ background:A.card, border:`1px solid ${A.border}` }}>
            <RiMegaphoneLine size={48} style={{ color:'rgba(245,237,214,0.10)', margin:'0 auto 12px' }} />
            <p className="font-cormorant text-2xl mb-2" style={{ color:A.muted }}>Sin anuncios creados</p>
            <p className="font-poppins text-sm mb-6" style={{ color:'rgba(245,237,214,0.25)' }}>Crea tu primer anuncio para informar promociones</p>
            <button onClick={() => setModal('new')} className="btn-primary inline-flex items-center gap-2 text-xs" style={{ padding:'10px 20px', borderRadius:'12px' }}>
              <RiAddLine size={15} /> Crear primer anuncio
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {promos.map(promo => (
                <motion.div key={promo._id} layout initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,scale:0.95}}
                  className="rounded-2xl overflow-hidden" style={{ background:A.card, border:`1px solid ${A.border}` }}>
                  <div className="p-4"><PromoPreview promo={promo} /></div>
                  <div className="px-4 pb-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ background: promo.active ? '#4ade80' : 'rgba(245,237,214,0.20)' }} />
                      <span className="font-poppins text-xs" style={{ color:A.muted }}>
                        {promo.active ? 'Activo' : 'Inactivo'}{promo.priority > 0 && ` · P${promo.priority}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[
                        { Icon: promo.active ? RiEyeOffLine : RiEyeLine, fn:()=>handleToggle(promo), hoverColor:'rgba(201,150,58,0.75)' },
                        { Icon: RiEdit2Line,    fn:()=>setModal(promo),       hoverColor:A.gold },
                        { Icon: RiDeleteBinLine,fn:()=>handleDelete(promo._id),hoverColor:'rgba(248,113,113,0.75)' },
                      ].map(({ Icon, fn, hoverColor }, i) => (
                        <button key={i} onClick={fn}
                          className="p-2 rounded-lg transition-all duration-200"
                          style={{ color:A.muted }}
                          onMouseEnter={e => { e.currentTarget.style.color=hoverColor; e.currentTarget.style.background='rgba(245,237,214,0.04)' }}
                          onMouseLeave={e => { e.currentTarget.style.color=A.muted; e.currentTarget.style.background='transparent' }}>
                          <Icon size={16} />
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <AnimatePresence>
        {modal !== null && (
          <PromoModal promo={modal==='new'?null:modal} onClose={() => setModal(null)} onSave={handleSave} />
        )}
      </AnimatePresence>
    </>
  )
}
