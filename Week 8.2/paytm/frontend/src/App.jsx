import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./components/Landing";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import Dashboard from "./components/Dashboard";
import SendMoney from "./components/SendMoney";

function App() {
  const token = localStorage.getItem("token");

  // Function to check if the user is authenticated
  const isAuthenticated = () => {
    return !!token; // Returns true if token is present, false otherwise
  };

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          {/* Protected routes with authentication check */}
          <Route
            path="/dashboard"
            element={isAuthenticated() ? <Dashboard /> : <Navigate to="/signin" />}
          />
          <Route
            path="/send"
            element={isAuthenticated() ? <SendMoney /> : <Navigate to="/signin" />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
