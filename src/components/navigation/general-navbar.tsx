import ThemeToggle from '../buttons/theme-toggle'
import { Settings } from 'lucide-react'

function GeneralNavbar() {
  return (
    <div className='sticky top-0 z-40 w-full border-b border-zinc-300/50 dark:border-zinc-800 bg-white dark:bg-zinc-900 backdrop-blur-sm'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 items-center justify-between'>
          {/* Logo/Name */}
          <div className='flex items-center'>
            <h1 className='text-xl font-semibold text-gray-900 dark:text-white tracking-tight'>
              Tasks
            </h1>
          </div>
          
          {/* Actions */}
          <div className='flex items-center gap-2'>
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Settings Button */}
            <button
              className='flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-200 dark:hover:bg-zinc-700'
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
