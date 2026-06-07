import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Extinguishers from './pages/Extinguishers'
import Inspections from './pages/Inspections'
import MaintenanceLogs from './pages/MaintenanceLogs'
import Reports from './pages/Reports'
import Layout from './components/Layout'

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="extinguishers" element={<Extinguishers />} />
          <Route path="inspections" element={<Inspections />} />
          <Route path="maintenance" element={<MaintenanceLogs />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}