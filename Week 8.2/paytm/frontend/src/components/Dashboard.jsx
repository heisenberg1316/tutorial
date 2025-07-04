import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

function Dashboard() {

  const navigate = useNavigate();
  const [userAccount,setUserAccount] = useState({
     firstName : "",
     lastName : "",
     id : "",
  });
  const [balance,setBalance] = useState(0);
  const [filterData,setFilterData] = useState("");
  const [allpeoples,setAllPeoples] = useState([]);
  let token = localStorage?.getItem("token");

  function handleButton(userId,firstName){
    navigate(`/send?id=${userId}&name=${firstName}`);
  }

  function loggingout(){
    localStorage.removeItem("token");
    toast.success("You are Logged Out Successfully");
    navigate("/");
  }

  async function userDetails(){
    try{
      let response = await axios.get("http://localhost:4000/api/v1/user/userdetail",{
        headers : {
          Authorization : token,
        }
      });
      let peoples = await axios.get(`http://localhost:4000/api/v1/user/bulk?filter=${filterData}`,{
        headers : {
          Authorization : token,
        }
      });

      let amount = await axios.get("http://localhost:4000/api/v1/account/balance",{
        headers : {
          Authorization : token,
        }
      })
      setBalance(parseInt(amount?.data?.balance))
      setAllPeoples(peoples?.data?.user);

      setUserAccount({
        firstName : response?.data?.firstName,
        lastName : response?.data?.lastName,
      })
    }
    catch(err){
      console.log("err is",err);
    }
  }

  function inputChange(e){
    setFilterData(e.target.value);

  }

  useEffect(() => {
     userDetails();
  },[filterData,balance])


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold text-gray-800">Payments App</h1>
        <div className="flex items-center">
          <p className="text-gray-600 mr-2">Hello, {userAccount?.firstName}</p>
          <div className='flex bg-slate-500 rounded-full py-1 px-2 text-white'>
            <h1>{userAccount?.firstName?.[0]}</h1>
            <h1>{userAccount?.lastName?.[0]}</h1>
          </div>

        </div>
      </div>
      <div className='flex justify-end'>
        <button className='bg-red-600 px-3 py-1 text-white rounded-md hover:bg-red-700 transition-all duration-300' onClick={loggingout}>logout </button>
      </div>
      <div className="bg-white shadow-md rounded-md overflow-hidden">
        <div className="px-4 py-5 border-b border-gray-200">
          <p className="text-lg font-bold text-gray-800">Your Balance: Rs. {balance}</p>
        </div>
        <div className="px-4 py-5">
          <h1 className='font-bold mb-3 text-xl'>Users</h1>
          <input
            className="w-full px-3 py-2 mb-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            type="text"
            placeholder="Search users..."
            value={filterData}
            onChange={inputChange}
          />
          <ul className="divide-y divide-gray-200">
            {
              allpeoples?.map((user,index) => {
                return (
                  <li className="py-3 hover:bg-gray-100" key={index}>
                    <div className="flex items-center justify-between">
                      <p className="text-base font-medium text-gray-800">{index+1}. {user?.firstName}</p>
                      <button className="text-white bg-neutral-900 p-2 rounded-lg self-stretch hover:bg-neutral-800 transition-all duration-300" onClick={(e) => {
                        handleButton(user?._id,user?.firstName);
                      }}>Send Money</button>                      
                    </div>
                  </li>
                )
              })
            }
            
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
