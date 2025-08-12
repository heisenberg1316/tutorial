import { Outlet, useLocation, useMatch, useNavigate } from "react-router-dom";
import AppBar from "../components/Appbar";
import { useCallback } from "react";

const MainLayout = () => {
  // This only changes when you enter/leave "/createblog"
  const { pathname } = useLocation();
  const isCreateBlog = pathname == "/createblog";
  const isHomeOrBlogs = (pathname=="/" || pathname=="/blogs");


  const navigate = useNavigate();

  // memoize once
  const handleBack = useCallback(() => navigate(-1), [navigate]);

  return (
    <div className="min-h-screen px-6 flex flex-col  bg-gray-50 relative">
        <AppBar isCreateBlog={isCreateBlog} isHomeOrBlogs={isHomeOrBlogs}  onBackClick={handleBack}/>
        <Outlet />
    </div>
  );
};

export default MainLayout;
