import { motion } from 'framer-motion'

export default function Loader({ fullScreen=false }) {
  const content = (
    <div className="flex flex-col items-center gap-4">
      <motion.div className="w-11 h-11 rounded-full"
        style={{border:'2px solid rgba(201,150,58,0.15)', borderTopColor:'#C9963A'}}
        animate={{ rotate:360 }} transition={{ duration:0.9, repeat:Infinity, ease:'linear' }} />
      <p className="font-poppins text-sm" style={{color:'rgba(245,237,214,0.30)'}}>Cargando...</p>
    </div>
  )
  if (fullScreen) return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{background:'#0E0A06'}}>{content}</div>
  )
  return <div className="flex items-center justify-center py-20">{content}</div>
}

export function ProductSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden animate-pulse"
      style={{background:'rgba(22,16,10,0.90)', border:'1px solid rgba(201,150,58,0.07)'}}>
      <div className="h-56" style={{background:'rgba(201,150,58,0.06)'}} />
      <div className="p-4 space-y-3">
        <div className="h-2.5 rounded-full w-1/3" style={{background:'rgba(201,150,58,0.08)'}} />
        <div className="h-5 rounded-xl w-3/4" style={{background:'rgba(201,150,58,0.06)'}} />
        <div className="h-7 rounded-xl w-1/3 mt-3" style={{background:'rgba(201,150,58,0.05)'}} />
      </div>
    </div>
  )
}
