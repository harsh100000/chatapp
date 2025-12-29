import {BrowserRouter, Routes, Route} from 'react-router-dom' 
import HomePage from './pages/HomePage'
import ChatPage from './pages/ChatPage'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { ToastContainer } from 'react-toastify';

const App = () => {
  return (
    <BrowserRouter>
    <ToastContainer />
      <Routes>
        {/* <Route path="/" element={<HomePage/>} /> */}
        <Route path='/' element={<Login/>} />
        <Route path='/signup' element={<Signup/>} />
        <Route path="/chats" element={<ChatPage/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App