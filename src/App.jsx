import { useState } from "react"
import { FaSun, FaMoon } from "react-icons/fa";

function App() {
  const [theme, setTheme] = useState('light')

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <div className={`${theme}`}>
      <div className="flex justify-center items-center p-2">
        <button onClick={toggleTheme} className="cursor-pointer">{theme === "light" ? <FaSun /> : <FaMoon />}</button>
      </div>
      <h1 class="text-3xl font-bold underline bg-white dark:bg-black dark:text-white">
        Hello world!
      </h1>
    </div>
  )
}

export default App
