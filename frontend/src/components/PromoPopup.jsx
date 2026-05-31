import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RiCloseLine, RiArrowRightLine, RiStarFill } from 'react-icons/ri'
import { Link } from 'react-router-dom'
import { promoService } from '../services/promoService'

export default function PromoPopup() {
  const [promos, setPromos]       = useState([])
  const [current, setCurrent]     = useState(0)
  const [visible, setVisible]     = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Solo mostrar una vez por sesión
    const seen = sessionStorage.getItem('promo_seen')
    if (seen) return

    promoService.getActive()
      .then(res => {
        if (res.data.length > 0) {
          setPromos(res.data)
          // Delay elegante para que aparezca después de que la página cargue
          setTimeout(() => setVisible(true), 1200)
        }
      })
      .catch(() => {})
  }, [])

  const handleClose = () => {
    setDismissed(true)
    setVisible(false)
    sessionStorage.setItem('promo_seen', '1')
  }

  const promo = promos[current]

  // Colores de fondo predefinidos con sus pares de texto
  const BG_THEMES = {
    '#3D2314': { text: '#F5EDD6', accent: '#C9963A', sub: 'rgba(245,237,214,0.55)' },
    '#1a1a2e': { text: '#e8e8ff', accent: '#a78bfa', sub: 'rgba(232,232,255,0.55)' },
    '#0d2137': { text: '#e0f0ff', accent: '#60a5fa', sub: 'rgba(224,240,255,0.55)' },
    '#1a2e1a': { text: '#e0ffe0', accent: '#4ade80', sub: 'rgba(224,255,224,0.55)' },
    '#2e1a2e': { text: '#ffe0ff', accent: '#e879f9', sub: 'rgba(255,224,255,0.55)' },
    '#2e1a1a': { text: '#ffe8e8', accent: '#f87171', sub: 'rgba(255,232,232,0.55)' },
  }
  const theme = promo ? (BG_THEMES[promo.bgColor] || BG_THEMES['#3D2314']) : BG_THEMES['#3D2314']

  return (
    <AnimatePresence>
      {visible && promo && !dismissed && (
        <>
          {/* Backdrop con blur */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={handleClose}
            className="fixed inset-0 z-[100]"
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.88, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 22, stiffness: 200, delay: 0.05 }}
            className="fixed inset-0 z-[101] flex items-center justify-center px-4 pointer-events-none"
          >
            <div
              className="relative w-full max-w-md pointer-events-auto overflow-hidden"
              style={{
                background: promo.bgColor || '#3D2314',
                borderRadius: '28px',
                border: `1px solid ${theme.accent}30`,
                boxShadow: `0 0 0 1px ${theme.accent}15, 0 30px 80px rgba(0,0,0,0.6), 0 0 120px ${theme.accent}20`,
              }}
            >
              {/* Blur orbs decorativos */}
              <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full pointer-events-none"
                style={{ background: `radial-gradient(circle, ${theme.accent}25 0%, transparent 70%)`, filter: 'blur(24px)' }} />
              <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full pointer-events-none"
                style={{ background: `radial-gradient(circle, ${theme.accent}15 0%, transparent 70%)`, filter: 'blur(32px)' }} />

              {/* Línea decorativa superior */}
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${theme.accent}60, transparent)` }} />

              {/* Botón cerrar */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: theme.sub }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.16)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
              >
                <RiCloseLine size={18} />
              </button>

              {/* Contenido */}
              <div className="relative z-10 p-8 pt-9">
                {/* Badge */}
                {promo.badgeText && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.25 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full mb-5"
                    style={{
                      background: `${theme.accent}20`,
                      border: `1px solid ${theme.accent}40`,
                      color: theme.accent,
                    }}
                  >
                    <RiStarFill size={11} />
                    <span className="font-poppins text-xs font-semibold tracking-wider uppercase">
                      {promo.badgeText}
                    </span>
                  </motion.div>
                )}

                {/* Título */}
                <motion.h2
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 }}
                  className="font-cormorant font-bold leading-tight mb-3"
                  style={{ color: theme.text, fontSize: 'clamp(28px, 5vw, 38px)', lineHeight: 1.1 }}
                >
                  {promo.title}
                </motion.h2>

                {/* Subtítulo */}
                {promo.subtitle && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.24 }}
                    className="font-poppins text-base font-semibold mb-2"
                    style={{ color: theme.accent }}
                  >
                    {promo.subtitle}
                  </motion.p>
                )}

                {/* Descripción */}
                {promo.description && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.30 }}
                    className="font-poppins text-sm leading-relaxed mb-7"
                    style={{ color: theme.sub }}
                  >
                    {promo.description}
                  </motion.p>
                )}

                {/* Botones */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.36 }}
                  className="flex items-center gap-3"
                >
                  <Link
                    to={promo.ctaUrl || '/catalogo'}
                    onClick={handleClose}
                    className="flex items-center gap-2 font-poppins font-semibold text-sm px-6 py-3 rounded-full transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
                    style={{
                      background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}cc)`,
                      color: '#0E0A06',
                      boxShadow: `0 4px 20px ${theme.accent}40`,
                    }}
                  >
                    {promo.ctaLabel || 'Ver más'}
                    <RiArrowRightLine size={16} />
                  </Link>
                  <button
                    onClick={handleClose}
                    className="font-poppins text-sm transition-colors duration-200"
                    style={{ color: theme.sub }}
                    onMouseEnter={e => e.currentTarget.style.color = theme.text}
                    onMouseLeave={e => e.currentTarget.style.color = theme.sub}
                  >
                    Quizás después
                  </button>
                </motion.div>

                {/* Indicadores si hay múltiples promos */}
                {promos.length > 1 && (
                  <div className="flex gap-1.5 mt-6">
                    {promos.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className="rounded-full transition-all duration-300"
                        style={{
                          width: i === current ? '24px' : '6px',
                          height: '6px',
                          background: i === current ? theme.accent : `${theme.accent}35`,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
