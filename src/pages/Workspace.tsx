import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Wrench,
  Play,
  Save,
  Plus,
  X,
  ChevronRight,
  Loader2,
  MousePointerClick,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import useStore from '@/store/useStore'
import type { WorkflowStep } from '@/store/useStore'

const iconMap: Record<string, React.ElementType> = {
  PenLine: Wrench,
  Search: Wrench,
  RefreshCw: Wrench,
  Image: Wrench,
  Wand2: Wrench,
  Shapes: Wrench,
  Languages: Wrench,
  CheckCircle: Wrench,
  BookOpen: Wrench,
  FolderSearch: Wrench,
  FileText: Wrench,
  Table: Wrench,
  FileOutput: Wrench,
}

export default function Workspace() {
  const { tools, workflows, addTaskRecord, addWorkflow } = useStore()

  const [activeToolId, setActiveToolId] = useState<string | null>(null)
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [isExecuting, setIsExecuting] = useState(false)
  const [showNewWorkflowModal, setShowNewWorkflowModal] = useState(false)
  const [newWorkflowName, setNewWorkflowName] = useState('')
  const [newWorkflowSteps, setNewWorkflowSteps] = useState<WorkflowStep[]>([])

  const favoriteTools = tools.filter((t) => t.isFavorited)
  const activeTool = tools.find((t) => t.id === activeToolId) ?? null

  const handleExecute = () => {
    if (!activeTool || !inputText.trim()) return
    setIsExecuting(true)
    setOutputText('')
    setTimeout(() => {
      setOutputText(`[${activeTool.name}] 已处理完成。输入内容："${inputText}" 已成功分析并生成结果。`)
      setIsExecuting(false)
    }, 1200)
  }

  const handleSaveRecord = () => {
    if (!activeTool || !outputText) return
    addTaskRecord({
      toolId: activeTool.id,
      toolName: activeTool.name,
      input: inputText,
      output: outputText,
      rating: 0,
      isFavorited: false,
    })
  }

  const handleAddStep = (toolId: string) => {
    setNewWorkflowSteps((prev) => [
      ...prev,
      {
        id: `new-step-${Date.now()}`,
        toolId,
        order: prev.length + 1,
        config: {},
      },
    ])
  }

  const handleRemoveStep = (stepId: string) => {
    setNewWorkflowSteps((prev) =>
      prev
        .filter((s) => s.id !== stepId)
        .map((s, i) => ({ ...s, order: i + 1 }))
    )
  }

  const handleCreateWorkflow = () => {
    if (!newWorkflowName.trim() || newWorkflowSteps.length === 0) return
    addWorkflow({
      name: newWorkflowName,
      steps: newWorkflowSteps,
    })
    setNewWorkflowName('')
    setNewWorkflowSteps([])
    setShowNewWorkflowModal(false)
  }

  const getToolName = (toolId: string) => tools.find((t) => t.id === toolId)?.name ?? '未知工具'

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="font-display text-3xl font-bold text-gradient-amber">工作台</h1>
        <p className="text-slate-400 text-sm mt-1 font-body">选择工具快速执行任务，或构建自动化工作流程</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="relative"
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">快速访问</span>
          <div className="flex-1 h-px bg-indigo-500/10" />
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {favoriteTools.map((tool) => {
            const Icon = iconMap[tool.icon] ?? Wrench
            const isActive = activeToolId === tool.id
            return (
              <motion.button
                key={tool.id}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  setActiveToolId(tool.id)
                  setInputText('')
                  setOutputText('')
                }}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors duration-200 shrink-0',
                  isActive
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 glow-amber'
                    : 'glass text-slate-300 hover:text-slate-100 hover:bg-indigo-500/10'
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{tool.name}</span>
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="lg:col-span-2 glass rounded-2xl p-6 flex flex-col min-h-[520px]"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Wrench className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-slate-100">
                任务执行
              </h2>
              <p className="text-xs text-slate-500">
                {activeTool ? activeTool.name : '未选择工具'}
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!activeTool ? (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/5 flex items-center justify-center mb-4">
                  <MousePointerClick className="w-8 h-8 text-slate-600" />
                </div>
                <p className="text-slate-500 text-sm">请选择一个工具开始工作</p>
                <p className="text-slate-600 text-xs mt-1">从上方快速访问栏或工具广场选择</p>
              </motion.div>
            ) : (
              <motion.div
                key="executor"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex-1 flex flex-col"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {activeTool.category}
                  </span>
                  <span className="text-xs text-slate-500">
                    配额 {activeTool.quota.used}/{activeTool.quota.total}
                  </span>
                </div>

                <label className="text-xs text-slate-400 mb-1.5 font-medium">输入内容</label>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="在此输入任务内容..."
                  className="w-full h-28 rounded-xl bg-surface-50 border border-indigo-500/10 text-slate-200 text-sm p-3 resize-none focus:outline-none focus:border-amber-500/30 placeholder:text-slate-600 transition-colors"
                />

                <div className="flex gap-3 mt-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleExecute}
                    disabled={isExecuting || !inputText.trim()}
                    className={cn(
                      'flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
                      isExecuting || !inputText.trim()
                        ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-amber-500 to-amber-600 text-indigo-950 hover:shadow-lg hover:shadow-amber-500/20'
                    )}
                  >
                    {isExecuting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                    {isExecuting ? '执行中...' : '执行'}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSaveRecord}
                    disabled={!outputText}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                      !outputText
                        ? 'bg-slate-700/30 text-slate-600 cursor-not-allowed'
                        : 'glass text-slate-300 hover:text-slate-100'
                    )}
                  >
                    <Save className="w-4 h-4" />
                    保存记录
                  </motion.button>
                </div>

                <label className="text-xs text-slate-400 mb-1.5 mt-4 font-medium">输出结果</label>
                <div className="flex-1 min-h-[120px] rounded-xl bg-[#0a0920] border border-indigo-500/10 p-3 font-mono text-sm text-green-400 overflow-auto whitespace-pre-wrap">
                  {isExecuting ? (
                    <span className="text-slate-500 animate-pulse">正在处理中...</span>
                  ) : outputText ? (
                    outputText
                  ) : (
                    <span className="text-slate-600">等待执行...</span>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="lg:col-span-3 glass rounded-2xl p-6 flex flex-col min-h-[520px]"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                <ChevronRight className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold text-slate-100">
                  工作流程
                </h2>
                <p className="text-xs text-slate-500">
                  已保存 {workflows.length} 个流程
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setShowNewWorkflowModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-gradient-to-r from-amber-500 to-amber-600 text-indigo-950 hover:shadow-lg hover:shadow-amber-500/20 transition-shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              新建流程
            </motion.button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4">
            {workflows.length === 0 ? (
              <div className="flex-1 flex items-center justify-center h-full">
                <p className="text-slate-600 text-sm">暂无工作流程</p>
              </div>
            ) : (
              workflows.map((wf) => (
                <motion.div
                  key={wf.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card-gradient-border rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-display font-semibold text-slate-200 text-sm">
                        {wf.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {wf.steps.length} 个步骤
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        const firstStep = wf.steps[0]
                        if (firstStep) {
                          setActiveToolId(firstStep.toolId)
                          setInputText('')
                          setOutputText('')
                        }
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
                    >
                      <Play className="w-3 h-3" />
                      执行流程
                    </motion.button>
                  </div>

                  <div className="space-y-0">
                    {wf.steps.map((step, idx) => (
                      <div key={step.id} className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400 shrink-0">
                            {step.order}
                          </div>
                          {idx < wf.steps.length - 1 && (
                            <div className="w-px h-6 bg-indigo-500/20" />
                          )}
                        </div>
                        <div className="pt-1">
                          <span className="text-sm text-slate-300">
                            {getToolName(step.toolId)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showNewWorkflowModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowNewWorkflowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong rounded-2xl p-6 w-full max-w-md mx-4"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display text-lg font-semibold text-slate-100">
                  新建工作流程
                </h3>
                <button
                  onClick={() => setShowNewWorkflowModal(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-indigo-500/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <label className="text-xs text-slate-400 font-medium block mb-1.5">流程名称</label>
              <input
                value={newWorkflowName}
                onChange={(e) => setNewWorkflowName(e.target.value)}
                placeholder="输入流程名称..."
                className="w-full rounded-xl bg-surface-50 border border-indigo-500/10 text-slate-200 text-sm px-3 py-2.5 mb-4 focus:outline-none focus:border-amber-500/30 placeholder:text-slate-600 transition-colors"
              />

              <label className="text-xs text-slate-400 font-medium block mb-1.5">添加步骤</label>
              <div className="flex gap-2 mb-3">
                <select
                  id="workflow-tool-select"
                  defaultValue=""
                  onChange={(e) => {
                    if (e.target.value) handleAddStep(e.target.value)
                    e.target.value = ''
                  }}
                  className="flex-1 rounded-xl bg-surface-50 border border-indigo-500/10 text-slate-200 text-sm px-3 py-2.5 focus:outline-none focus:border-amber-500/30 transition-colors"
                >
                  <option value="" disabled>
                    选择工具添加为步骤...
                  </option>
                  {tools.map((tool) => (
                    <option key={tool.id} value={tool.id}>
                      {tool.name}
                    </option>
                  ))}
                </select>
              </div>

              {newWorkflowSteps.length > 0 && (
                <div className="space-y-0 mb-4 max-h-48 overflow-y-auto">
                  {newWorkflowSteps.map((step, idx) => (
                    <div key={step.id} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xs font-bold text-amber-400 shrink-0">
                          {step.order}
                        </div>
                        {idx < newWorkflowSteps.length - 1 && (
                          <div className="w-px h-6 bg-amber-500/20" />
                        )}
                      </div>
                      <div className="flex-1 flex items-center justify-between pt-1">
                        <span className="text-sm text-slate-300">{getToolName(step.toolId)}</span>
                        <button
                          onClick={() => handleRemoveStep(step.id)}
                          className="w-6 h-6 rounded flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-3 mt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowNewWorkflowModal(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium glass text-slate-300 hover:text-slate-100 transition-colors"
                >
                  取消
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleCreateWorkflow}
                  disabled={!newWorkflowName.trim() || newWorkflowSteps.length === 0}
                  className={cn(
                    'flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
                    !newWorkflowName.trim() || newWorkflowSteps.length === 0
                      ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-amber-500 to-amber-600 text-indigo-950 hover:shadow-lg hover:shadow-amber-500/20'
                  )}
                >
                  创建流程
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
