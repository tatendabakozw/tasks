import ThemeToggle from '../buttons/theme-toggle'
import { Settings } from 'lucide-react'

function GeneralNavbar() {
  return (
    <div className='sticky top-0 z-40 w-full border-b border-zinc-200/50 dark:border-zinc-800/50 bg-zim-white dark:bg-zim-cream-900/95 backdrop-blur-sm'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 items-center justify-between'>
          {/* Logo/Name */}
          <div className='flex items-center'>
            <h1 className='text-xl font-semibold text-zim-cream-900 dark:text-zim-cream-50 tracking-tight'>
              Tasks
            </h1>
          </div>
          
          {/* Actions */}
          <div className='flex items-center gap-2'>
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Settings Button */}
            <button
              className='flex h-10 w-10 items-center justify-center rounded-lg bg-zim-cream-100 dark:bg-zim-cream-800 text-zim-cream-700 dark:text-zim-cream-300 transition-colors hover:bg-zim-cream-200 dark:hover:bg-zim-cream-700'
              aria-label='Settings'
            >
              <Settings className='h-5 w-5' />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GeneralNavbar
