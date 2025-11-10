import React from 'react'
import GeneralLayout from '@/layouts/general-layout'

function index() {
  return (
    <GeneralLayout>
      <div className='flex flex-col items-center justify-center min-h-[60vh]'>
        <h2 className='text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4'>
          Welcome to Todo App
        </h2>
        <p className='text-zinc-600 dark:text-zinc-400'>
          Start managing your tasks efficiently
        </p>
      </div>
    </GeneralLayout>
  )
}

export default index
