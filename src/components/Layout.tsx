import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function Layout() {
  return (
    <div className="min-h-screen bg-surface noise-bg">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-glow-pulse" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-500/3 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: '1.5s' }} />
      </div>
      <Sidebar />
      <main className="ml-64 relative z-10 min-h-screen">
        <Outlet />
      </main>
    </div>
  )
}
