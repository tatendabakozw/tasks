import React, { ReactNode } from 'react'
import ThemeToggle from '@/components/buttons/theme-toggle'
import GeneralNavbar from '@/components/navigation/general-navbar'
import GeneralFooter from '@/components/navigation/general-footer'

type Props = {
  children: ReactNode
}

function GeneralLayout({ children }: Props) {
  return (
    <div className='flex flex-col min-h-screen '>
      {/* Navbar */}
      <GeneralNavbar/>

      {/* Main Content */}
      <main className='flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {children}
      </main>

      {/* Footer */}
      <GeneralFooter/>
    </div>
  )
}

export default GeneralLayout