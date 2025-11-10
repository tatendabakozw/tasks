import React from 'react'
import GeneralLayout from '@/layouts/general-layout'

function index() {
  return (
    <GeneralLayout>
      <div className='flex flex-col items-center justify-center min-h-[60vh]'>
        <h2 className='text-3xl font-bold text-zim-cream-900 dark:text-zim-cream-50 mb-4'>
          Welcome to Tasks
        </h2>
        <p className='text-zim-cream-600 dark:text-zim-cream-400 mb-4'>
          Start managing your tasks efficiently
        </p>
        <div className='p-4 bg-zim-cream-100 dark:bg-zim-cream-800 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50'>
          <p className='text-sm text-zim-cream-700 dark:text-zim-cream-300'>
            Test: This box should change color when you toggle the theme
          </p>
        </div>
      </div>
    </GeneralLayout>
  )
}

export default index
