import React from 'react'
import Header from './Comps/Header'
import Footer from './Comps/Footer'

function layout({children}) {
  return (
    <div>
      <Header/>
      {children}
      <Footer/>
    </div>
  )
}

export default layout
