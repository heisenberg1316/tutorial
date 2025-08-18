"use client"

import axios from "axios"
import { useState } from "react"


const Signup = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [details, setDetails] = useState({
    name : "",
    email : "",
  });

  const submitData = async () => {  
    await new Promise(resolve => setTimeout(resolve, 2000));
    const response = await axios.post("http://localhost:3000/api/user", {name, email} )
    console.log("response is ", response);
    setDetails(response.data);
    
}

  return (
    <div className="w-xl max-w-4xl">
        <h1 className="text-center font-bold">Sign Up page</h1>
        <form className="flex flex-col gap-2" onSubmit={(e) => {
          e.preventDefault();
          submitData();
        }}>
          <input className="p-2 border-2 rounded-md" required onChange={(e) => setName(e.target.value)} type="text" placeholder="enter your name" value={name}></input>
          <input className="p-2 border-2 rounded-md"  required onChange={(e) => setEmail(e.target.value)} type="email" placeholder="enter your email" value={email}></input>
          <button className="p-2 border-2 rounded-md hover:bg-gray-300 cursor-pointer">submit</button>
        </form>
        
        <div>
          <h1 className="mt-5 font-bold text-2xl">User Details :-{">"}</h1>
          <p>Name is : {details?.name}</p>
          <p>Email is : {details?.email}</p>
        </div>

        
    </div>
  )
}

export default Signup