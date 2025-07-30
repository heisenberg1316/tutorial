import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Avatar from "./Avatar";
import { FiArrowLeft } from 'react-icons/fi'

const AppBar = () => {
  const { isLoggedIn, loading } = useAuth();
  const location = useLocation()

  // true when path is exactly “/createblog” (or adjust to `.includes("createblog")`)
  const onCreateBlogPage = location.pathname === "/createblog"
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center -mx-6 bg-white shadow-sm  py-4">
      <div className="flex items-center gap-3 mx-1 sm:mx-5">
        {
          onCreateBlogPage && (
            <FiArrowLeft onClick={() => navigate(-1)} size={40} className="py-2 hover:bg-gray-100 rounded" />
          )
        }

        <Link to="/" className="font-bold text-md sm:text-xl lg:text-2xl">Medium</Link>
      </div>

      {/* 👇 Don't show anything until loading is false */}
      {!loading && (
        <nav className="flex gap-3 mx-1 sm:mx-5">
          {isLoggedIn ? (
            <div className="flex gap-2 items-center">
              { !onCreateBlogPage && (

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
};

export default AppBar;
