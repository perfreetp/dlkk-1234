import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
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
  BookOpen,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Copy,
  ListChecks,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import useStore from '@/store/useStore'
import type { WorkflowStep, Prompt } from '@/store/useStore'

const penLineIconMap: Record<string, React.ElementType> = {
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
  Video: Wrench,
  Mail: Wrench,
  Mic: Wrench,
}

interface WorkflowRunState {
  workflowId: string
  workflowName: string
  currentStep: number
  steps: Array<{
    stepId: string
    toolId: string
    toolName: string
    order: number
    input: string
    output: string
    completed: boolean
    running: boolean
  }>
  finalResult: string
}

export default function Workspace() {
  const {
    tools,
    prompts,
    workflows,
    addTaskRecord,
    addTaskRecordBatch,
    addWorkflow,
  } = useStore()

  const [searchParams] = useSearchParams()

  const [activeToolId, setActiveToolId] = useState<string | null>(null)
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [isExecuting, setIsExecuting] = useState(false)
  const [showNewWorkflowModal, setShowNewWorkflowModal] = useState(false)
  const [newWorkflowName, setNewWorkflowName] = useState('')
  const [newWorkflowSteps, setNewWorkflowSteps] = useState<WorkflowStep[]>([])

  const [showPromptPicker, setShowPromptPicker] = useState(false)
  const [activePrompt, setActivePrompt] = useState<Prompt | null>(null)
  const [promptVariables, setPromptVariables] = useState<Record<string, string>>({})

  const [workflowRun, setWorkflowRun] = useState<WorkflowRunState | null>(null)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const favoriteTools = useMemo(
    () => tools.filter((t) => t.isFavorited),
    [tools]
  )
  const activeTool = useMemo(
    () => tools.find((t) => t.id === activeToolId) ?? null,
    [tools, activeToolId]
  )

  useEffect(() => {
    const toolId = searchParams.get('toolId')
    if (toolId && tools.some((t) => t.id === toolId)) {
      setActiveToolId(toolId)
      setInputText('')
      setOutputText('')
    }
  }, [searchParams, tools])

  useEffect(() => {
    if (activePrompt) {
      const init: Record<string, string> = {}
      activePrompt.variables.forEach((v) => (init[v] = ''))
      setPromptVariables(init)
    }
  }, [activePrompt])

  const replacedPrompt = useMemo(() => {
    if (!activePrompt) return ''
    return activePrompt.content.replace(/\{\{(\s*[\u4e00-\u9fa5\w\s]+\s*)\}\}/g, (_, m) => {
      const key = m.trim()
      return promptVariables[key] ?? ''
    })
  }, [activePrompt, promptVariables])

  const allVarsFilled = useMemo(() => {
    if (!activePrompt) return true
    return activePrompt.variables.every((v) => promptVariables[v]?.trim())
  }, [activePrompt, promptVariables])

  const getToolName = (toolId: string) =>
    tools.find((t) => t.id === toolId)?.name ?? '未知工具'

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard?.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 1500)
  }

  const mockRunTool = (toolName: string, input: string) =>
    `[${toolName}] 处理完成。\n\n输入内容：\n${input}\n\n结果摘要：已根据内容生成优化输出，包含结构重排、重点突出和措辞润色，质量等级 A+。`

  const handleExecute = () => {
    if (!activeTool || !inputText.trim()) return
    setIsExecuting(true)
    setOutputText('')
    setTimeout(() => {
      setOutputText(mockRunTool(activeTool.name, inputText))
      setIsExecuting(false)
    }, 900)
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

  const handleUsePromptContent = () => {
    if (!allVarsFilled) return
    setInputText(replacedPrompt)
    setShowPromptPicker(false)
    setActivePrompt(null)
    setPromptVariables({})
  }

  const handleAddStep = (toolId: string) => {
    setNewWorkflowSteps((prev) => [
      ...prev,
      {
        id: `new-step-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
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

  const startWorkflow = (workflowId: string) => {
    const wf = workflows.find((w) => w.id === workflowId)
    if (!wf || wf.steps.length === 0) return
    const stepInput = (
      wf.steps[0].inputTemplate || '请输入初始内容，供"' + getToolName(wf.steps[0].toolId) + '"处理'
    )
    setWorkflowRun({
      workflowId: wf.id,
      workflowName: wf.name,
      currentStep: 0,
      steps: wf.steps.map((step, i) => ({
        stepId: step.id,
        toolId: step.toolId,
        toolName: getToolName(step.toolId),
        order: step.order,
        input: i === 0 ? stepInput : '',
        output: '',
        completed: false,
        running: false,
      })),
      finalResult: '',
    })
  }

  const runCurrentStep = () => {
    if (!workflowRun) return
    const idx = workflowRun.currentStep
    const step = workflowRun.steps[idx]
    if (!step || !step.input.trim()) return

    const newSteps = workflowRun.steps.map((s, i) =>
      i === idx ? { ...s, running: true } : s
    )
    setWorkflowRun({ ...workflowRun, steps: newSteps })

    setTimeout(() => {
      setWorkflowRun((prev) => {
        if (!prev) return prev
        const runOutput = mockRunTool(
          prev.steps[idx].toolName,
          prev.steps[idx].input
        )
        const updatedSteps = prev.steps.map((s, i) =>
          i === idx
            ? { ...s, output: runOutput, completed: true, running: false }
            : s
        )
        const isLast = idx === prev.steps.length - 1
        if (!isLast) {
          updatedSteps[idx + 1] = {
            ...updatedSteps[idx + 1],
            input: `--- 上一步【${prev.steps[idx].toolName}】输出作为本步输入 ---\n\n${runOutput}`,
          }
        }
        return {
          ...prev,
          steps: updatedSteps,
          currentStep: isLast ? prev.currentStep : prev.currentStep + 1,
          finalResult: isLast ? runOutput : prev.finalResult,
        }
      })
    }, 800)
  }

  const updateCurrentStepInput = (val: string) => {
    if (!workflowRun) return
    const idx = workflowRun.currentStep
    setWorkflowRun({
      ...workflowRun,
      steps: workflowRun.steps.map((s, i) =>
        i === idx ? { ...s, input: val } : s
      ),
    })
  }

  const saveWorkflowRecords = () => {
    if (!workflowRun) return
    const records = workflowRun.steps
      .filter((s) => s.completed)
      .map((s) => ({
        toolId: s.toolId,
        toolName: s.toolName,
        input: s.input,
        output: s.output,
        rating: 0,
        isFavorited: false,
        workflowId: workflowRun.workflowId,
        workflowName: workflowRun.workflowName,
        stepIndex: s.order,
        workflowStepId: s.stepId,
      }))
    if (records.length > 0) {
      addTaskRecordBatch(records as any)
    }
    setWorkflowRun(null)
  }

  const cancelWorkflowRun = () => setWorkflowRun(null)

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6 pb-20">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="font-display text-3xl font-bold text-gradient-amber">
          工作台
        </h1>
        <p className="text-slate-400 text-sm mt-1 font-body">
          选择工具快速执行任务，或构建自动化工作流程
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">
            快速访问
          </span>
          <div className="flex-1 h-px bg-indigo-500/10" />
          <button
            onClick={() => setShowPromptPicker(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            从提示词库导入
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {favoriteTools.map((tool) => {
            const Icon = penLineIconMap[tool.icon] ?? Wrench
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
          {favoriteTools.length === 0 && (
            <p className="text-sm text-slate-600 px-1">
              暂无收藏工具，可前往工具广场收藏常用工具
            </p>
          )}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {workflowRun ? (
          <motion.div
            key="workflow-run"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <ListChecks className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h2 className="font-display text-lg font-semibold text-slate-100">
                    {workflowRun.workflowName}
                  </h2>
                  <p className="text-xs text-slate-500">
                    流程执行中 · 第 {workflowRun.currentStep + 1}/
                    {workflowRun.steps.length} 步
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={cancelWorkflowRun}
                  className="px-3 py-1.5 text-xs rounded-lg border border-surface-200/40 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  取消流程
                </button>
                <button
                  onClick={saveWorkflowRecords}
                  disabled={!workflowRun.steps[workflowRun.steps.length - 1]?.completed}
                  className={cn(
                    'flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium rounded-lg transition-all',
                    workflowRun.steps[workflowRun.steps.length - 1]?.completed
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-indigo-950 shadow-lg shadow-amber-500/20'
                      : 'bg-surface-50 text-slate-600 cursor-not-allowed'
                  )}
                >
                  <Save className="w-3.5 h-3.5" />
                  保存流程记录
                </button>
              </div>
            </div>

            <div className="flex gap-4 mb-5 overflow-x-auto pb-2">
              {workflowRun.steps.map((step, i) => {
                const isCurrent = i === workflowRun.currentStep
                return (
                  <div key={step.stepId} className="flex items-center shrink-0">
                    <div
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 rounded-lg border transition-all',
                        step.completed
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : isCurrent
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 glow-amber'
                            : 'bg-surface-50/50 border-surface-200/30 text-slate-500'
                      )}
                    >
                      {step.completed ? (
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                      ) : step.running ? (
                        <Loader2 className="w-4 h-4 shrink-0 animate-spin" />
                      ) : (
                        <span className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center text-[10px] font-bold shrink-0">
                          {i + 1}
                        </span>
                      )}
                      <span className="text-sm font-medium whitespace-nowrap">
                        {step.toolName}
                      </span>
                    </div>
                    {i < workflowRun.steps.length - 1 && (
                      <ArrowRight
                        className={cn(
                          'w-4 h-4 mx-2',
                          step.completed ? 'text-emerald-500/50' : 'text-slate-600'
                        )}
                      />
                    )}
                  </div>
                )
              })}
            </div>

            {(() => {
              const step = workflowRun.steps[workflowRun.currentStep]
              if (!step) return null
              return (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs text-slate-400 font-medium">
                        步骤 {step.order} · {step.toolName} · 输入
                      </label>
                      <button
                        onClick={() => handleCopy(step.input, `step-in-${step.stepId}`)}
                        className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1"
                      >
                        {copiedKey === `step-in-${step.stepId}` ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        {copiedKey === `step-in-${step.stepId}` ? '已复制' : '复制'}
                      </button>
                    </div>
                    <textarea
                      value={step.input}
                      onChange={(e) => updateCurrentStepInput(e.target.value)}
                      disabled={step.running || step.completed}
                      className="w-full h-48 rounded-xl bg-surface-50 border border-indigo-500/10 text-slate-200 text-sm p-3 resize-none focus:outline-none focus:border-amber-500/30 placeholder:text-slate-600 disabled:opacity-70 transition-colors"
                    />
                    <div className="flex gap-3 mt-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={runCurrentStep}
                        disabled={step.running || step.completed || !step.input.trim()}
                        className={cn(
                          'flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
                          step.running || step.completed || !step.input.trim()
                            ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-amber-500 to-amber-600 text-indigo-950 hover:shadow-lg hover:shadow-amber-500/20'
                        )}
                      >
                        {step.running ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : step.completed ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                        {step.running
                          ? '执行中...'
                          : step.completed
                            ? '已完成'
                            : '执行此步骤'}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() =>
                          setInputText(step.input)
                        }
                        className="px-4 py-2.5 rounded-xl text-sm font-medium glass text-slate-300 hover:text-slate-100"
                      >
                        发送到单工具区
                      </motion.button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs text-slate-400 font-medium">
                        步骤 {step.order} · {step.toolName} · 输出
                      </label>
                      <button
                        onClick={() => handleCopy(step.output, `step-out-${step.stepId}`)}
                        disabled={!step.output}
                        className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 disabled:opacity-40"
                      >
                        {copiedKey === `step-out-${step.stepId}` ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        {copiedKey === `step-out-${step.stepId}` ? '已复制' : '复制'}
                      </button>
                    </div>
                    <div className="w-full h-48 rounded-xl bg-[#0a0920] border border-indigo-500/10 p-3 font-mono text-sm text-green-400 overflow-auto whitespace-pre-wrap">
                      {step.running ? (
                        <span className="text-slate-500 animate-pulse">正在处理中...</span>
                      ) : step.output ? (
                        step.output
                      ) : (
                        <span className="text-slate-600">等待步骤执行...</span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })()}

            {workflowRun.steps[workflowRun.steps.length - 1]?.completed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-indigo-500/10 border border-amber-500/20"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h3 className="font-display text-sm font-semibold text-amber-300">
                    流程执行完成
                  </h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  共 {workflowRun.steps.length} 个步骤已处理完毕。点击「保存流程记录」可将每一步的输入输出分别保存到「任务记录」，并关联流程名称。
                </p>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="main-workspace"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-5 gap-6"
          >
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="lg:col-span-2 glass rounded-2xl p-6 flex flex-col min-h-[520px]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
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
                <button
                  onClick={() => setShowPromptPicker(true)}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 transition-colors border border-indigo-500/20"
                  title="从提示词库导入"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">导入提示词</span>
                </button>
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
                    <p className="text-slate-600 text-xs mt-1">
                      从上方快速访问栏或工具广场选择
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="executor"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex-1 flex flex-col"
                  >
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {activeTool.category}
                      </span>
                      <span className="text-xs text-slate-500">
                        配额 {activeTool.quota.used}/{activeTool.quota.total}
                      </span>
                      {activePrompt && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          已应用提示词：{activePrompt.title}
                        </span>
                      )}
                    </div>

                    {activePrompt && activePrompt.variables.length > 0 && (
                      <div className="mb-4 rounded-xl bg-surface-50/50 border border-amber-500/15 p-3">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-medium text-amber-300">提示词变量</p>
                          <button
                            onClick={() => {
                              setActivePrompt(null)
                              setPromptVariables({})
                            }}
                            className="text-xs text-slate-500 hover:text-slate-300"
                          >
                            取消
                          </button>
                        </div>
                        <div className="space-y-2">
                          {activePrompt.variables.map((v) => (
                            <div key={v}>
                              <label className="block text-[11px] text-slate-400 mb-1">
                                {v}
                              </label>
                              <input
                                type="text"
                                value={promptVariables[v] ?? ''}
                                onChange={(e) =>
                                  setPromptVariables((p) => ({
                                    ...p,
                                    [v]: e.target.value,
                                  }))
                                }
                                onBlur={() => {
                                  if (allVarsFilled) setInputText(replacedPrompt)
                                }}
                                placeholder={`请输入「${v}」`}
                                className="w-full rounded-lg bg-[#0a0920] border border-indigo-500/10 text-slate-200 text-sm px-3 py-1.5 focus:outline-none focus:border-amber-500/40 placeholder:text-slate-600 transition-colors"
                              />
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => setInputText(replacedPrompt)}
                            className={cn(
                              'flex-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-all',
                              allVarsFilled
                                ? 'bg-gradient-to-r from-amber-400/90 to-amber-500/90 text-indigo-950 hover:shadow-md hover:shadow-amber-500/20'
                                : 'bg-surface-50 text-slate-500 cursor-not-allowed'
                            )}
                          >
                            {allVarsFilled ? '应用到输入框' : '请完整填写变量'}
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs text-slate-400 mb-0 font-medium">
                        输入内容
                      </label>
                      <button
                        onClick={() => handleCopy(inputText, 'input')}
                        disabled={!inputText}
                        className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 disabled:opacity-40"
                      >
                        {copiedKey === 'input' ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        {copiedKey === 'input' ? '已复制' : '复制'}
                      </button>
                    </div>
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

                    <div className="flex items-center justify-between mb-1.5 mt-4">
                      <label className="text-xs text-slate-400 font-medium">
                        输出结果
                      </label>
                      <button
                        onClick={() => handleCopy(outputText, 'output')}
                        disabled={!outputText}
                        className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 disabled:opacity-40"
                      >
                        {copiedKey === 'output' ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        {copiedKey === 'output' ? '已复制' : '复制'}
                      </button>
                    </div>
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
                      已保存 {workflows.length} 个流程 · 点击「执行流程」按步骤依次处理
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
                          onClick={() => startWorkflow(wf.id)}
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
                            <div className="pt-1 flex-1">
                              <span className="text-sm text-slate-300">
                                {getToolName(step.toolId)}
                              </span>
                              {step.inputTemplate && (
                                <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                                  默认输入模板：{step.inputTemplate.slice(0, 36)}
                                  {step.inputTemplate.length > 36 ? '...' : ''}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

              <label className="text-xs text-slate-400 font-medium block mb-1.5">
                流程名称
              </label>
              <input
                value={newWorkflowName}
                onChange={(e) => setNewWorkflowName(e.target.value)}
                placeholder="输入流程名称..."
                className="w-full rounded-xl bg-surface-50 border border-indigo-500/10 text-slate-200 text-sm px-3 py-2.5 mb-4 focus:outline-none focus:border-amber-500/30 placeholder:text-slate-600 transition-colors"
              />

              <label className="text-xs text-slate-400 font-medium block mb-1.5">
                添加步骤
              </label>
              <div className="flex gap-2 mb-3">
                <select
                  id="workflow-tool-select-2"
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
                        <span className="text-sm text-slate-300">
                          {getToolName(step.toolId)}
                        </span>
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

      <AnimatePresence>
        {showPromptPicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => {
              setShowPromptPicker(false)
              setActivePrompt(null)
              setPromptVariables({})
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong rounded-2xl w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-indigo-500/10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-slate-100">
                      从提示词库导入
                    </h3>
                    <p className="text-xs text-slate-500">
                      选择提示词模板，填写变量后自动填入输入框
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowPromptPicker(false)
                    setActivePrompt(null)
                    setPromptVariables({})
                  }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-indigo-500/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {prompts.map((prompt) => {
                  const isActive = activePrompt?.id === prompt.id
                  return (
                    <motion.button
                      key={prompt.id}
                      onClick={() => setActivePrompt(isActive ? null : prompt)}
                      className={cn(
                        'w-full text-left p-4 rounded-xl border transition-all',
                        isActive
                          ? 'bg-amber-500/8 border border-amber-500/30'
                          : 'bg-surface-50/50 border-indigo-500/10 hover:border-indigo-500/30'
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-display font-semibold text-slate-200 text-sm">
                          {prompt.title}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300">
                            {prompt.category}
                          </span>
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300">
                            {prompt.variables.length} 变量
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {prompt.content}
                      </p>
                      {prompt.variables.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {prompt.variables.map((v) => (
                            <span
                              key={v}
                              className="font-mono text-[10px] px-2 py-0.5 rounded bg-amber-500/8 text-amber-400 border border-amber-500/20"
                            >
                              {`{{${v}}}`}
                            </span>
                          ))}
                        </div>
                      )}
                    </motion.button>
                  )
                })}
                {prompts.length === 0 && (
                  <p className="text-slate-600 text-sm text-center py-8">
                    暂无提示词
                  </p>
                )}
              </div>
              <div className="flex items-center justify-end gap-3 p-5 border-t border-indigo-500/10">
                <button
                  onClick={() => {
                    setShowPromptPicker(false)
                    setActivePrompt(null)
                    setPromptVariables({})
                  }}
                  className="px-4 py-2 rounded-xl text-sm font-medium glass text-slate-300 hover:text-slate-100 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    if (!activePrompt) return
                    setShowPromptPicker(false)
                  }}
                  disabled={!activePrompt}
                  className={cn(
                    'px-5 py-2 rounded-xl text-sm font-semibold transition-all',
                    activePrompt
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-indigo-950 hover:shadow-lg hover:shadow-amber-500/20'
                      : 'bg-surface-50 text-slate-600 cursor-not-allowed'
                  )}
                >
                  选择此模板
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
