"use client"

import axios from "axios"
import { useState } from "react"


const Signup = () => {

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [details, setDetails] = useState({
    name : "",
    password : "",
  });

  const submitData = async () => {  
    const response = await axios.post("http://localhost:3000/api/user", {name, password} )
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
          <input className="p-2 border-2 rounded-md" required onChange={(e) => setName(e.target.value)} type="text" placeholder="enter your username" value={name}></input>
          <input className="p-2 border-2 rounded-md"  required onChange={(e) => setPassword(e.target.value)} type="password" placeholder="enter your password" value={password}></input>
          <button className="p-2 border-2 rounded-md hover:bg-gray-300 cursor-pointer">submit</button>
        </form>
      

        
    </div>
  )
}

export default Signup