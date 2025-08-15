import React from "react";
import { Navigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import { motion } from 'framer-motion';
const AuthLayout = ({ token, children }) => {
  const auth = localStorage.getItem(token);

  if (auth) {
    return (
      <div className="flex flex-col md:flex-row h-screen bg-gray-50">
        <Sidebar /> {/* Sidebar left side */}
        <motion.main initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      duration: 0.3
    }} className="flex-1 p-4 md:p-6 overflow-auto">
        {children}
      </motion.main>
      </div>
    );
  } else {
    return <Navigate to={"/"} />;
  }
};


export default AuthLayout;
