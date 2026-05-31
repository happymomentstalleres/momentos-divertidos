import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Loader from './Loader'

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return <Loader fullScreen />
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />
  return <Outlet />
}
