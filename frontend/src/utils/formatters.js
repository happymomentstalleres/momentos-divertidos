export const formatPrice = (price) =>
  new Intl.NumberFormat('es-PE', { style:'currency', currency:'PEN', minimumFractionDigits:2 }).format(price)

export const formatDate = (date) =>
  new Intl.DateTimeFormat('es-PE', { year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' }).format(new Date(date))

export const TAG_LABELS = {
  nuevo:           { label:'Nuevo',          color:'bg-emerald-900/40 text-emerald-400' },
  oferta:          { label:'Oferta',         color:'bg-red-900/40 text-red-400' },
  mas_vendido:     { label:'Más vendido',    color:'bg-amber-900/40 text-amber-400' },
  ultimas_unidades:{ label:'Últimas uds',    color:'bg-orange-900/40 text-orange-400' },
}

// Para uso en admin dark
export const STATUS_LABELS = {
  pendiente:      { label:'Pendiente',      bg:'rgba(251,191,36,0.12)',  text:'rgba(251,191,36,0.85)'  },
  confirmado:     { label:'Confirmado',     bg:'rgba(96,165,250,0.12)',  text:'rgba(96,165,250,0.85)'  },
  en_preparacion: { label:'En preparación', bg:'rgba(251,146,60,0.12)',  text:'rgba(251,146,60,0.85)'  },
  enviado:        { label:'Enviado',        bg:'rgba(167,139,250,0.12)', text:'rgba(167,139,250,0.85)' },
  entregado:      { label:'Entregado',      bg:'rgba(74,222,128,0.12)',  text:'rgba(74,222,128,0.85)'  },
  cancelado:      { label:'Cancelado',      bg:'rgba(248,113,113,0.12)', text:'rgba(248,113,113,0.85)' },
}

export const getImageUrl = (path) => {
  if (!path) return 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=60'
  if (path.startsWith('http')) return path
  return `/uploads/${path}`
}
