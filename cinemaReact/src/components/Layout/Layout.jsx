import React from 'react'
import Header from './Header'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './Layout.css'

const Layout = () => {
  return (
    <>
        <Header/>
        <div className='body-content'>
          <Outlet />
        </div>
        <Footer/>
    </>
  )
}

export default Layout