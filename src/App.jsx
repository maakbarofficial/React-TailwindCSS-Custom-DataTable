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
    <div className={`${theme} ${theme === "light" ? "bg-[#ededed] text-black" : "dark:bg-gray-900 dark:text-white"} h-screen`}>
      <div className="flex justify-center items-center p-2">
        <button onClick={toggleTheme} className="cursor-pointer flex justify-center items-center gap-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">{theme === "light" ? <FaSun /> : <FaMoon />} Toggle Theme</button>
      </div>
      <div className="flex justify-center items-center p-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
        <h1>React Tailwind CSS Custom DataTable</h1>
      </div>
      <div className="p-5">
        <DataTable data={data} searchBar={true} pagination={true} removableRows={true} excelExport={true} pageSizeControl={true} />
      </div>
    </div>
  )
}

export default App
