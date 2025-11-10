import React, { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'

interface PrimaryButtonProps {
  children: ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  icon?: LucideIcon
  iconPosition?: 'left' | 'right'
  disabled?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function PrimaryButton({
  children,
  onClick,
  type = 'button',
  icon: Icon,
  iconPosition = 'left',
  disabled = false,
  className = '',
  size = 'md',
}: PrimaryButtonProps) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  const iconSizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center justify-center gap-2
        bg-zim-green-500 hover:bg-zim-green-600
        disabled:bg-zim-cream-400 disabled:cursor-not-allowed
        text-white rounded-lg font-buttons font-medium
        transition-colors shadow-sm hover:shadow-md
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {Icon && iconPosition === 'left' && (
        <Icon className={iconSizeClasses[size]} />
      )}
      {children}
      {Icon && iconPosition === 'right' && (
        <Icon className={iconSizeClasses[size]} />
      )}
    </button>
  )
}

