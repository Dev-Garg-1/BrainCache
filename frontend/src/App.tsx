import './App.css'
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom"
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import PrivateRoute from './components/PrivateRoute'
import { useAuth } from './context/AuthContext'

function App() {

  const {user} = useAuth();

  return (
    <div className='flex flex-col min-h-screen'>
      <Router>
        <Routes>

          <Route 
          path='/login' 
          element={
          !user ? <Login /> : <Navigate to='/dashboard' />
          } />

          <Route 
          path='/signup' 
          element={
          !user ? <Signup /> : <Navigate to='/dashboard' />
          } />

          <Route 
          path='/*' 
          element={
          !user ? <Login /> : <Navigate to='/dashboard' />
          } />

          <Route 
          path='/dashboard'
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
          />

        </Routes>
      </Router>
    </div>
  )
}

export default App
