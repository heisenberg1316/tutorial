import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Avatar from "./Avatar";
import { FiArrowLeft } from 'react-icons/fi'
import { memo } from "react";

interface AppBarProps {
  isCreateBlog: boolean;
  isHomeOrBlogs : boolean;
  onBackClick: () => void;
}

const AppBar = memo(({isCreateBlog, isHomeOrBlogs, onBackClick} : AppBarProps) => {
  const { isLoggedIn, loading } = useAuth();

  return (
    <div className="flex justify-between items-center -mx-6 bg-white shadow-sm  py-4 sticky top-0 z-40">
      <div className="flex items-center gap-3 mx-1 sm:mx-5">
        {
          !isHomeOrBlogs && (
            <FiArrowLeft onClick={onBackClick} size={40} className="py-2 cursor-pointer hover:bg-gray-100 rounded" />
          )
        }

        <Link to="/" className="font-bold text-md sm:text-xl lg:text-2xl">Medium</Link>
      </div>

      {/* 👇 Don't show anything until loading is false */}
      {!loading && (
        <nav className="flex gap-3 mx-1 sm:mx-5">
          {isLoggedIn ? (
            <div className="flex gap-2 items-center">
              { !isCreateBlog && (

                <Link
                to="/createblog"
                className="inline-flex text-center text-xs sm:text-lg items-center justify-center px-3 py-2 lg:px-4 rounded-lg bg-black text-white hover:bg-gray-700 transition"
                >
                  Create Blog
                </Link>
              )}
              <Avatar />
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="signin"
                className="font-medium text-md rounded-xl px-3 py-1 sm:px-4 sm:py-1 sm:text-md bg-gray-100 hover:bg-gray-300"
              >
                Sign In
              </Link>
              <Link
                to="signup"
                className="font-medium text-md rounded-xl px-3 py-1 sm:px-4 sm:py-1 sm:text-md bg-gray-100 hover:bg-gray-300"
              >
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      )}
    </div>
  );
});

export default AppBar;
