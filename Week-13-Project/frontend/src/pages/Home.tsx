import axios from "axios";
import { useAuth } from "../context/AuthContext"
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import api from "../api/axios";

const Home = () => {

  const {logout} = useAuth();
  const {isLoggedIn} = useAuth();
  const navigate = useNavigate();

  
  useEffect(() => {
    if(isLoggedIn==false) navigate("/signin");

  }, [])

  const logoutFull = async () => {
      await api.get("/api/v1/user/logout", {withCredentials : true});
      logout();
      navigate("/signin");
  }

  return (
    <div>
      <div>Home</div>
      <button onClick={logoutFull}>Logout</button>
      <Outlet />
    </div>
  )
}

export default Home