import { Link } from "react-router-dom";
import Quote from "../components/Quote";
import { useState } from "react";
import type { SignupInput } from "@mukul1316/common";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const signupData: SignupInput = { name, email, password };

        try {
            const res = await api.post("/api/v1/user/signup", signupData);
            alert("Signup successful");
            navigate("/signin");
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
                alert("Signup failed");
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
                        <h1 className="text-3xl font-bold">Create an account</h1>
                        <p className="text-gray-400 font-semibold">
                            Already have an account?{" "}
                            <Link to="/signin" className="underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                    <form className="space-y-4" onSubmit={onSubmit}>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="name" className="font-semibold">Name</label>
                            <input
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                id="name"
                                type="text"
                                placeholder="Enter your name"
                                className="bg-gray-100 px-2 py-3 rounded-lg border-1"
                            />
                        </div>
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
                                className="bg-gray-100 px-2 py-3 pr-10 rounded-lg border-1"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-3 top-[70%] transform -translate-y-1/2 cursor-pointer text-gray-500"
                            >
                                {showPassword ? (
                                    <AiOutlineEyeInvisible size={20} />
                                ) : (
                                    <AiOutlineEye size={20} />
                                )}
                            </button>
                        </div>
                        <div className="mt-8">
                            <button
                                disabled={loading}
                                className="bg-white text-black w-full px-2 py-3 rounded-lg hover:bg-black hover:text-white border-1"
                            >
                                {loading ? "Signing up..." : "Sign up"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <Quote />
        </div>
    );
};

export default Signup;
