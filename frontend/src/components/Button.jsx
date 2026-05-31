import { motion } from 'framer-motion'

/**
 * Componente Button reutilizable
 * @param {'primary'|'secondary'|'outline'} variant
 */
export default function Button({
  children,
  variant = 'primary',
  className = '',
  loading = false,
  disabled,
  ...props
}) {
  const base = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
  }[variant]

  return (
    <motion.button
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      className={`${base} ${className} flex items-center justify-center gap-2`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Cargando...
        </>
      ) : children}
    </motion.button>
  )
}
