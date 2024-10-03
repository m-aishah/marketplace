export function Button({ variant = 'solid', children, ...props }) {
  const baseStyle = "px-4 py-2 rounded-lg font-semibold"
  const variantStyle = variant === 'outline' ? 'border border-gray-300' : 'bg-blue-500 text-white'

  return (
    <button {...props} className={`${baseStyle} ${variantStyle} ${props.className}`}>
      {children}
    </button>
  )
}
