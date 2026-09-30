import { useLocation } from 'react-router-dom'
import AppRouter from './router/AppRouter'
import FloatingAssistantWidget from './components/assistant/FloatingAssistantWidget'

// FloatingAssistantWidget is mounted once here, outside the route switch,
// so it stays present on every public/auth page. It is explicitly hidden on
// /admin/* routes — the admin panel is a fully isolated internal tool and
// must not show the public-facing assistant.
export default function App() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <>
      <AppRouter />
      {!isAdminRoute && <FloatingAssistantWidget />}
    </>
  )
}
