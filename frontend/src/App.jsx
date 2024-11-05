import { Route, Routes } from 'react-router-dom'
import Home from './pages/home'
import Bus from './utils/Bus'

window.flash = (message, type="success") => Bus.emit('flash', ({message, type}))

function App() {
    return (
      <Routes>
        <Route path='/' Component={Home}/>
      </Routes>
    )
}

export default App