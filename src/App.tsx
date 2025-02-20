import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from './components/ui/button'
import { Calendar } from './components/ui/calendar'
import { Switch } from '@radix-ui/react-switch'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <Button variant="destructive"> Click </Button>
        <Calendar mode="range" defaultMonth={new Date(2023, 0, 1)} />
        <Switch defaultChecked  className="data-[state=checked]:bg-primary" />
      </div>
    </>
  )
}

export default App
