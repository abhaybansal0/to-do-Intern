import { useEffect, useState, useRef } from 'react'
import './App.css'
import { v4 as uuidv4 } from 'uuid';



function App() {

  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState([]);
  const [history, setHistory] = useState([])



  const inputChange = (e) => {
    e.preventDefault();
    setInput(e.target.value);
    // console.log(e.target.value)
  }


  const addTodo = (e) => {
    e.preventDefault();

    if (input.trim() === '') {
      return alert('Please Fill All The Fileds!')
    }
    updateHistory(tasks);
    // console.log(tasks);

    setTasks([...tasks, { content: input, id: uuidv4() }]);
    setInput("");
    SavetoStorage([...tasks, { content: input, id: uuidv4() }]);

  }

  const DeleteTask = (id) => {
    updateHistory(tasks);
    const newTasks = tasks.filter((item) => item.id != id);
    setTasks(newTasks);
    SavetoStorage(newTasks)

  }

  const Undo = () => {

    if (history.length > 0) {
      const prevState = history[history.length - 1];
      setHistory(history.slice(0, -1));

      setTasks(prevState);
      // console.log(prevState)
      SavetoStorage(prevState);
    }
    else {
      return alert('Nothing to Undo!');
    }
  }

  // const CtrlUndo = (e) => {
  //   e.preventDefault();
  //   if(e.key === "z" && e.ctrlKey )  Undo();
  //   else return
  // }


  const updateHistory = (currState) => {
    // if(currState.length === 0){
    //   currState = undefined;
    // }
    setHistory((prev) => {
      const newHistory = [...prev, currState];
      // console.log(newHistory);
      return newHistory.length > 5 ? newHistory.slice(1) : newHistory;
    });
  }

  const SavetoStorage = (tasks) => {
    localStorage.setItem('todos', JSON.stringify(tasks));
  }




  useEffect(() => {

    async function loadTasks() {
      const savedTodos = localStorage.getItem('todos');
      if (savedTodos) {
        // console.log(savedTodos);
        setTasks(JSON.parse(savedTodos));
      }
    }
    loadTasks();


    // window.addEventListener('keydown', CtrlUndo);


  }, [])




  const TodoItem = ({ content, id }) => {
    return (
      <>
        <div className='listItem'>
          <input type="checkbox" />
          <span className=''>{content}</span>
          <button onClick={() => DeleteTask(id)}  >Delete</button>
        </div>
      </>
    )
  }

  return (
    <>
      <div className='hero'>

        <h1>To-Do List</h1>

        <form onSubmit={addTodo} className='inputArea'>

          <input type="text"
            placeholder='To-Do Task'
            name='inputTodo'
            value={input}
            onChange={inputChange}
            className='taskInput'
          />

          <button >Add</button>
        </ form>

        <button onClick={Undo}>Undo</button>


        <div className='mainlist'>

          {tasks.map((it, index) => {
            return (
              <TodoItem key={index} content={it.content} id={it.id} />
            )
          })}


        </div>

      </div>
    </>
  )
}

export default App
