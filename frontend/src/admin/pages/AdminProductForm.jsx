import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'
import { RiUploadLine, RiCloseLine, RiArrowLeftLine, RiSaveLine } from 'react-icons/ri'
import { productService } from '../../services/productService'
import { getImageUrl } from '../../utils/formatters'
import Loader from '../../components/Loader'
import toast from 'react-hot-toast'

const A = {
  card:'rgba(28,20,12,0.90)', border:'rgba(201,150,58,0.10)',
  text:'#F5EDD6', muted:'rgba(245,237,214,0.38)', gold:'#C9963A',
}

const CATEGORIES = [
  'Postres tradicionales','Chocolates','Bocaditos dulces','Bocaditos salados',
  'Pays','Desayunos sorpresa','Alfajores','Brownies','Tortas','Postres saludables','Regalos',
]
const TAGS = [
  { value:'nuevo',           label:'Nuevo' },
  { value:'oferta',          label:'Oferta' },
  { value:'mas_vendido',     label:'Más vendido' },
  { value:'ultimas_unidades',label:'Últimas unidades' },
]

/* ── Inputs oscuros reutilizables ── */
function Field({ label, error, children }) {
  return (
    <div>
      {label && <label className="block font-poppins text-[11px] font-medium tracking-wider uppercase mb-1.5" style={{ color:A.muted }}>{label}</label>}
      {children}
      {error && <p className="font-poppins text-xs mt-1" style={{ color:'rgba(248,113,113,0.80)' }}>{error}</p>}
    </div>
  )
}

