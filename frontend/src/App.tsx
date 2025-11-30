import './App.css'
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom"
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import PrivateRoute from './components/PrivateRoute'
import { useAuth } from './context/AuthContext'
import LandingPage from './pages/LandingPage'
import Navbar from './components/Navbar'

function App() {

  const {user} = useAuth();

  const hiddenNavbarOnRoutes = ['/dashboard']

  const shouldHideNavbar = hiddenNavbarOnRoutes.includes(location.pathname);

  return (
    <div className='flex flex-col min-h-screen'>
      {!shouldHideNavbar && <Navbar />}

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
          path='/home' 
          element={
          !user ? <LandingPage /> : <Navigate to='/dashboard' />
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
