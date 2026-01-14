import './App.css'
import SimpleData from './components/SimpleData'
import { HashRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<SimpleData />}/>
      </Routes>
    </HashRouter>
    // <div>
    //   <Data></Data>
    // </div>
  )
}

export default App
