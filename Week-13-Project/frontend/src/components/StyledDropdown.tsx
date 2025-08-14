"use client"

import { useNavigate } from "react-router-dom"

export default function StyledDropdown({ setOpen, logOutFull }) {
    const navigate = useNavigate();

    return (
        <div className="absolute flex flex-col right-0 mt-2 w-48 bg-white border shadow-xl rounded-lg z-50 overflow-hidden">
        <div
            onClick={() => {
            setOpen(false)
            }}
            className="flex group hover:bg-gray-50 hover:cursor-pointer items-center justify-between px-4 py-3 border-b border-gray-100 transition-colors duration-150"
        >
            <span className="text-sm font-medium text-gray-700">Close</span>
            <button className="text-gray-400 cursor-pointer text-sm group-hover:text-gray-600 transition-colors duration-150">
            ✕
            </button>
        </div>

        <div
            onClick={() => {
            setOpen(false)
            navigate("/my-profile")
            }}
            className="px-4 py-3 text-sm font-medium border-b border-gray-100 hover:bg-blue-50 hover:text-blue-600 hover:cursor-pointer transition-colors duration-150 flex items-center gap-3"
        >
            <span>👤</span>
            My profile
        </div>

        <div
            onClick={() => {
            setOpen(false)
            navigate("/blogs")
            }}
            className="px-4 py-3 text-sm font-medium border-b border-gray-100 hover:bg-blue-50 hover:text-blue-600 hover:cursor-pointer transition-colors duration-150 flex items-center gap-3"
        >
            <span>📝</span>
            Blogs
        </div>

        <button
            onClick={logOutFull}
            className="w-full font-medium text-left px-4 py-3 text-sm hover:bg-red-50 hover:text-red-600 hover:cursor-pointer transition-colors duration-150 flex items-center gap-3 text-gray-700"
        >
            <span>🚪</span>
            Logout
        </button>
        </div>
    )
}
