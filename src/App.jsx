import { useState } from 'react'
import CalendarApp from "./components/calendarApp.jsx"
import './components/calendarApp.css'

const App = () =>{
  const [count, setCount] = useState(0)

  return (
      <div className='container'>
        <CalendarApp/>
      </div>
  )
}

export default App;
