import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from '../context/FormContext';
import StyledDropdown from './StyledDropdown';

const Avatar = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {setBlogPost, setImagePreview} = useForm();

  const toggleDropdown = () => setOpen((prev) => !prev);

  const logOutFull = async () => {
      await logout();
      queryClient.clear();
      setBlogPost({
          title: "",
          content: "",
          published: false,
          tags: [],
          image: null,
        })
      setImagePreview(null);
        
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
        <StyledDropdown setOpen={setOpen} logOutFull={logOutFull}/>
      )}
    </div>
  );
};

export default Avatar;
