import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import Navbar from './components/Navbar'
import Button from './components/Button'
import './styles/main.scss'

function App() {
  const [count, setCount] = useState(0)

  return (
   <div className="App">
      <Navbar />
      <main>
        <h1>Bienvenue sur TALIS - Votre plateforme de stage</h1>
        <p>Test police secondaire</p>
      </main>
    </div>
  )
}

export default App
