import React from 'react'

function GeneralFooter() {
  return (
    <footer className='border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-6'>
        <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            © {new Date().getFullYear()} Tasks. All rights reserved.
          </p>
          <div className='flex gap-6'>
            <a
              href='#'
              className='text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors'
            >
              Privacy
            </a>
            <a
              href='#'
              className='text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors'
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
