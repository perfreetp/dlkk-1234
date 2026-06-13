import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  PenLine,
  Image,
  Wand2,
  Shapes,
  Languages,
  CheckCircle,
  BookOpen,
  FolderSearch,
  FileText,
  Table,
  FileOutput,
  RefreshCw,
  Star,
  Plus,
  X,
  Search as SearchIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import useStore from '@/store/useStore';
import type { ToolCategory } from '@/store/useStore';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  PenLine,
  Search,
  RefreshCw,
  Image,
  Wand2,
  Shapes,
  Languages,
  CheckCircle,
  BookOpen,
  FolderSearch,
  FileText,
  Table,
  FileOutput,
};

const categoryTabs: { label: string; value: ToolCategory | 'all' }[] = [
  { label: '全部', value: 'all' },
  { label: '写作', value: 'writing' },
  { label: '配图', value: 'image' },
  { label: '翻译', value: 'translation' },
  { label: '资料整理', value: 'research' },
  { label: '其他', value: 'other' },
];

const rolePills = ['全部岗位', '文案编辑', '视觉设计师', '翻译专员', '数据分析师'];

const roleMapping: Record<string, string[]> = {
  '文案编辑': ['内容运营', '编辑', '市场专员', 'SEO专员'],
  '视觉设计师': ['设计师', '产品经理'],
  '翻译专员': ['翻译'],
  '数据分析师': ['数据分析师', '研究员'],
};

function getQuotaColor(percentage: number) {
  if (percentage < 70) return 'bg-emerald-500';
  if (percentage < 90) return 'bg-amber-500';
  return 'bg-red-500';
}

function isExpiringSoon(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now();
  return diff > 0 && diff < 30 * 24 * 60 * 60 * 1000;
}

