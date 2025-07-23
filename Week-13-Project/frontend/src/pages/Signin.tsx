import { Link, useNavigate } from "react-router-dom";
import Quote from "../components/Quote";
import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import type { SigninInput } from "@mukul1316/common";

const Signin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { login } = useAuth(); // ✅ context
    const navigate = useNavigate();

    const onSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const signinData: SigninInput = { email, password };
      setLoading(true);
      
      try {
          const result = await api.post("/api/v1/user/signin", signinData);          
          
          // ✅ call /me to confirm login & get user
          // const res = await api.get("/api/v1/user/me");


          // if (res.data) {
          login(); // sets isLoggedIn: true in context
          navigate("/home"); // redirect to home
          alert("signin successfull");
          // }
          // else {
          //     alert("Signin failed. Try again.");
          // }
      }
      catch (err: any) {
            console.log(err);
            const backendError = err.response?.data?.error;
            if (typeof backendError === "string" && backendError.length > 0) {
                alert(backendError);
                return;
            }

            const zodErrors = err.response?.data?.error?.properties;
            console.log("zod is ",zodErrors);
            if (zodErrors) {
                const allMessages = Object.entries(zodErrors)
                    .map(([fieldName, info]: [string, any]) => {
                        const msg = info.errors?.[0] || "Invalid";
                        return `${fieldName[0].toUpperCase() + fieldName.slice(1)}: ${msg}`;
                    })
                    .join("\n");

                alert(allMessages);
            }
            else {
                alert("Signin failed");
            }
      }
      finally {
          setLoading(false);
      }
};

  return (
    <div className="flex">
      <div className="flex-1 lg:flex-[0.5] min-h-screen flex items-center justify-center">
        <div className="flex flex-col gap-4 w-[80%] lg:w-[55%] xl:w-[45%]">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Already have an account</h1>
            <p className="text-gray-400 font-semibold">
              Don't have an account?{" "}
              <Link to="/signup" className="underline">Sign up</Link>
            </p>
          </div>

          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="font-semibold">Email</label>
              <input
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                type="email"
                placeholder="Enter your email"
                className="bg-gray-100 px-2 py-3 rounded-lg border-1"
              />
            </div>

            <div className="flex flex-col gap-1 relative">
              <label htmlFor="password" className="font-semibold">Password</label>
              <input
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="bg-gray-100 px-2 py-3 rounded-lg border-1 pr-10"
              />
              <span
                className="absolute right-3 top-11 cursor-pointer text-sm text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>

            <div className="mt-8">
              <button
                disabled={loading}
                className="bg-white text-black w-full px-2 py-3 rounded-lg hover:bg-black hover:text-white border-1"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Quote />
    </div>
  );
};

export default Signin;
