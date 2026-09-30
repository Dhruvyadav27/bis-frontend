import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function RequireRole({ role = 'ADMIN', children }) {
  const { user, isLoggedIn } = useAuthStore()

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  const currentRole = (user?.role || user?.userType || '').toUpperCase()
  const targetRole = role.toUpperCase()

  if (currentRole !== targetRole) {
    return <Navigate to="/app/home" replace />
  }

  return children ? children : <Outlet />
}
