import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar'; // ⬅️ Extracted
import { useRecoilState } from 'recoil';
import { countState } from './atoms/counterAtom';

const App = () => {
  console.log("App re-render");
   const [count, setCount] = useRecoilState(countState);
  return (
    <div>
      <button onClick={() => {setCount(count+1)}}>Increment : Count is {count}</button>
      <Navbar />
      <hr />
      <Outlet /> {/* Route children (Landing, Dashboard, etc.) render here */}
    </div>
  );
};

export default App;
 