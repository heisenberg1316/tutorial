import { memo } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  console.log("Navbar : re-render");

  return (
    <nav>
      <Link to="/">Landing</Link> | <Link to="/dashboard">Dashboard</Link> | <Link to="/about">About</Link>
      <div>
        <h4>hello world</h4>
      </div>
    </nav>
  );
};

export default Navbar;
