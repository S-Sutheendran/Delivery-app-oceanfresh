const variants = {
  success: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  warning: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
  error:   'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  info:    'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  gray:    'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
  brand:   'bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400',
  orange:  'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
}

export default function Badge({ children, variant = 'gray' }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  )
}
