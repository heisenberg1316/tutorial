import { Fragment, memo, useState } from 'react'

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
        <button onClick={() => {setCount(count+1)}} style={{padding : 20, fontSize : 40}}>Count is {count}</button>
        <Child />
        <Child />
        <Child />
    </div>
  )
}
const Child = memo(function(){
  console.log("Child rendered");
  return <div>
    <h1>Hello world</h1>
  </div>
})

export default App
