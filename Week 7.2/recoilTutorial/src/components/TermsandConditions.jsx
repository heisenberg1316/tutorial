import React, { useContext } from 'react'
import { useRecoilState } from 'recoil';
import { countState } from "../atoms/counterAtom";

const TermsandConditions = () => {
  const [count, setCount] = useRecoilState(countState);
  console.log("t&c re-render");
  return (
    <div>
      <h4>Terms and conditions component is outlet of about</h4>
      <button onClick={() => {setCount(count-1)}}>Decrement : Count is {count} </button>
    </div>
  )
}

export default TermsandConditions