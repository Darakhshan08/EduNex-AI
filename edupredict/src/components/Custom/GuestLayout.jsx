import React from 'react'
import Navbar from '../Navbar';




function Guestlayout(props) {
    const { children } = props;
  return (
    <div>
 <Navbar/>
      {children}
     
    </div>
  )
}

export default Guestlayout