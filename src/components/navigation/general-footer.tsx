import React from 'react'

function GeneralFooter() {
  return (
    <footer className='border-t border-zinc-200/50 dark:border-zinc-800/50 bg-zim-cream-50 dark:bg-zim-cream-900'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-6'>
        <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
          <p className='text-sm text-zim-cream-600 dark:text-zim-cream-400'>
            © {new Date().getFullYear()} Tasks. All rights reserved.
          </p>
          <div className='flex gap-6'>
            <a
              href='#'
              className='text-sm text-zim-cream-600 dark:text-zim-cream-400 hover:text-zim-cream-900 dark:hover:text-zim-cream-50 transition-colors'
            >
              Privacy
            </a>
            <a
              href='#'
              className='text-sm text-zim-cream-600 dark:text-zim-cream-400 hover:text-zim-cream-900 dark:hover:text-zim-cream-50 transition-colors'
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default GeneralFooter;
