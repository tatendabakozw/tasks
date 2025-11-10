import React from 'react'
import GeneralLayout from '@/layouts/general-layout'

function index() {
  return (
    <GeneralLayout>
      <div className='flex flex-col items-center justify-center min-h-[60vh]'>
        <h2 className='text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4'>
          Welcome to Todo App
        </h2>
        <p className='text-zinc-600 dark:text-zinc-400 mb-4'>
          Start managing your tasks efficiently
        </p>
        <div className='p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg'>
          <p className='text-sm text-zinc-700 dark:text-zinc-300'>
            Test: This box should change color when you toggle the theme
          </p>
        </div>
      </div>
    </GeneralLayout>
  )
}

export default index
