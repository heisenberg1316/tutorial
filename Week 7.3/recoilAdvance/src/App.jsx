import './App.css'
import { useRecoilValue } from "recoil";
import { jobsAtom, messagingAtom, networkAtom, notificationAtom, selectorForValues, total } from "./atoms/atoms";

function App() {
  const networkNotificationCount = useRecoilValue(networkAtom);
  const jobsCount = useRecoilValue(jobsAtom);
  const messagingCount = useRecoilValue(messagingAtom);
  const notificationCount = useRecoilValue(notificationAtom);


  const allValues = useRecoilValue(total);
  const total2 = useRecoilValue(selectorForValues);
    
  return (
    <>
      <div>
        <h2>without async</h2>
        <button>Home</button>
        <button>My network {networkNotificationCount>=100 ? "99+" : networkNotificationCount}</button>
        <button>Jobs {jobsCount}</button>
        <button>Messaging {messagingCount}</button>
        <button>Notiications {notificationCount}</button>
        <button>Me</button>
        
        <h2>with async</h2>
        <button>Home</button>
        <button>My network {allValues.network>=100 ? "99+" : allValues.network}</button>
        <button>Jobs {allValues.jobs}</button>
        <button>Messaging {allValues.messaging}</button>
        <button>Notiications {allValues.notifications}</button>
        <button>Total is {total2}</button> 
        </div>
    </>
  )
}

export default App
