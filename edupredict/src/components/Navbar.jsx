import React from 'react'
import { ChevronDownIcon, ShoppingCartIcon, UserIcon } from 'lucide-react'

function Navbar() {
   return (  
  <nav className="w-full py-4 px-6 flex items-center justify-between">
      <div className="flex items-center">
        <div className="flex items-center mr-10">
          <div className="bg-[#9078e2] p-2 rounded-lg">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2436/2436874.png"
              alt="Edurock Logo"
              className="h-8 w-8"
            />
          </div>
          <span className="text-2xl font-bold ml-2 text-[#9078e2]">
            Edurock
          </span>
        </div>
        <div className="hidden md:flex items-center space-x-6">
          <NavItem text="Demos" />
          <NavItem text="Pages" />
          <NavItem text="Courses" />
          <NavItem text="Dashboard" />
          <NavItem text="eCommerce" />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <ShoppingCartIcon className="h-5 w-5" />
          <span className="absolute -top-2 -right-2 bg-[#9078e2] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            2
          </span>
        </div>
        <UserIcon className="h-5 w-5" />
        <button className="bg-[#9078e2] hover:bg-[#7b66c8] text-white px-4 py-1.5 rounded-md text-sm">
          Get Start
        </button>
      </div>
    </nav>
  )
}
const NavItem = ({ text }) => {
  return (
    <div className="flex items-center cursor-pointer">
      <span className="text-gray-700">{text}</span>
      <ChevronDownIcon className="h-4 w-4 ml-1" />
    </div>
  )
}

export default Navbar