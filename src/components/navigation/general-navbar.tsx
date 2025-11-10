import React from 'react'
import ThemeToggle from '../buttons/theme-toggle'

function GeneralNavbar() {
  return (
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
  )
}

export default GeneralNavbar
