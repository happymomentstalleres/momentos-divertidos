import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { RiInstagramLine, RiFacebookBoxLine, RiTiktokLine, RiWhatsappLine, RiHeartFill, RiMapPinLine } from 'react-icons/ri'
import { configService } from '../services/configService'

export default function Footer() {
  const [config, setConfig] = useState(null)
  useEffect(() => { configService.get().then(r => setConfig(r.data)).catch(()=>{}) }, [])

  const wa = config?.socialMedia?.whatsapp || `https://wa.me/${config?.whatsappNumber || '975335798'}`

  const SOCIAL = [
    { url:config?.socialMedia?.instagram, Icon:RiInstagramLine,   label:'Instagram' },
    { url:config?.socialMedia?.facebook,  Icon:RiFacebookBoxLine, label:'Facebook' },
    { url:config?.socialMedia?.tiktok,    Icon:RiTiktokLine,      label:'TikTok' },
    { url:wa,                             Icon:RiWhatsappLine,    label:'WhatsApp' },
  ].filter(s => s.url)

  return (
    <footer style={{background:'#0A0704', borderTop:'1px solid rgba(201,150,58,0.08)'}}>
      <div className="max-w-6xl mx-auto px-6 sm:px-10 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Marca */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <img src="/logo.png" alt="Logo" className="w-11 h-11 object-contain opacity-80"
                onError={e => e.target.style.display='none'} />
              <div>
                <p className="font-cormorant font-bold text-xl leading-none" style={{color:'#F5EDD6'}}>Momentos Divertidos</p>
                <p className="font-poppins text-[10px] tracking-[0.22em] uppercase mt-0.5" style={{color:'rgba(201,150,58,0.60)'}}>
                  Postres & Regalos
                </p>
              </div>
            </div>
            <p className="font-poppins text-sm leading-relaxed max-w-xs mb-6" style={{color:'rgba(245,237,214,0.30)'}}>
              Postres artesanales elaborados con amor en Moquegua, Perú. Cada bocado es un momento especial.
            </p>
            {SOCIAL.length > 0 && (
              <div className="flex gap-2">
                {SOCIAL.map(({ url, Icon, label }) => (
                  <a key={label} href={url} target="_blank" rel="noopener noreferrer" title={label}
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300"
                    style={{background:'rgba(245,237,214,0.05)', border:'1px solid rgba(245,237,214,0.08)', color:'rgba(245,237,214,0.40)'}}
                    onMouseEnter={e => { e.currentTarget.style.background='rgba(201,150,58,0.15)'; e.currentTarget.style.borderColor='rgba(201,150,58,0.30)'; e.currentTarget.style.color='#C9963A' }}
                    onMouseLeave={e => { e.currentTarget.style.background='rgba(245,237,214,0.05)'; e.currentTarget.style.borderColor='rgba(245,237,214,0.08)'; e.currentTarget.style.color='rgba(245,237,214,0.40)' }}>
                    <Icon size={17} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Navegación */}
          <div>
            <h4 className="font-cormorant font-semibold text-xl mb-5" style={{color:'#F5EDD6'}}>Tienda</h4>
            <ul className="space-y-3">
              {[
                { to:'/', label:'Inicio' },
                { to:'/catalogo', label:'Catálogo completo' },
                { to:'/catalogo?category=Tortas', label:'Tortas' },
                { to:'/catalogo?category=Chocolates', label:'Chocolates' },
                { to:'/catalogo?category=Regalos', label:'Regalos dulces' },
                { to:'/catalogo?category=Brownies', label:'Brownies' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="font-poppins text-sm transition-colors duration-200"
                    style={{color:'rgba(245,237,214,0.30)'}}
                    onMouseEnter={e => e.currentTarget.style.color='rgba(201,150,58,0.75)'}
                    onMouseLeave={e => e.currentTarget.style.color='rgba(245,237,214,0.30)'}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="font-cormorant font-semibold text-xl mb-5" style={{color:'#F5EDD6'}}>Contacto</h4>
            <div className="space-y-4">
              <a href={wa} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 transition-colors duration-200 group"
                style={{color:'rgba(245,237,214,0.35)'}}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200"
                  style={{background:'rgba(245,237,214,0.05)', border:'1px solid rgba(245,237,214,0.08)'}}>
                  <RiWhatsappLine size={16} />
                </div>
                <span className="font-poppins text-sm">+51 {config?.whatsappNumber || '975335798'}</span>
              </a>
              {config?.contactEmail && (
                <a href={`mailto:${config.contactEmail}`}
                  className="flex items-center gap-3 transition-colors duration-200"
                  style={{color:'rgba(245,237,214,0.35)'}}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{background:'rgba(245,237,214,0.05)', border:'1px solid rgba(245,237,214,0.08)'}}>
                    <span style={{fontSize:'12px'}}>✉</span>
                  </div>
                  <span className="font-poppins text-sm">{config.contactEmail}</span>
                </a>
              )}
              <div className="flex items-start gap-3" style={{color:'rgba(245,237,214,0.35)'}}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{background:'rgba(245,237,214,0.05)', border:'1px solid rgba(245,237,214,0.08)'}}>
                  <RiMapPinLine size={16} />
                </div>
                <span className="font-poppins text-sm mt-1.5">Moquegua, Perú</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{borderTop:'1px solid rgba(245,237,214,0.05)'}}>
          <p className="font-poppins text-xs" style={{color:'rgba(245,237,214,0.20)'}}>
            © {new Date().getFullYear()} Momentos Divertidos. Todos los derechos reservados.
          </p>
          <p className="font-poppins text-xs flex items-center gap-1.5" style={{color:'rgba(245,237,214,0.20)'}}>
            Hecho con <RiHeartFill size={11} style={{color:'rgba(201,150,58,0.60)'}} /> en Moquegua
          </p>
        </div>
      </div>
    </footer>
  )
}
