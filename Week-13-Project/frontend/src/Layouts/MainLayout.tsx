import { Outlet } from "react-router-dom";
import AppBar from "../components/Appbar";

const MainLayout = () => {
  return (
    <div className="min-h-screen px-6 flex flex-col bg-gray-100">
        <AppBar />
        <Outlet />
    </div>
  );
};

export default MainLayout;
