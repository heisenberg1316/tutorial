import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import {toast} from "react-toastify";

function SendMoney() {
  const [friendName, setFriendName] = useState('');
  const [amount, setAmount] = useState(0);
  const [searchParams] = useSearchParams();
  const id =  searchParams?.get("id");
  const name = searchParams?.get("name");
  const navigate = useNavigate();

  useEffect(() =>{
    setFriendName(name);
  },[])


  const handleSubmit = async (e) => {
    e.preventDefault();
    let token = localStorage.getItem("token");
    let data = {
      amount : amount,
      to : id
    }
    if(amount==0){
      toast.warning("Amount is 0");
      return;
    }
    try{
        let response = await axios.post("http://localhost:4000/api/v1/account/transfer",data,{
        headers : {
          Authorization : token,
        }
      });
      console.log("response is",response);
      if(response?.data){
          toast.success("Money Send Successfully");
          setTimeout(() => {
            navigate("/dashboard");
          }, 500);
      }

    }
    catch(err){
      console.log('error is',err);
      if(err?.response?.data?.message){
        toast.error(err.response.data.message);
      }
      else{
        toast.error(err.message);
      }
      
    }
    
  };

  return (
    <div className='flex items-center justify-center min-h-screen'>
          <div className="container mx-auto py-8 px-6 max-w-[400px] border-2">
          <h1 className="text-3xl font-bold text-center mb-14">Send Money</h1>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <div className="flex gap-3 items-center text-white">
              <h1 className='bg-green-600 py-2 px-4 rounded-full'>{friendName?.[0]}</h1>
              <label htmlFor="friendName" className="text-gray-700 font-bold text-2xl">
                {friendName}
              </label>
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="amount" className="text-gray-700 font-bold">
                Amount (in Rs)
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white rounded-md font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Initiate Transfer
            </button>
          </form>
        </div>
    </div>

  );
}

export default SendMoney;
