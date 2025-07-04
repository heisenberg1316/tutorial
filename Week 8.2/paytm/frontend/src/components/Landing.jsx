// src/components/LandingPage.js
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {toast} from "react-toastify";

const LandingPage = () => {

  const navigate = useNavigate();
  let token;

  useEffect(() => {
    token = localStorage.getItem("token");
  },[])

  function sendToDashboard(){
    if(token){
      navigate("/dashboard");
    }
    else{
      toast.warning("You are not logged in");
    }
  }




  return (
     <div className="bg-gradient-to-r from-blue-500 to-purple-500 min-h-screen flex items-center justify-center">
      <div className="text-white text-center p-12 rounded-lg shadow-z shadow-xl backdrop-filter backdrop-blur-lg bg-opacity-80 ">
        <h1 className="text-6xl font-extrabold mb-6">Discover the Enchantment</h1>
        <p className="text-lg mb-8">Immerse yourself in a world of creativity and connection.</p>
        <div className="flex justify-center mb-4">
          <Link to="/signup">
            <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full mr-4 transition duration-300 transform hover:scale-105">
              Sign Up
            </button>
          </Link>
          
          <Link to="/signin">
            <button className="bg-white text-purple-600 font-bold py-3 px-6 rounded-full border border-purple-600 hover:border-purple-700 transition duration-300 transform hover:scale-105">
              Sign In
            </button>
          </Link>
          
        </div>
        <div>
          <button className='bg-blue-600 text-white font-bold py-3 px-6 rounded-full border border-purple-600 hover:border-purple-700 transition duration-300 transform hover:scale-105' onClick={sendToDashboard}>
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
