
import { useState } from 'react'
import './App.css'
import { Button } from './components/ui/button'

function App() {
  const [count, setCount] = useState(0)

  const handleClick = () => {
    setCount(count + 1)
  }


  return (
    <>
      <div>
        <p>{count}</p>
        <Button onClick={handleClick}>Click me</Button>
      </div>
    </>
  )
}

export default App
