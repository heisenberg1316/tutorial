import { Link } from "react-router-dom";
import Quote from "../components/Quote";
import { useState } from "react";
import type { SignupInput } from "@mukul1316/common";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FiCamera, FiUser } from "react-icons/fi";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [bio, setBio] = useState("");
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }
            
            // Validate file size (1MB limit)
            if (file.size > 1024 * 1024) {
                alert('Image size should be less than MB');
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                setProfileImage(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setProfileImage(null);
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profileImage) {
            alert("Please upload a profile image");
            return;
        }

        setLoading(true);
        
        const signupData: SignupInput = { 
            name, 
            email, 
            password,
            bio: bio.trim() || "",
            profileImage: profileImage || ""
        };
        
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
            console.log("zod is ", zodErrors);
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
        <div className="flex flex-1">
            <div className="flex-1 lg:flex-[0.5] flex items-center justify-center py-4">
                <div className="flex flex-col gap-3 w-[85%] lg:w-[65%] xl:w-[55%]">
                    <div className="text-center mb-2">
                        <h1 className="text-2xl font-bold mb-1">Create an account</h1>
                        <p className="text-gray-400 font-medium text-sm">
                            Already have an account?{" "}
                            <Link to="/signin" className="underline">
                                Sign in
                            </Link>
                        </p>
                    </div>

                    <form className="space-y-3" onSubmit={onSubmit}>
                        {/* Profile Image Upload */}
                        <div className="flex flex-col items-center gap-2">
                            <div className="relative">
                                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                                    {profileImage ? (
                                        <img
                                            src={profileImage || "/placeholder.svg"}
                                            alt="Profile preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <FiUser className="w-5 h-5 text-gray-400" />
                                    )}
                                </div>
                                
                                {/* Camera Icon Overlay */}
                                <label
                                    htmlFor="profile-image"
                                    className="absolute bottom-0 right-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors shadow-lg"
                                >
                                    <FiCamera className="w-3 h-3 text-white" />
                                </label>
                                
                                <input
                                    id="profile-image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </div>
                            
                            <div className="text-center">
                                <p className="text-xs text-gray-600">Upload profile picture</p>
                                {profileImage && (
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="text-xs text-red-500 hover:text-red-700"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Name Input */}
                        <div className="flex flex-col gap-1">
                            <label htmlFor="name" className="font-medium text-sm">Name</label>
                            <input
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                id="name"
                                type="text"
                                placeholder="Enter your full name"
                                className="bg-gray-100 px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Email Input */}
                        <div className="flex flex-col gap-1">
                            <label htmlFor="email" className="font-medium text-sm">Email</label>
                            <input
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                className="bg-gray-100 px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Bio Input */}
                        <div className="flex flex-col gap-1">
                            <label htmlFor="bio" className="font-medium text-sm">
                                Bio <span className="text-gray-400 font-normal">(optional)</span>
                            </label>
                            <textarea
                                required
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                id="bio"
                                placeholder="Tell us a bit about yourself..."
                                rows={2}
                                maxLength={200}
                                className="bg-gray-100 px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                            />
                            <div className="text-xs text-gray-500 text-right">
                                {bio.length}/200
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="flex flex-col gap-1 relative">
                            <label htmlFor="password" className="font-medium text-sm">Password</label>
                            <input
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                className="bg-gray-100 px-3 py-2 pr-10 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-3 top-[65%] transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                {showPassword ? (
                                    <AiOutlineEyeInvisible size={16} />
                                ) : (
                                    <AiOutlineEye size={16} />
                                )}
                            </button>
                        </div>

                        {/* Submit Button */}
                        <div className="mt-4">
                            <button
                                disabled={loading}
                                className="bg-white text-black w-full px-3 py-2.5 text-sm rounded-lg hover:bg-black hover:text-white border transition-all duration-200 font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Creating account..." : "Sign up"}
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