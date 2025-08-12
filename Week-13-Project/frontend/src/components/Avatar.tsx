import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

const Avatar = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const toggleDropdown = () => setOpen((prev) => !prev);

  const logOutFull = async () => {
      await logout();
      queryClient.clear();
      navigate("/signin");
  }

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user?.name) return null;


  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar button */}
      <button
        onClick={toggleDropdown}
        className="w-10 h-10 rounded-full overflow-hidden cursor-pointer"
      >
        <img
          src={user.imageLink}
          alt="User avatar"
          className="w-full h-full object-cover"
        />
      </button>


      {/* Dropdown menu */}
      {open && (
        <div className="absolute flex flex-col right-0 mt-2 w-36 bg-white border shadow-lg rounded-md z-50">
          <div onClick={() => {setOpen(false)}} className="flex group hover:bg-gray-100  hover:cursor-pointer items-center justify-between px-3 py-2 border-b">
            <span className="text-sm font-semibold">Close</span>
            <button className="text-gray-500 cursor-pointer text-sm group-hover:font-extrabold group-hover:text-red-500">✕</button>
          </div>
          <div onClick={() => {
            setOpen(false);
            navigate("/my-profile");
          }} className='px-3 py-2 text-sm font-semibold border-b hover:bg-gray-100 hover:cursor-pointer'>
            My profile
          </div>
           <div onClick={() => {
            setOpen(false);
            navigate("/blogs");
          }} className='px-3 py-2 text-sm font-semibold border-b hover:bg-gray-100 hover:cursor-pointer'>
            Blogs
          </div>
          <button
            onClick={logOutFull}
            className="w-full font-semibold text-left px-3 py-2 text-sm hover:bg-gray-100 hover:cursor-pointer"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Avatar;
