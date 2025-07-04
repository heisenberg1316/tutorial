import React from 'react'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { toast } from 'react-toastify';

const Signup = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name] : value,
    }));
  };


  async function handleSubmit(e){
      let response;
      e.preventDefault();
      let tokenWithBearer;
      try {
          response = await axios.post("http://localhost:4000/api/v1/user/signup", formData);
          toast.success("Signup Successful");
          tokenWithBearer = `Bearer ${response.data.token}`;
          localStorage.setItem("token",tokenWithBearer);
          navigate("/signin");
      } 
      catch (error) {
          if(error.response.data?.messsage){
              //for password small
              toast.warning(error.response.data.messsage);  
          }
          else{
              toast.warning(error.response.data.message);  
          }
      }
  }


  return (
    <div className='bg-gradient-to-r from-blue-500 to-purple-500 min-h-screen flex justify-center items-center'>
      <div className='max-w-[400px] px-5 py-2 border-2 h-fit flex flex-col gap-3 rounded-lg'>
        <div className='flex flex-col items-center'>
          <h1 className='font-bold text-3xl'>Sign Up</h1>
          <p className='text-zinc-700 font-semibold text-lg text-center'>Enter your information to create an account</p>
        </div>
        <form onSubmit={handleSubmit}>

          <div className='flex flex-col gap-2 mt-[-10px]'>
            <div className='flex flex-col gap-1'>
              <label htmlFor='first' className='font-semibold'>First Name</label>
              <input type="text" id='first' name="firstName" value={formData.firstName} onChange={handleChange} className='p-2 border-neutral-500 border-2 rounded-md' placeholder='Enter your first name' required/>
            </div>
            
            <div className='flex flex-col gap-1'>
              <label htmlFor='last' className='font-semibold'>Last Name</label>
              <input type="text" id="last" name="lastName" value={formData.lastName} onChange={handleChange} className='p-2 border-neutral-500 border-2 rounded-md' placeholder='Enter your last name'  required/>
            </div>

            <div className='flex flex-col gap-1'>
              <label htmlFor='email' className='font-semibold'>Email</label>
              <input type="email" id="email" name="username" value={formData.username} onChange={handleChange} className='p-2 border-neutral-500 border-2 rounded-md' placeholder='Enter your email'  required/>
            </div>

            <div className='flex flex-col gap-1'>
              <label htmlFor='pass' className='font-semibold'>Password</label>
              <input type="password" id="pass" name="password" value={formData.password} onChange={handleChange} className='p-2 border-neutral-500 border-2 rounded-md' placeholder='Enter your password' required/>
            </div> 
          </div>

          <div className='flex flex-col gap-3 items-center mt-3'>
            <button className='text-white bg-neutral-900 py-3 rounded-lg self-stretch hover:bg-neutral-800 transition-all duration-300'>Sign Up</button>
            <p>Already have an account? <Link to="/signin" className='underline'>Login</Link></p>
          </div>
        </form>
        
      </div>
    </div>
  )
}

export default Signup;