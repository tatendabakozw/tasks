import React, { ReactNode } from 'react'
import ThemeToggle from '@/components/ThemeToggle'

type Props = {
  children: ReactNode
}

function GeneralLayout({ children }: Props) {
  return (
    <div className='flex flex-col min-h-screen bg-white dark:bg-black transition-colors'>
      {/* Navbar */}
      <nav className='sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-black/80 backdrop-blur-sm'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex h-16 items-center justify-between'>
            <div className='flex items-center'>
              <h1 className='text-xl font-semibold text-zinc-900 dark:text-zinc-100'>
                Todo App
              </h1>
            </div>
            <div className='flex items-center gap-4'>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className='flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {children}
      </main>

      {/* Footer */}
      <footer className='border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-6'>
          <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
            <p className='text-sm text-zinc-600 dark:text-zinc-400'>
              © {new Date().getFullYear()} Todo App. All rights reserved.
            </p>
            <div className='flex gap-6'>
              <a
                href='#'
                className='text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors'
              >
                Privacy
              </a>
              <a
                href='#'
                className='text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors'
              >
                Terms
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default GeneralLayout