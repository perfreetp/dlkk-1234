import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  Star,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  Plus,
  X,
  Lightbulb,
  Shield,
  AlertTriangle,
  TrendingUp,
  FileText,
  PenLine,
  Image,
  Languages,
  BarChart3,
  Search,
  RefreshCw,
  Wand2,
  Shapes,
  BookOpen,
  FolderSearch,
  Table,
  FileOutput,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import useStore from '@/store/useStore'
import type { ToolCategory, SuggestionSeverity, SuggestionType, ApplicationStatus } from '@/store/useStore'

const tabs = [
  { key: 'recommend', label: '推荐清单', icon: Star },
  { key: 'approval', label: '申请审批', icon: Shield },
  { key: 'roles', label: '岗位视图', icon: Users },
  { key: 'optimize', label: '流程优化', icon: TrendingUp },
] as const

type TabKey = (typeof tabs)[number]['key']

const roleConfig: Record<string, { category: ToolCategory; roles: string[] }> = {
  '文案编辑': { category: 'writing', roles: ['内容运营', '编辑', '市场专员'] },
  '视觉设计师': { category: 'image', roles: ['设计师'] },
  '翻译专员': { category: 'translation', roles: ['翻译'] },
  '数据分析师': { category: 'research', roles: ['数据分析师', '研究员'] },
}

const roleTabs = Object.keys(roleConfig)

const categoryLabels: Record<ToolCategory, string> = {
  writing: '文案写作',
  image: '图像设计',
  translation: '翻译',
  research: '研究分析',
  other: '其他',
}

const categoryColors: Record<ToolCategory, string> = {
  writing: 'bg-blue-500/20 text-blue-300',
  image: 'bg-purple-500/20 text-purple-300',
  translation: 'bg-emerald-500/20 text-emerald-300',
  research: 'bg-cyan-500/20 text-cyan-300',
  other: 'bg-slate-500/20 text-slate-300',
}

const statusConfig: Record<ApplicationStatus, { label: string; className: string }> = {
  pending: { label: '待审批', className: 'bg-amber-500/20 text-amber-300' },
  approved: { label: '已通过', className: 'bg-emerald-500/20 text-emerald-300' },
  rejected: { label: '已拒绝', className: 'bg-red-500/20 text-red-300' },
}

const severityColors: Record<SuggestionSeverity, string> = {
  high: 'bg-red-500',
  medium: 'bg-amber-500',
  low: 'bg-emerald-500',
}

const typeLabels: Record<SuggestionType, { label: string; className: string }> = {
  duplicate: { label: '功能重复', className: 'bg-orange-500/20 text-orange-300' },
  inefficient: { label: '效率优化', className: 'bg-amber-500/20 text-amber-300' },
  outdated: { label: '使用率低', className: 'bg-slate-500/20 text-slate-300' },
}

const iconMap: Record<string, React.ElementType> = {
  PenLine,
  Search,
  RefreshCw,
  Image,
  Wand2,
  Shapes,
  Languages,
  CheckCircle: () => <CheckCircle className="w-5 h-5" />,
  BookOpen,
  FolderSearch,
  FileText,
  Table,
  FileOutput,
}

