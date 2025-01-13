import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'

import AddMap from './pages/admin/theater/AddMap/AddMap'

function App() {

  return (
    <BrowserRouter>
        <Routes>
          <Route path='/theater/addmap' element={ <AddMap /> }></Route>
        </Routes>
    </BrowserRouter>
  )
}

export default App