/* ── Toggle ── */
function Toggle({ value, onChange, label }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div onClick={onChange} className="w-11 h-6 rounded-full transition-colors relative flex-shrink-0"
        style={{ background: value ? A.gold : 'rgba(245,237,214,0.12)' }}>
        <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${value ? 'translate-x-5' : ''}`} />
      </div>
      <span className="font-poppins text-sm" style={{ color:A.text }}>{label}</span>
    </label>
  )
}

export default function AdminProductForm() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const [loading,     setLoading]     = useState(false)
  const [fetchLoading,setFetchLoading]= useState(isEdit)

  const [form, setForm] = useState({
    name:'', price:'', shortDescription:'', longDescription:'',
    stock:'', category:'', tags:[], available:true, isFeatured:false,
  })
  const [errors, setErrors] = useState({})

  // Imágenes
  const [mainFile,    setMainFile]    = useState(null)
  const [mainPreview, setMainPreview] = useState('')
  const [addFiles,    setAddFiles]    = useState([])
  const [addPreviews, setAddPreviews] = useState([])
  const [existMain,   setExistMain]   = useState('')
  const [existAdd,    setExistAdd]    = useState([])

  useEffect(() => {
    if (!isEdit) return
    productService.getById(id).then(res => {
      const p = res.data
      setForm({ name:p.name, price:p.price, shortDescription:p.shortDescription||'',
        longDescription:p.longDescription||'', stock:p.stock, category:p.category,
        tags:p.tags||[], available:p.available, isFeatured:p.isFeatured })
      setExistMain(p.mainImage||'')
      setExistAdd(p.additionalImages||[])
    }).catch(() => toast.error('No se pudo cargar el producto'))
      .finally(() => setFetchLoading(false))
  }, [id, isEdit])

  const onDropMain = useCallback((files) => {
    const f = files[0]; if (!f) return
    setMainFile(f); setMainPreview(URL.createObjectURL(f)); setExistMain('')
  }, [])
  const onDropAdd = useCallback((files) => {
    const slots = 3 - existAdd.length - addFiles.length
    const toAdd = files.slice(0, slots)
    setAddFiles(p => [...p, ...toAdd])
    setAddPreviews(p => [...p, ...toAdd.map(f => URL.createObjectURL(f))])
  }, [addFiles, existAdd])

  const { getRootProps:mRoot, getInputProps:mInput, isDragActive:mDrag } = useDropzone({ onDrop:onDropMain, accept:{'image/*':[]}, maxFiles:1 })
  const { getRootProps:aRoot, getInputProps:aInput, isDragActive:aDrag } = useDropzone({
    onDrop:onDropAdd, accept:{'image/*':[]},
    maxFiles: 3 - existAdd.length - addFiles.length,
    disabled: existAdd.length + addFiles.length >= 3,
  })

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Requerido'
    if (!form.price || isNaN(form.price)) e.price = 'Precio inválido'
    if (!form.category) e.category = 'Requerido'
    setErrors(e); return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      const fd = new FormData()
      Object.entries({ name:form.name, price:form.price, shortDescription:form.shortDescription,
        longDescription:form.longDescription, stock:form.stock||0, category:form.category,
        available:form.available, isFeatured:form.isFeatured }).forEach(([k,v]) => fd.append(k, v))
      fd.append('tags', JSON.stringify(form.tags))
      if (mainFile) fd.append('mainImage', mainFile)
      addFiles.forEach(f => fd.append('additionalImages', f))
      if (isEdit) {
        fd.append('keepImages', JSON.stringify(existAdd))
        await productService.update(id, fd)
        toast.success('Producto actualizado ✅')
      } else {
        await productService.create(fd)
        toast.success('Producto creado ✅')
      }
      navigate('/admin/productos')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al guardar')
    } finally { setLoading(false) }
  }

  const f = key => e => setForm(p => ({ ...p, [key]: e.target.value }))
  const toggleTag = tag => setForm(p => ({
    ...p, tags: p.tags.includes(tag) ? p.tags.filter(t=>t!==tag) : [...p.tags, tag]
  }))

  const dropZoneStyle = (active) => ({
    border: `1px dashed ${active ? A.gold : 'rgba(201,150,58,0.22)'}`,
    background: active ? 'rgba(201,150,58,0.06)' : 'rgba(245,237,214,0.02)',
    borderRadius:'14px', padding:'24px', textAlign:'center', cursor:'pointer',
    transition:'all .2s',
  })

  if (fetchLoading) return <Loader />

  return (
    <>
      <Helmet><title>{isEdit ? 'Editar producto' : 'Nuevo producto'} – Admin</title></Helmet>

      <div className="space-y-5 max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin/productos')}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
            style={{ background:'rgba(245,237,214,0.05)', border:`1px solid ${A.border}`, color:A.muted }}
            onMouseEnter={e => e.currentTarget.style.color=A.text}
            onMouseLeave={e => e.currentTarget.style.color=A.muted}>
            <RiArrowLeftLine size={18} />
          </button>
          <div>
            <p className="section-label mb-0.5">Gestión</p>
            <h1 className="font-cormorant font-bold text-3xl" style={{ color:A.text }}>
              {isEdit ? 'Editar producto' : 'Nuevo producto'}
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Formulario */}
          <div className="lg:col-span-2 space-y-4">
            {/* Info básica */}
            <div className="rounded-2xl p-6 space-y-4" style={{ background:A.card, border:`1px solid ${A.border}` }}>
              <h2 className="font-cormorant font-semibold text-xl" style={{ color:A.text }}>Información básica</h2>
              <Field label="Nombre *" error={errors.name}>
                <input value={form.name} onChange={f('name')} placeholder="Ej: Torta de chocolate 3 pisos" className="input-base" />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Precio (S/) *" error={errors.price}>
                  <input type="number" min="0" step="0.50" value={form.price} onChange={f('price')} placeholder="0.00" className="input-base" />
                </Field>
                <Field label="Stock">
                  <input type="number" min="0" value={form.stock} onChange={f('stock')} placeholder="0" className="input-base" />
                </Field>
              </div>
              <Field label="Categoría *" error={errors.category}>
                <select value={form.category} onChange={f('category')} className="input-base"
                  style={{ appearance:'none', cursor:'pointer' }}>
                  <option value="">Seleccionar categoría...</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Descripción corta">
                <input maxLength={200} value={form.shortDescription} onChange={f('shortDescription')}
                  placeholder="Resumen breve del producto" className="input-base" />
              </Field>
              <Field label="Descripción larga">
                <textarea rows={5} value={form.longDescription} onChange={f('longDescription')}
                  placeholder="Descripción completa, ingredientes, personalizaciones..."
                  className="input-base" style={{ resize:'none' }} />
              </Field>
            </div>

            {/* Imágenes */}
            <div className="rounded-2xl p-6 space-y-5" style={{ background:A.card, border:`1px solid ${A.border}` }}>
              <h2 className="font-cormorant font-semibold text-xl" style={{ color:A.text }}>Imágenes</h2>

              {/* Principal */}
              <Field label="Imagen principal">
                {(mainPreview || existMain) ? (
                  <div className="relative w-32 h-32">
                    <img src={mainPreview || getImageUrl(existMain)} alt=""
                      className="w-32 h-32 object-cover rounded-2xl" style={{ border:`1px solid ${A.border}` }} />
                    <button onClick={() => { setMainFile(null); setMainPreview(''); setExistMain('') }}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ background:'rgba(248,113,113,0.85)', color:'white' }}>
                      <RiCloseLine size={13} />
                    </button>
                  </div>
                ) : (
                  <div {...mRoot()} style={dropZoneStyle(mDrag)}>
                    <input {...mInput()} />
                    <RiUploadLine size={22} style={{ color:A.muted, margin:'0 auto 8px' }} />
                    <p className="font-poppins text-sm" style={{ color:A.muted }}>Arrastra o haz clic</p>
                  </div>
                )}
              </Field>

              {/* Adicionales */}
              <Field label="Imágenes adicionales (hasta 3)">
                <div className="flex flex-wrap gap-3">
                  {existAdd.map((img,i) => (
                    <div key={`ex-${i}`} className="relative w-20 h-20">
                      <img src={getImageUrl(img)} alt="" className="w-20 h-20 object-cover rounded-xl" style={{ border:`1px solid ${A.border}` }} />
                      <button onClick={() => setExistAdd(p => p.filter((_,idx)=>idx!==i))}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ background:'rgba(248,113,113,0.85)', color:'white' }}>
                        <RiCloseLine size={11} />
                      </button>
                    </div>
                  ))}
                  {addPreviews.map((src,i) => (
                    <div key={`new-${i}`} className="relative w-20 h-20">
                      <img src={src} alt="" className="w-20 h-20 object-cover rounded-xl" style={{ border:`1px solid ${A.border}` }} />
                      <button onClick={() => { setAddFiles(p=>p.filter((_,idx)=>idx!==i)); setAddPreviews(p=>p.filter((_,idx)=>idx!==i)) }}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ background:'rgba(248,113,113,0.85)', color:'white' }}>
                        <RiCloseLine size={11} />
                      </button>
                    </div>
                  ))}
                  {existAdd.length + addFiles.length < 3 && (
                    <div {...aRoot()} style={{ ...dropZoneStyle(aDrag), width:'80px', height:'80px', padding:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <input {...aInput()} />
                      <RiUploadLine size={18} style={{ color:A.muted }} />
                    </div>
                  )}
                </div>
              </Field>
            </div>
          </div>

          {/* Panel derecho */}
          <div className="space-y-4">
            {/* Opciones */}
            <div className="rounded-2xl p-5 space-y-4" style={{ background:A.card, border:`1px solid ${A.border}` }}>
              <h2 className="font-cormorant font-semibold text-xl" style={{ color:A.text }}>Opciones</h2>
              <Toggle value={form.available} onChange={() => setForm(p=>({...p,available:!p.available}))} label="Visible en tienda" />
              <Toggle value={form.isFeatured} onChange={() => setForm(p=>({...p,isFeatured:!p.isFeatured}))} label="⭐ Destacado en home" />
            </div>

            {/* Etiquetas */}
            <div className="rounded-2xl p-5 space-y-3" style={{ background:A.card, border:`1px solid ${A.border}` }}>
              <h2 className="font-cormorant font-semibold text-xl" style={{ color:A.text }}>Etiquetas</h2>
              {TAGS.map(({ value, label }) => (
                <label key={value} className="flex items-center gap-3 cursor-pointer">
                  <div onClick={() => toggleTag(value)}
                    className="w-5 h-5 rounded-md flex items-center justify-center transition-all duration-200 flex-shrink-0"
                    style={{
                      background: form.tags.includes(value) ? A.gold : 'rgba(245,237,214,0.06)',
                      border: `1px solid ${form.tags.includes(value) ? A.gold : 'rgba(245,237,214,0.18)'}`,
                    }}>
                    {form.tags.includes(value) && <span style={{ color:'#0E0A06', fontSize:'11px', fontWeight:'bold' }}>✓</span>}
                  </div>
                  <span className="font-poppins text-sm" style={{ color:A.text }}>{label}</span>
                </label>
              ))}
            </div>

            {/* Guardar */}
            <button onClick={handleSubmit} disabled={loading} className="btn-primary w-full" style={{ borderRadius:'14px', padding:'14px' }}>
              {loading ? (
                <><span className="w-4 h-4 border-2 border-night/30 border-t-night rounded-full animate-spin" />Guardando...</>
              ) : (
                <><RiSaveLine size={17} />{isEdit ? 'Guardar cambios' : 'Crear producto'}</>
              )}
            </button>
            <button onClick={() => navigate('/admin/productos')}
              className="w-full font-poppins text-sm py-2 transition-colors"
              style={{ color:A.muted }}
              onMouseEnter={e => e.currentTarget.style.color=A.text}
              onMouseLeave={e => e.currentTarget.style.color=A.muted}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
