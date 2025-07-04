import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar'; // ⬅️ Extracted
import { useState } from 'react';
import counterContext from './counterContext';

const App = () => {
  console.log("App re-render");
  const [count, setCount] = useState(0);
  return (
    <div>
      <button onClick={() => {setCount(count+1)}}>Increment : Count is {count}</button>
      <Navbar />
      <hr />
      <counterContext.Provider value={{count, setCount}}>
          <Outlet /> {/* Route children (Landing, Dashboard, etc.) render here */}
      </counterContext.Provider>
    </div>
  );
};

export default App;
 