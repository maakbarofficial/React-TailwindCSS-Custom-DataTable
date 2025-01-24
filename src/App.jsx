import { useState } from "react"

function App() {
  const [theme, setTheme] = useState('light')

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <div className={`${theme}`}>
      <button onClick={toggleTheme} className="bg-blue-500 text-white p-2 rounded-md cursor-pointer">Theme Toggle</button>
      <h1 class="text-3xl font-bold underline bg-white dark:bg-black dark:text-white">
        Hello world!
      </h1>
    </div>
  )
}

export default App