export default function Team() {
  const [activeTab, setActiveTab] = useState<TabKey>('recommend')
  const [activeRole, setActiveRole] = useState('文案编辑')
  const [addRecommendOpen, setAddRecommendOpen] = useState(false)

  const {
    tools,
    prompts,
    toolApplications,
    optimizationSuggestions,
    toggleToolFavorite,
    approveApplication,
    rejectApplication,
    dismissSuggestion,
  } = useStore()

  const favoritedTools = tools.filter((t) => t.isFavorited)
  const nonFavoritedTools = tools.filter((t) => !t.isFavorited)

  const roleTools = tools.filter((t) =>
    t.suitableRoles.some((r) => roleConfig[activeRole]?.roles.includes(r))
  )
  const rolePrompts = prompts.filter(
    (p) => p.category === roleConfig[activeRole]?.category
  )

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  return (
    <div className="p-8 font-body">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="font-display text-3xl font-bold text-gradient-amber">
          团队空间
        </h1>
        <p className="mt-2 text-slate-400 text-sm">
          管理团队推荐工具、审批申请、岗位配置与流程优化
        </p>
      </motion.div>

      <div className="mt-6 flex gap-2 border-b border-indigo-500/10 pb-0">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all duration-200 border-b-2 -mb-px',
                activeTab === tab.key
                  ? 'text-amber-400 border-amber-400'
                  : 'text-slate-400 border-transparent hover:text-slate-200 hover:border-slate-500/30'
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="mt-6"
        >
          {activeTab === 'recommend' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-slate-400">
                  共 {favoritedTools.length} 个推荐工具
                </p>
                <div className="relative">
                  <button
                    onClick={() => setAddRecommendOpen(!addRecommendOpen)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 text-amber-400 text-sm font-medium hover:bg-amber-500/20 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    添加推荐
                    <ChevronDown
                      className={cn(
                        'w-3 h-3 transition-transform',
                        addRecommendOpen && 'rotate-180'
                      )}
                    />
                  </button>
                  <AnimatePresence>
                    {addRecommendOpen && nonFavoritedTools.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="absolute right-0 mt-2 w-64 glass rounded-xl py-2 z-30 max-h-72 overflow-y-auto"
                      >
                        {nonFavoritedTools.map((tool) => (
                          <button
                            key={tool.id}
                            onClick={() => {
                              toggleToolFavorite(tool.id)
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-indigo-500/10 transition-colors"
                          >
                            <span className="truncate">{tool.name}</span>
                            <span
                              className={cn(
                                'text-xs px-2 py-0.5 rounded-full',
                                categoryColors[tool.category]
                              )}
                            >
                              {categoryLabels[tool.category]}
                            </span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {favoritedTools.length === 0 ? (
                <div className="glass rounded-2xl p-12 text-center">
                  <Star className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">暂无推荐工具</p>
                  <p className="text-sm text-slate-500 mt-1">
                    点击"添加推荐"将工具加入团队推荐清单
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {favoritedTools.map((tool, i) => {
                    const Icon = iconMap[tool.icon] || FileText
                    return (
                      <motion.div
                        key={tool.id}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="glass rounded-xl p-4 flex items-center gap-4 group hover:border-indigo-500/30 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-200">
                            {tool.name}
                          </p>
                          <p className="text-xs text-slate-500 truncate mt-0.5">
                            {tool.description}
                          </p>
                        </div>
                        <span
                          className={cn(
                            'text-xs px-2.5 py-1 rounded-full',
                            categoryColors[tool.category]
                          )}
                        >
                          {categoryLabels[tool.category]}
                        </span>
                        <button
                          onClick={() => toggleToolFavorite(tool.id)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-3 h-3" />
                          移除
                        </button>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'approval' && (
            <div>
              <p className="text-sm text-slate-400 mb-4">
                共 {toolApplications.length} 条申请
              </p>
              {toolApplications.length === 0 ? (
                <div className="glass rounded-2xl p-12 text-center">
                  <Shield className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">暂无工具申请</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {toolApplications.map((app, i) => (
                    <motion.div
                      key={app.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="glass rounded-xl p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 text-xs font-bold">
                              {app.applicant[0]}
                            </div>
                            <span className="text-sm font-medium text-slate-200">
                              {app.applicant}
                            </span>
                            <span className="text-slate-600">·</span>
                            <span className="text-sm text-amber-400 font-medium">
                              {app.toolName}
                            </span>
                            <span
                              className={cn(
                                'text-xs px-2.5 py-0.5 rounded-full',
                                statusConfig[app.status].className
                              )}
                            >
                              {statusConfig[app.status].label}
                            </span>
                          </div>
                          <p className="text-sm text-slate-300 mb-1">
                            {app.description}
                          </p>
                          <p className="text-xs text-slate-500 mb-2">
                            申请理由：{app.reason}
                          </p>
                          <div className="flex items-center gap-1.5 text-xs text-slate-600">
                            <Clock className="w-3 h-3" />
                            {formatDate(app.createdAt)}
                          </div>
                        </div>
                        {app.status === 'pending' && (
                          <div className="flex gap-2 shrink-0">
                            <button
                              onClick={() => approveApplication(app.id)}
                              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 transition-colors"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              通过
                            </button>
                            <button
                              onClick={() => rejectApplication(app.id)}
                              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              拒绝
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'roles' && (
            <div>
              <div className="flex gap-2 mb-6">
                {roleTabs.map((role) => (
                  <button
                    key={role}
                    onClick={() => setActiveRole(role)}
                    className={cn(
                      'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                      activeRole === role
                        ? 'bg-amber-500/15 text-amber-400 glow-amber'
                        : 'glass text-slate-400 hover:text-slate-200'
                    )}
                  >
                    {role}
                  </button>
                ))}
              </div>

              <div className="mb-2">
                <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  相关工具
                </h3>
                {roleTools.length === 0 ? (
                  <p className="text-sm text-slate-500 py-4">暂无匹配工具</p>
                ) : (
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {roleTools.map((tool, i) => {
                      const Icon = iconMap[tool.icon] || FileText
                      return (
                        <motion.div
                          key={tool.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.05 }}
                          className="card-gradient-border glass rounded-xl p-5 hover:glow-indigo transition-all cursor-default"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                              <Icon className="w-5 h-5 text-indigo-400" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-slate-200 truncate">
                                {tool.name}
                              </p>
                              <span
                                className={cn(
                                  'text-xs px-2 py-0.5 rounded-full inline-block mt-0.5',
                                  categoryColors[tool.category]
                                )}
                              >
                                {categoryLabels[tool.category]}
                              </span>
                            </div>
                          </div>
                          <p className="text-xs text-slate-400 line-clamp-2">
                            {tool.description}
                          </p>
                          <div className="mt-3 flex items-center gap-2">
                            {tool.suitableRoles.map((r) => (
                              <span
                                key={r}
                                className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300"
                              >
                                {r}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                  <PenLine className="w-4 h-4 text-amber-400" />
                  相关提示词
                </h3>
                {rolePrompts.length === 0 ? (
                  <p className="text-sm text-slate-500 py-4">暂无匹配提示词</p>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    {rolePrompts.map((prompt, i) => (
                      <motion.div
                        key={prompt.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="card-gradient-border glass rounded-xl p-5 hover:glow-indigo transition-all cursor-default"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-amber-400" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-200 truncate">
                              {prompt.title}
                            </p>
                            <span
                              className={cn(
                                'text-xs px-2 py-0.5 rounded-full inline-block mt-0.5',
                                categoryColors[prompt.category]
                              )}
                            >
                              {categoryLabels[prompt.category]}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                          {prompt.content}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {prompt.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'optimize' && (
            <div>
              <p className="text-sm text-slate-400 mb-4">
                共 {optimizationSuggestions.length} 条优化建议
              </p>
              {optimizationSuggestions.length === 0 ? (
                <div className="glass rounded-2xl p-12 text-center">
                  <TrendingUp className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">暂无优化建议</p>
                  <p className="text-sm text-slate-500 mt-1">
                    系统将自动分析工具使用情况并生成优化建议
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {optimizationSuggestions.map((suggestion, i) => {
                    const typeInfo = typeLabels[suggestion.type]
                    const relatedToolNames = suggestion.relatedTools
                      .map((id) => tools.find((t) => t.id === id)?.name)
                      .filter(Boolean)
                    return (
                      <motion.div
                        key={suggestion.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="glass rounded-xl p-5"
                      >
                        <div className="flex items-start gap-4">
                          <div className="mt-1.5">
                            <div
                              className={cn(
                                'w-2.5 h-2.5 rounded-full',
                                severityColors[suggestion.severity]
                              )}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <span
                                className={cn(
                                  'text-xs px-2.5 py-0.5 rounded-full',
                                  typeInfo.className
                                )}
                              >
                                {typeInfo.label}
                              </span>
                              <h4 className="text-sm font-medium text-slate-200">
                                {suggestion.title}
                              </h4>
                            </div>
                            <p className="text-sm text-slate-400 mb-3">
                              {suggestion.description}
                            </p>
                            {relatedToolNames.length > 0 && (
                              <div className="flex items-center gap-2 mb-3">
                                <span className="text-xs text-slate-500">
                                  相关工具：
                                </span>
                                {relatedToolNames.map((name) => (
                                  <span
                                    key={name}
                                    className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300"
                                  >
                                    {name}
                                  </span>
                                ))}
                              </div>
                            )}
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  dismissSuggestion(suggestion.id)
                                }
                                className="px-4 py-1.5 rounded-lg text-xs font-medium bg-amber-500/15 text-amber-400 hover:bg-amber-500/25 transition-colors"
                              >
                                采纳建议
                              </button>
                              <button
                                onClick={() =>
                                  dismissSuggestion(suggestion.id)
                                }
                                className="px-4 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:bg-slate-500/10 transition-colors"
                              >
                                忽略
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