export default function Plaza() {
  const { tools, toggleToolFavorite, addToolApplication } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'all'>('all');
  const [activeRole, setActiveRole] = useState('全部岗位');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyForm, setApplyForm] = useState({ toolName: '', description: '', reason: '' });

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchSearch =
        !searchQuery ||
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = activeCategory === 'all' || tool.category === activeCategory;
      const matchRole =
        activeRole === '全部岗位' ||
        tool.suitableRoles.some((r) => roleMapping[activeRole]?.includes(r));
      return matchSearch && matchCategory && matchRole;
    });
  }, [tools, searchQuery, activeCategory, activeRole]);

  const handleApplySubmit = () => {
    if (!applyForm.toolName || !applyForm.description || !applyForm.reason) return;
    addToolApplication({
      toolName: applyForm.toolName,
      description: applyForm.description,
      reason: applyForm.reason,
      applicant: '当前用户',
      status: 'pending',
    });
    setApplyForm({ toolName: '', description: '', reason: '' });
    setShowApplyModal(false);
  };

  return (
    <div className="min-h-screen noise-bg pb-24">
      <div className="px-6 pt-8 pb-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-display text-3xl font-bold text-white">工具广场</h1>
          <p className="mt-1 text-sm text-slate-400 font-body">
            发现并使用团队AI工具，提升工作效率
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mt-6 relative"
        >
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="搜索工具名称或描述..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full glass rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-400 outline-none focus:border-amber-500/40 transition-colors font-body"
          />
        </motion.div>
      </div>

      <div className="px-6">
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-none">
          {categoryTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveCategory(tab.value)}
              className={cn(
                'relative flex-shrink-0 px-4 py-2 text-sm font-body rounded-lg transition-colors',
                activeCategory === tab.value
                  ? 'text-amber-400'
                  : 'text-slate-400 hover:text-slate-200'
              )}
            >
              {tab.label}
              {activeCategory === tab.value && (
                <motion.div
                  layoutId="category-underline"
                  className="absolute bottom-0 left-2 right-2 h-0.5 bg-amber-500 rounded-full"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 mt-2">
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-none">
          {rolePills.map((role) => (
            <button
              key={role}
              onClick={() => setActiveRole(role)}
              className={cn(
                'flex-shrink-0 px-3 py-1.5 text-xs font-body rounded-full transition-all border',
                activeRole === role
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                  : 'bg-surface-50/50 border-surface-200/30 text-slate-400 hover:text-slate-200'
              )}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredTools.map((tool, index) => {
              const IconComponent = iconMap[tool.icon];
              const percentage = Math.round((tool.quota.used / tool.quota.total) * 100);
              const expiring = isExpiringSoon(tool.expiresAt);

              return (
                <motion.div
                  key={tool.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="glass rounded-2xl p-5 card-gradient-border group hover:glow-amber transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                        {IconComponent && (
                          <IconComponent className="w-5 h-5 text-amber-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-display font-semibold text-white text-sm">
                          {tool.name}
                        </h3>
                        <p className="text-xs text-slate-400 font-body mt-0.5 line-clamp-1">
                          {tool.description}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleToolFavorite(tool.id)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={cn(
                          'w-4 h-4 transition-colors',
                          tool.isFavorited
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-500 hover:text-amber-400'
                        )}
                      />
                    </button>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs font-body mb-1.5">
                      <span className="text-slate-400">
                        配额 {tool.quota.used}/{tool.quota.total}
                      </span>
                      <span
                        className={cn(
                          'font-medium',
                          percentage >= 90
                            ? 'text-red-400'
                            : percentage >= 70
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                        )}
                      >
                        {percentage}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-surface-50 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, delay: index * 0.05 + 0.2 }}
                        className={cn('h-full rounded-full', getQuotaColor(percentage))}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span
                      className={cn(
                        'text-xs font-body',
                        expiring ? 'text-red-400' : 'text-slate-500'
                      )}
                    >
                      到期：{tool.expiresAt}
                    </span>
                    <button className="px-4 py-1.5 text-xs font-body font-medium rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 text-surface hover:from-amber-300 hover:to-amber-400 transition-all shadow-lg shadow-amber-500/20">
                      使用
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filteredTools.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Search className="w-10 h-10 mb-3 opacity-40" />
            <p className="font-body text-sm">未找到匹配的工具</p>
          </div>
        )}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowApplyModal(true)}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-shadow z-50"
      >
        <Plus className="w-6 h-6 text-surface" />
      </motion.button>

      <AnimatePresence>
        {showApplyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            onClick={() => setShowApplyModal(false)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md glass-strong rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-lg font-bold text-white">申请新工具</h2>
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="p-1 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-body text-slate-400 mb-1.5">
                    工具名称
                  </label>
                  <input
                    type="text"
                    value={applyForm.toolName}
                    onChange={(e) =>
                      setApplyForm((f) => ({ ...f, toolName: e.target.value }))
                    }
                    className="w-full bg-surface-50/60 border border-surface-200/30 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-amber-500/40 transition-colors font-body"
                    placeholder="请输入工具名称"
                  />
                </div>
                <div>
                  <label className="block text-xs font-body text-slate-400 mb-1.5">
                    工具描述
                  </label>
                  <textarea
                    value={applyForm.description}
                    onChange={(e) =>
                      setApplyForm((f) => ({ ...f, description: e.target.value }))
                    }
                    rows={3}
                    className="w-full bg-surface-50/60 border border-surface-200/30 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-amber-500/40 transition-colors font-body resize-none"
                    placeholder="请描述工具的功能和用途"
                  />
                </div>
                <div>
                  <label className="block text-xs font-body text-slate-400 mb-1.5">
                    申请理由
                  </label>
                  <textarea
                    value={applyForm.reason}
                    onChange={(e) =>
                      setApplyForm((f) => ({ ...f, reason: e.target.value }))
                    }
                    rows={3}
                    className="w-full bg-surface-50/60 border border-surface-200/30 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-amber-500/40 transition-colors font-body resize-none"
                    placeholder="请说明为什么需要这个工具"
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3 justify-end">
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 text-sm font-body text-slate-400 hover:text-white transition-colors rounded-lg border border-surface-200/30 hover:border-surface-200/60"
                >
                  取消
                </button>
                <button
                  onClick={handleApplySubmit}
                  disabled={!applyForm.toolName || !applyForm.description || !applyForm.reason}
                  className={cn(
                    'px-5 py-2 text-sm font-body font-medium rounded-lg transition-all',
                    applyForm.toolName && applyForm.description && applyForm.reason
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-surface hover:from-amber-300 hover:to-amber-400 shadow-lg shadow-amber-500/20'
                      : 'bg-surface-50 text-slate-500 cursor-not-allowed'
                  )}
                >
                  提交申请
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
