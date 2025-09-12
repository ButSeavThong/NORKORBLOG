import React from 'react'
import NavbarComponent from './NavbarComponent'
import { Outlet } from 'react-router'
import Footer from './Footer'

export default function RootLayout() {
  return (
    <div className='flex flex-col h-screen'>
      <NavbarComponent/>
      <main className='grow'>
        <Outlet/>
      </main>
      <Footer/>
    </div>
  )
}
