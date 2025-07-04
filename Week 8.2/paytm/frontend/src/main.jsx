import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import "./styles/tailwind.css"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from "./context/AuthContext.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
     <AuthProvider>
        <App />    
        <ToastContainer />
     </AuthProvider>
)
