import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const getInitials = (name: string) => {
  const words = name.trim().split(' ');
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};

const Avatar = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const toggleDropdown = () => setOpen((prev) => !prev);

  const logOutFull = async () => {
      await logout();
      navigate("/signin");
      alert("Logout successfull");
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

  const initials = getInitials(user.name);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar button */}
      <button
        onClick={toggleDropdown}
        className="w-10 h-10 rounded-full  cursor-pointer bg-blue-600 text-white flex items-center justify-center font-bold text-lg"
        title={user.name}
      >
        {initials}
      </button>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-36 bg-white border shadow-lg rounded-md z-50">
          <div className="flex items-center justify-between px-3 py-2 border-b">
            <span className="text-sm font-semibold">Close</span>
            <button onClick={() => setOpen(false)} className="text-gray-500 cursor-pointer hover:text-red-500 hover:font-extrabold text-sm">✕</button>
          </div>
          <button
            onClick={logOutFull}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Avatar;
