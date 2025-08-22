import React from "react";
import { BookOpenIcon, ChevronDownIcon } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";

function Navbar() {
  const admin = localStorage.getItem("admin");
  const teacher = localStorage.getItem("teacher");
  const student = localStorage.getItem("student");
  const navigate = useNavigate();

  if (admin) return <Navigate to="/attendance" />;
  if (teacher) return <Navigate to="/teacherdashboard" />;
  if (student) return <Navigate to="/studentdashboard" />;

  return (
    <nav className="w-full py-4 px-6 flex items-center justify-between">
      <div className="flex items-center">
        <div className="flex items-center mr-10">
          <div className="bg-[#9078e2] p-2 rounded-lg">
            <BookOpenIcon size={26} className="text-white" />
          </div>
          <span className="text-xl font-bold ml-2 text-[#9078e2]">
            EduNex AI
          </span>
        </div>
        <div className="hidden md:flex items-center space-x-6">
          <NavItem text="Home" to="/" />
          <NavItem text="About" to="/about" />
          <NavItem text="Contact" to="/contact" />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button
         onClick={() => navigate('/login')}
        className="bg-[#9078e2] hover:bg-[#7b66c8] text-white px-4 py-1.5 rounded-md text-lg">
          Get Started
        </button>
      </div>
    </nav>
  );
}
const NavItem = ({ text }) => {
   return ( 
   <div className="flex items-center cursor-pointer"> 
   <span className="text-gray-700">{text}</span> 
   </div>
    ) 
  }

export default Navbar;
