/**
 * Input base reutilizable
 */
export function Input({ label, error, className = '', ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block font-poppins text-sm font-medium text-chocolate mb-1">
          {label}
        </label>
      )}
      <input
        className={`input-base ${error ? 'border-red-400 focus:ring-red-200' : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500 font-poppins">{error}</p>}
    </div>
  )
}

/**
 * Textarea reutilizable
 */
export function Textarea({ label, error, className = '', rows = 4, ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block font-poppins text-sm font-medium text-chocolate mb-1">
          {label}
        </label>
      )}
      <textarea
        rows={rows}
        className={`input-base resize-none ${error ? 'border-red-400 focus:ring-red-200' : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500 font-poppins">{error}</p>}
    </div>
  )
}

/**
 * Select reutilizable
 */
export function Select({ label, error, options = [], placeholder, className = '', ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block font-poppins text-sm font-medium text-chocolate mb-1">
          {label}
        </label>
      )}
      <select
        className={`input-base ${error ? 'border-red-400 focus:ring-red-200' : ''} ${className}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-500 font-poppins">{error}</p>}
    </div>
  )
}
