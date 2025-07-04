import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from "axios";

const SignIn = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name] : value,
    }));
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      let response;
      let tokenWithBearer;
      console.log("hello");
      try{
          response = await axios.post("http://localhost:4000/api/v1/user/signin",formData);
          console.log("signin response is ", response);
          toast.success("Signin Successfull");
          tokenWithBearer = `Bearer ${response.data.token}`;
          localStorage.setItem("token",tokenWithBearer);
          setTimeout(() => {
            navigate("/dashboard");
          }, 500);
          
        }
        catch(err){
        console.log("signin err is ", err);
        toast.error(err.response.data.message);
      }
  };

  return (
    <div className='bg-gradient-to-r from-blue-500 to-purple-500 min-h-screen flex justify-center items-center'>
      <div className='max-w-[500px] min-w-[400px] p-7 border-2 h-fit flex flex-col gap-3 rounded-lg'>
        <div className='flex flex-col items-center'>
          <h1 className='font-bold text-3xl'>Sign In</h1>
          <p className='text-zinc-700 font-semibold text-lg text-center'>Enter your credentials to sign in</p>
        </div>
        <form onSubmit={handleSubmit}>

          <div className='flex flex-col gap-2 mt-[-10px]'>
            <div className='flex flex-col gap-1'>
              <label htmlFor='email' className='font-semibold'>Email</label>
              <input type="email" id="email" name="username" value={formData.username} onChange={handleChange} className='p-2 border-neutral-500 border-2 rounded-md' placeholder='Enter your email' required/>
            </div>

            <div className='flex flex-col gap-1'>
              <label htmlFor='password' className='font-semibold'>Password</label>
              <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className='p-2 border-neutral-500 border-2 rounded-md' placeholder='Enter your password' required/>
            </div>
          </div>

          <div className='flex flex-col gap-3 items-center mt-3'>
            <button className='text-white bg-neutral-900 py-3 rounded-lg self-stretch hover:bg-neutral-800 transition-all duration-300'>Sign In</button>
            <p>Don't have an account? <Link to="/signup" className='underline'>Sign Up</Link></p>
          </div>
        </form>
        
      </div>
    </div>
  );
}

export default SignIn;
