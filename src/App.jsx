import { useState } from "react"
import { FaSun, FaMoon } from "react-icons/fa";
import DataTable from "./DataTable";
import { data } from "./Data";

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
      <div className="p-5">
        <DataTable data={data} searchBar={true} pagination={true} removableRows={true} excelExport={true} />
      </div>
    </div>
  )
}

export default App
