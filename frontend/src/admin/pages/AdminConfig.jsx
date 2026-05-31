import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { RiUploadLine, RiCloseLine, RiSaveLine, RiAddLine, RiDeleteBinLine } from 'react-icons/ri'
import { configService } from '../../services/configService'
import { getImageUrl } from '../../utils/formatters'
import Loader from '../../components/Loader'
import toast from 'react-hot-toast'

const A = {
  card:'rgba(28,20,12,0.90)', border:'rgba(201,150,58,0.10)',
  text:'#F5EDD6', muted:'rgba(245,237,214,0.38)', gold:'#C9963A',
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block font-poppins text-[11px] font-medium tracking-wider uppercase mb-1.5" style={{ color:A.muted }}>
        {label}
      </label>
      {children}
    </div>
  )
}

export default function AdminConfig() {
  const [loading,      setLoading]      = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [logoFile,     setLogoFile]     = useState(null)
  const [logoPreview,  setLogoPreview]  = useState('')
  const [existLogo,    setExistLogo]    = useState('')
  const [newZone,      setNewZone]      = useState('')

  const [form, setForm] = useState({
    businessName:'', whatsappNumber:'', contactEmail:'', deliveryCost:'',
    freeDeliveryZones:[],
    socialMedia:{ instagram:'', facebook:'', tiktok:'', whatsapp:'' },
  })

  useEffect(() => {
    configService.get().then(res => {
      const c = res.data
      setForm({
        businessName:c.businessName||'', whatsappNumber:c.whatsappNumber||'',
        contactEmail:c.contactEmail||'', deliveryCost:c.deliveryCost??10,
        freeDeliveryZones:c.freeDeliveryZones||[],
        socialMedia:c.socialMedia||{ instagram:'', facebook:'', tiktok:'', whatsapp:'' },
      })
      setExistLogo(c.logoUrl||'')
    }).finally(() => setFetchLoading(false))
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept:{'image/*':[]}, maxFiles:1,
    onDrop: (files) => {
      const f = files[0]; if (!f) return
      setLogoFile(f); setLogoPreview(URL.createObjectURL(f)); setExistLogo('')
    },
  })

  const handleSave = async () => {
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('businessName',     form.businessName)
      fd.append('whatsappNumber',   form.whatsappNumber)
      fd.append('contactEmail',     form.contactEmail)
      fd.append('deliveryCost',     form.deliveryCost)
      fd.append('freeDeliveryZones',JSON.stringify(form.freeDeliveryZones))
      fd.append('socialMedia',      JSON.stringify(form.socialMedia))
      if (logoFile) fd.append('logo', logoFile)
      await configService.update(fd)
      toast.success('Configuración guardada ✅')
    } catch { toast.error('Error al guardar') }
    finally { setLoading(false) }
  }

  const f = key => e => setForm(p => ({ ...p, [key]: e.target.value }))
  const sm = key => e => setForm(p => ({ ...p, socialMedia:{ ...p.socialMedia, [key]:e.target.value } }))

  const dropStyle = {
    border:`1px dashed ${isDragActive ? A.gold : 'rgba(201,150,58,0.22)'}`,
    background: isDragActive ? 'rgba(201,150,58,0.06)' : 'rgba(245,237,214,0.02)',
    borderRadius:'14px', padding:'20px', textAlign:'center', cursor:'pointer', transition:'all .2s',
  }

  if (fetchLoading) return <Loader />

  return (
    <>
      <Helmet><title>Configuración – Admin</title></Helmet>
      <div className="space-y-5 max-w-2xl">
        <div>
          <p className="section-label mb-1">Ajustes</p>
          <h1 className="font-cormorant font-bold text-3xl" style={{ color:A.text }}>Configuración</h1>
        </div>

        {/* Identidad */}
        <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}
          className="rounded-2xl p-6 space-y-5" style={{ background:A.card, border:`1px solid ${A.border}` }}>
          <h2 className="font-cormorant font-semibold text-xl" style={{ color:A.text }}>Identidad del negocio</h2>

          {/* Logo */}
          <Field label="Logo">
            {(logoPreview || existLogo) ? (
              <div className="relative w-24 h-24">
                <img src={logoPreview || getImageUrl(existLogo)} alt=""
                  className="w-24 h-24 object-contain rounded-2xl"
                  style={{ border:`1px solid ${A.border}`, background:'rgba(245,237,214,0.04)', padding:'8px' }} />
                <button onClick={() => { setLogoFile(null); setLogoPreview(''); setExistLogo('') }}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background:'rgba(248,113,113,0.85)', color:'white' }}>
                  <RiCloseLine size={13} />
                </button>
              </div>
            ) : (
              <div {...getRootProps()} style={dropStyle} className="max-w-xs">
                <input {...getInputProps()} />
                <RiUploadLine size={20} style={{ color:A.muted, margin:'0 auto 6px' }} />
                <p className="font-poppins text-sm" style={{ color:A.muted }}>Subir logo</p>
              </div>
            )}
          </Field>
          <Field label="Nombre del negocio">
            <input value={form.businessName} onChange={f('businessName')} placeholder="Momentos Divertidos" className="input-base" />
          </Field>
        </motion.div>

        {/* Contacto */}
        <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.08}}
          className="rounded-2xl p-6 space-y-4" style={{ background:A.card, border:`1px solid ${A.border}` }}>
          <h2 className="font-cormorant font-semibold text-xl" style={{ color:A.text }}>Contacto</h2>
          <Field label="Número de WhatsApp">
            <input value={form.whatsappNumber} onChange={f('whatsappNumber')} placeholder="975335798" className="input-base" />
          </Field>
          <Field label="Email de contacto">
            <input type="email" value={form.contactEmail} onChange={f('contactEmail')} placeholder="contacto@momentosdivertidos.com" className="input-base" />
          </Field>
        </motion.div>

        {/* Delivery */}
        <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.12}}
          className="rounded-2xl p-6 space-y-4" style={{ background:A.card, border:`1px solid ${A.border}` }}>
          <h2 className="font-cormorant font-semibold text-xl" style={{ color:A.text }}>Delivery</h2>
          <Field label="Costo de delivery (S/)">
            <input type="number" min="0" step="0.50" value={form.deliveryCost} onChange={f('deliveryCost')} className="input-base" style={{ maxWidth:'160px' }} />
          </Field>
          <Field label="Zonas de entrega gratuita">
            <div className="space-y-2 mb-3">
              {form.freeDeliveryZones.map((zone,i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                  style={{ background:'rgba(201,150,58,0.06)', border:`1px solid rgba(201,150,58,0.12)` }}>
                  <span className="font-poppins text-sm flex-1" style={{ color:'rgba(245,237,214,0.70)' }}>📍 {zone}</span>
                  <button onClick={() => setForm(p => ({ ...p, freeDeliveryZones:p.freeDeliveryZones.filter((_,idx)=>idx!==i) }))}
                    className="transition-colors" style={{ color:A.muted }}
                    onMouseEnter={e => e.currentTarget.style.color='rgba(248,113,113,0.75)'}
                    onMouseLeave={e => e.currentTarget.style.color=A.muted}>
                    <RiDeleteBinLine size={15} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" placeholder="Ej: Plaza de Armas" value={newZone}
                onChange={e => setNewZone(e.target.value)}
                onKeyDown={e => { if(e.key==='Enter' && newZone.trim()){ setForm(p=>({...p,freeDeliveryZones:[...p.freeDeliveryZones,newZone.trim()]})); setNewZone('') }}}
                className="input-base flex-1" />
              <button onClick={() => { if(!newZone.trim()) return; setForm(p=>({...p,freeDeliveryZones:[...p.freeDeliveryZones,newZone.trim()]})); setNewZone('') }}
                className="btn-outline text-xs flex-shrink-0" style={{ padding:'10px 16px', borderRadius:'12px' }}>
                <RiAddLine size={15} />
              </button>
            </div>
          </Field>
        </motion.div>

        {/* Redes */}
        <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.16}}
          className="rounded-2xl p-6 space-y-4" style={{ background:A.card, border:`1px solid ${A.border}` }}>
          <h2 className="font-cormorant font-semibold text-xl" style={{ color:A.text }}>Redes sociales</h2>
          {[
            { key:'instagram', label:'Instagram', ph:'https://instagram.com/...' },
            { key:'facebook',  label:'Facebook',  ph:'https://facebook.com/...' },
            { key:'tiktok',    label:'TikTok',    ph:'https://tiktok.com/@...' },
            { key:'whatsapp',  label:'WhatsApp URL', ph:'https://wa.me/51975335798' },
          ].map(({ key, label, ph }) => (
            <Field key={key} label={label}>
              <input value={form.socialMedia[key]||''} onChange={sm(key)} placeholder={ph} className="input-base" />
            </Field>
          ))}
        </motion.div>

        <button onClick={handleSave} disabled={loading} className="btn-primary w-full" style={{ borderRadius:'14px', padding:'14px' }}>
          {loading
            ? <><span className="w-4 h-4 border-2 border-night/30 border-t-night rounded-full animate-spin" />Guardando...</>
            : <><RiSaveLine size={17} />Guardar configuración</>
          }
        </button>
      </div>
    </>
  )
}
