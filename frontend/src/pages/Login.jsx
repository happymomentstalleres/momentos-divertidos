import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { RiLockLine, RiMailLine, RiEyeLine, RiEyeOffLine } from 'react-icons/ri'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) return <Navigate to="/admin" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) { toast.error('Completa todos los campos'); return }
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/admin')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Credenciales incorrectas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Helmet><title>Administración – Momentos Divertidos</title></Helmet>

      <div className="min-h-screen bg-choco flex items-center justify-center px-4 relative overflow-hidden">
        {/* Fondo decorativo */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=1200&q=40"
            alt=""
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-choco/80" />
        </div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-sm"
        >
          <div className="bg-cream rounded-3xl p-8 shadow-2xl border border-white/10">
            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
              <img
                src="/logo.png"
                alt="Momentos Divertidos"
                className="w-20 h-20 object-contain mb-4"
                onError={e => e.target.style.display='none'}
              />
              <h1 className="font-cormorant font-bold text-2xl text-choco text-center">
                Panel de Administración
              </h1>
              <p className="font-poppins text-choco/50 text-xs tracking-widest uppercase mt-1">
                Momentos Divertidos
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-poppins text-xs font-medium text-choco/70 mb-1.5 uppercase tracking-wide">
                  Email
                </label>
                <div className="relative">
                  <RiMailLine className="absolute left-4 top-1/2 -translate-y-1/2 text-choco/30" size={17} />
                  <input
                    type="email"
                    placeholder="admin@momentos.com"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="input-base pl-11"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label className="block font-poppins text-xs font-medium text-choco/70 mb-1.5 uppercase tracking-wide">
                  Contraseña
                </label>
                <div className="relative">
                  <RiLockLine className="absolute left-4 top-1/2 -translate-y-1/2 text-choco/30" size={17} />
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    className="input-base pl-11 pr-11"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-choco/30 hover:text-choco transition-colors"
                  >
                    {showPass ? <RiEyeOffLine size={17} /> : <RiEyeLine size={17} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3.5 mt-2 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Ingresando...</>
                ) : 'Ingresar al panel'}
              </button>
            </form>

            <p className="font-poppins text-xs text-choco/30 text-center mt-6">
              Solo acceso autorizado
            </p>
          </div>
        </motion.div>
      </div>
    </>
  )
}
