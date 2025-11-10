import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check, Search, X } from 'lucide-react'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface SelectMenuProps {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'compact'
  searchable?: boolean
  searchPlaceholder?: string
}

export default function SelectMenu({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  disabled = false,
  className = '',
  size = 'md',
  variant = 'default',
  searchable = true,
  searchPlaceholder = 'Search...',
}: SelectMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const selectedOption = options.find((opt) => opt.value === value)

  // Filter options based on search query
  const filteredOptions = searchable && searchQuery
    ? options.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-base',
  }

  const compactSizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  }

  const sizeClass = variant === 'compact' ? compactSizeClasses[size] : sizeClasses[size]

  // Reset search when menu closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('')
      setFocusedIndex(-1)
    }
  }, [isOpen])

  // Focus search input when menu opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
  }, [isOpen, searchable])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchQuery('')
        setFocusedIndex(-1)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      // Don't handle navigation keys if user is typing in search input
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' && target.getAttribute('type') === 'text') {
        // Allow arrow keys in search input for text navigation
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault()
          // Move focus to first/last option
          if (e.key === 'ArrowDown') {
            setFocusedIndex(0)
            searchInputRef.current?.blur()
          } else {
            setFocusedIndex(filteredOptions.length - 1)
            searchInputRef.current?.blur()
          }
        }
        return
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setFocusedIndex((prev) => {
            const nextIndex = prev < filteredOptions.length - 1 ? prev + 1 : 0
            return nextIndex
          })
          break
        case 'ArrowUp':
          e.preventDefault()
          setFocusedIndex((prev) => {
            const nextIndex = prev > 0 ? prev - 1 : filteredOptions.length - 1
            return nextIndex
          })
          break
        case 'Enter':
          e.preventDefault()
          if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
            const option = filteredOptions[focusedIndex]
            if (!option.disabled) {
              onChange(option.value)
              setIsOpen(false)
              setSearchQuery('')
              setFocusedIndex(-1)
            }
          }
          break
        case 'Escape':
          e.preventDefault()
          setIsOpen(false)
          setSearchQuery('')
          setFocusedIndex(-1)
          buttonRef.current?.focus()
          break
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, focusedIndex, filteredOptions, onChange])

  const handleSelect = (option: SelectOption) => {
    if (option.disabled) return
    onChange(option.value)
    setIsOpen(false)
    setSearchQuery('')
    setFocusedIndex(-1)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setFocusedIndex(-1) // Reset focus when searching
  }

  const clearSearch = () => {
    setSearchQuery('')
    searchInputRef.current?.focus()
  }

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      <button
        ref={buttonRef}
        type='button'
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onMouseDown={(e) => e.stopPropagation()}
        onDragStart={(e) => e.preventDefault()}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between gap-2
          ${sizeClass}
          bg-white dark:bg-zinc-800
          border border-zinc-200 dark:border-zinc-800
          rounded-lg
          text-gray-900 dark:text-white
          font-paragraph
          transition-all
          focus:outline-none focus:ring-2 focus:ring-zim-green-500/50 focus:border-zim-green-500/50
          disabled:opacity-50 disabled:cursor-not-allowed
          ${isOpen ? 'ring-2 ring-zim-green-500/50 border-zim-green-500/50' : ''}
          hover:border-zinc-300 dark:hover:border-zinc-700
        `}
        aria-haspopup='listbox'
        aria-expanded={isOpen}
        aria-label={selectedOption?.label || placeholder}
      >
        <span className={selectedOption ? '' : 'text-gray-500 dark:text-gray-400'}>
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className='fixed inset-0 z-10'
            onClick={() => setIsOpen(false)}
            aria-hidden='true'
          />

          {/* Dropdown Menu */}
          <div
            className='absolute z-20 w-full mt-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-lg overflow-hidden'
            role='listbox'
          >
            {/* Search Input */}
            {searchable && (
              <div className='p-2 border-b border-zinc-200 dark:border-zinc-800'>
                <div className='relative'>
                  <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500' />
                  <input
                    ref={searchInputRef}
                    type='text'
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder={searchPlaceholder}
                    className='w-full pl-9 pr-8 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-md text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-zim-green-500/50 focus:border-zim-green-500/50 font-paragraph'
                    onClick={(e) => e.stopPropagation()}
                  />
                  {searchQuery && (
                    <button
                      type='button'
                      onClick={clearSearch}
                      className='absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 rounded transition-colors'
                      aria-label='Clear search'
                    >
                      <X className='h-3.5 w-3.5' />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Options List */}
            <div className='max-h-60 overflow-auto scrollbar-hide'>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => {
                  const isSelected = option.value === value
                  const isFocused = index === focusedIndex
                  const isDisabled = option.disabled

                  return (
                    <button
                      key={option.value}
                      type='button'
                      onClick={() => handleSelect(option)}
                    onMouseDown={(e) => e.stopPropagation()}
                      disabled={isDisabled}
                      className={`
                        w-full flex items-center justify-between gap-2 px-4 py-2.5 text-sm
                        font-paragraph
                        transition-colors
                        ${index === 0 ? 'rounded-t-lg' : ''}
                        ${index === filteredOptions.length - 1 ? 'rounded-b-lg' : ''}
                        ${
                          isSelected
                            ? 'bg-zim-green-50 dark:bg-zim-green-900/20 text-zim-green-700 dark:text-zim-green-400'
                            : isFocused
                            ? 'bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white'
                            : 'text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-800'
                        }
                        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                      `}
                      role='option'
                      aria-selected={isSelected}
                    >
                      <span>{option.label}</span>
                      {isSelected && (
                        <Check className='h-4 w-4 text-zim-green-600 dark:text-zim-green-400' />
                      )}
                    </button>
                  )
                })
              ) : (
                <div className='px-4 py-8 text-center'>
                  <p className='text-sm text-gray-500 dark:text-gray-400 font-paragraph'>
                    No options found
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

