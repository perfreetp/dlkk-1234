import { NavLink, useLocation } from 'react-router-dom'
import { LayoutGrid, Wrench, BookOpen, ClipboardList, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { path: '/plaza', label: '工具广场', icon: LayoutGrid },
  { path: '/workspace', label: '工作台', icon: Wrench },
  { path: '/prompts', label: '提示词库', icon: BookOpen },
  { path: '/records', label: '任务记录', icon: ClipboardList },
  { path: '/team', label: '团队空间', icon: Users },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 glass-strong z-40 flex flex-col">
      <div className="px-6 py-6 border-b border-indigo-500/10">
        <h1 className="font-display text-xl font-bold text-gradient-amber">
          AI 工具箱
        </h1>
        <p className="text-xs text-slate-400 mt-1 font-body">内容团队智能工具平台</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-amber-500/10 text-amber-400 glow-amber'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-indigo-500/10'
              )}
            >
              <Icon className={cn('w-5 h-5', isActive && 'text-amber-400')} />
              <span>{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400" />
              )}
            </NavLink>
          )
        })}
      </nav>

      <div className="px-4 py-4 border-t border-indigo-500/10">
        <div className="glass rounded-xl p-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-sm font-bold text-indigo-950">
              李
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate">李明</p>
              <p className="text-xs text-slate-500">团队管理员</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
