import { useEffect, useState } from 'react'
import { CreateTodo } from '../components/CreateTodo'
import { Todos } from '../components/Todos';

function App() {
  const [todos, setTodos] = useState([]);
  
  useEffect(() => {
    const fetchTodos = async () => {
      let res = await fetch("http://localhost:3000/todos");
      res = await res.json();
      console.log("res is ", res);
      setTodos(res.data);
    };

    fetchTodos();
  }, []); // empty dependency array ensures this runs once on mount

  return (
    <div>
      <CreateTodo />
      <Todos todos = {todos}></Todos>
    </div>
  )
}

export default App
