import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Star,
  StarOff,
  Pencil,
  Trash2,
  Copy,
  X,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import useStore from '@/store/useStore';
import type { Prompt, ToolCategory } from '@/store/useStore';

const CATEGORIES: { key: ToolCategory | 'all'; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'writing', label: '写作' },
  { key: 'image', label: '配图' },
  { key: 'translation', label: '翻译' },
  { key: 'research', label: '资料' },
  { key: 'other', label: '其他' },
];

const TAG_COLORS: Record<string, string> = {
  产品: 'bg-amber-500/20 text-amber-400',
  发布: 'bg-emerald-500/20 text-emerald-400',
  营销: 'bg-rose-500/20 text-rose-400',
  社交媒体: 'bg-sky-500/20 text-sky-400',
  短文案: 'bg-violet-500/20 text-violet-400',
  日常运营: 'bg-teal-500/20 text-teal-400',
  SEO: 'bg-orange-500/20 text-orange-400',
  大纲: 'bg-cyan-500/20 text-cyan-400',
  关键词: 'bg-lime-500/20 text-lime-400',
  配图: 'bg-fuchsia-500/20 text-fuchsia-400',
  提示词: 'bg-indigo-500/20 text-indigo-400',
  AI生成: 'bg-pink-500/20 text-pink-400',
  Logo: 'bg-yellow-500/20 text-yellow-400',
  品牌: 'bg-red-500/20 text-red-400',
  设计: 'bg-blue-500/20 text-blue-400',
  翻译: 'bg-emerald-500/20 text-emerald-400',
  专业文档: 'bg-indigo-500/20 text-indigo-400',
  术语: 'bg-teal-500/20 text-teal-400',
  摘要: 'bg-amber-500/20 text-amber-400',
  研究: 'bg-purple-500/20 text-purple-400',
  信息提取: 'bg-sky-500/20 text-sky-400',
  竞品分析: 'bg-rose-500/20 text-rose-400',
  报告: 'bg-cyan-500/20 text-cyan-400',
  市场研究: 'bg-orange-500/20 text-orange-400',
  改写: 'bg-lime-500/20 text-lime-400',
  润色: 'bg-fuchsia-500/20 text-fuchsia-400',
  内容优化: 'bg-violet-500/20 text-violet-400',
};

const DEFAULT_TAG_COLOR = 'bg-surface-200 text-gray-300';

function extractVariables(content: string): string[] {
  const matches = content.match(/\{\{([^}]+)\}\}/g);
  if (!matches) return [];
  return matches.map((m) => m.replace(/^\{\{|\}\}$/g, ''));
}

function renderContentPreview(content: string) {
  const parts = content.split(/(\{\{[^}]+\}\})/g);
  return parts.map((part, i) => {
    if (/^\{\{[^}]+\}\}$/.test(part)) {
      return (
        <code key={i} className="font-mono text-amber-400 bg-amber-500/10 px-1 rounded">
          {part}
        </code>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

interface EditorForm {
  title: string;
  category: ToolCategory;
  content: string;
  tags: string;
}

const emptyForm: EditorForm = {
  title: '',
  category: 'writing',
  content: '',
  tags: '',
};

export default function Prompts() {
  const { prompts, togglePromptFavorite, addPrompt, updatePrompt, deletePrompt } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'all'>('all');
  const [showEditorModal, setShowEditorModal] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [editorForm, setEditorForm] = useState<EditorForm>(emptyForm);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingPromptId, setDeletingPromptId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredPrompts = useMemo(() => {
    return prompts.filter((p) => {
      const matchCategory = activeCategory === 'all' || p.category === activeCategory;
      const matchSearch =
        !searchQuery ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCategory && matchSearch;
    });
  }, [prompts, activeCategory, searchQuery]);

  const editorVariables = useMemo(() => {
    return extractVariables(editorForm.content);
  }, [editorForm.content]);

  function handleOpenCreate() {
    setEditingPrompt(null);
    setEditorForm(emptyForm);
    setShowEditorModal(true);
  }

  function handleOpenEdit(prompt: Prompt) {
    setEditingPrompt(prompt);
    setEditorForm({
      title: prompt.title,
      category: prompt.category,
      content: prompt.content,
      tags: prompt.tags.join(', '),
    });
    setShowEditorModal(true);
  }

  function handleCloseEditor() {
    setShowEditorModal(false);
    setEditingPrompt(null);
    setEditorForm(emptyForm);
  }

  function handleSave() {
    const tags = editorForm.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    const variables = extractVariables(editorForm.content);

    if (editingPrompt) {
      updatePrompt(editingPrompt.id, {
        title: editorForm.title,
        category: editorForm.category,
        content: editorForm.content,
        tags,
        variables,
      });
    } else {
      addPrompt({
        title: editorForm.title,
        category: editorForm.category,
        content: editorForm.content,
        tags,
        variables,
        isFavorited: false,
      });
    }

    handleCloseEditor();
  }

  function handleDeleteClick(promptId: string) {
    setDeletingPromptId(promptId);
    setShowDeleteConfirm(true);
  }

  function handleConfirmDelete() {
    if (deletingPromptId) {
      deletePrompt(deletingPromptId);
    }
    setShowDeleteConfirm(false);
    setDeletingPromptId(null);
  }

  function handleCancelDelete() {
    setShowDeleteConfirm(false);
    setDeletingPromptId(null);
  }

  async function handleCopy(prompt: Prompt) {
    await navigator.clipboard.writeText(prompt.content);
    setCopiedId(prompt.id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  return (
    <div className="min-h-screen bg-surface font-body text-white p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold text-white">提示词库</h1>
              <p className="text-gray-400 mt-1 text-sm">管理和组织你的AI提示词模板</p>
            </div>
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-surface font-semibold px-5 py-2.5 rounded-xl transition-colors shrink-0"
            >
              <Plus size={18} />
              新建提示词
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索提示词标题、内容或标签..."
              className="w-full bg-surface-50 border border-surface-200 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-colors"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={cn(
                  'px-4 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  activeCategory === cat.key
                    ? 'bg-amber-500 text-surface'
                    : 'bg-surface-50 text-gray-400 hover:bg-surface-100 hover:text-white'
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredPrompts.map((prompt) => (
              <motion.div
                key={prompt.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-surface-50/60 backdrop-blur-md border border-white/[0.06] rounded-2xl p-5 flex flex-col gap-3 hover:border-amber-500/20 transition-colors group"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display font-semibold text-white text-base leading-tight">
                    {prompt.title}
                  </h3>
                  <button
                    onClick={() => togglePromptFavorite(prompt.id)}
                    className="shrink-0 text-gray-500 hover:text-amber-400 transition-colors"
                  >
                    {prompt.isFavorited ? (
                      <Star size={18} className="text-amber-400 fill-amber-400" />
                    ) : (
                      <StarOff size={18} />
                    )}
                  </button>
                </div>

                <p className="text-sm text-gray-300 leading-relaxed line-clamp-3">
                  {renderContentPreview(prompt.content)}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {prompt.tags.map((tag) => (
                    <span
                      key={tag}
                      className={cn(
                        'px-2 py-0.5 rounded-md text-xs font-medium',
                        TAG_COLORS[tag] || DEFAULT_TAG_COLOR
                      )}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-1 mt-auto pt-1 border-t border-white/[0.04]">
                  <button
                    onClick={() => handleOpenEdit(prompt)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-surface-100 transition-colors"
                  >
                    <Pencil size={13} />
                    编辑
                  </button>
                  <button
                    onClick={() => handleDeleteClick(prompt.id)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 size={13} />
                    删除
                  </button>
                  <button
                    onClick={() => handleCopy(prompt)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-gray-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors ml-auto"
                  >
                    <Copy size={13} />
                    {copiedId === prompt.id ? '已复制' : '复制'}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredPrompts.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg">未找到匹配的提示词</p>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {showEditorModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={handleCloseEditor}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-surface-50 border border-white/[0.08] rounded-2xl w-full max-w-lg p-6 flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-display font-bold text-white">
                  {editingPrompt ? '编辑提示词' : '新建提示词'}
                </h2>
                <button
                  onClick={handleCloseEditor}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-gray-400">标题</label>
                  <input
                    type="text"
                    value={editorForm.title}
                    onChange={(e) => setEditorForm({ ...editorForm, title: e.target.value })}
                    className="bg-surface border border-surface-200 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-colors"
                    placeholder="输入提示词标题"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-gray-400">分类</label>
                  <div className="relative">
                    <select
                      value={editorForm.category}
                      onChange={(e) =>
                        setEditorForm({ ...editorForm, category: e.target.value as ToolCategory })
                      }
                      className="w-full bg-surface border border-surface-200 rounded-xl px-4 py-2.5 text-sm text-white appearance-none focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-colors"
                    >
                      {CATEGORIES.filter((c) => c.key !== 'all').map((cat) => (
                        <option key={cat.key} value={cat.key}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-gray-400">内容</label>
                  <textarea
                    value={editorForm.content}
                    onChange={(e) => setEditorForm({ ...editorForm, content: e.target.value })}
                    rows={5}
                    className="bg-surface border border-surface-200 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-colors resize-none font-mono"
                    placeholder="输入提示词内容，使用 {{变量名}} 标记变量"
                  />
                </div>

                {editorVariables.length > 0 && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-gray-400">识别到的变量</label>
                    <div className="flex flex-wrap gap-2">
                      {editorVariables.map((v) => (
                        <span
                          key={v}
                          className="px-2.5 py-1 bg-amber-500/15 text-amber-400 rounded-lg text-xs font-mono"
                        >
                          {`{{${v}}}`}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-gray-400">标签（逗号分隔）</label>
                  <input
                    type="text"
                    value={editorForm.tags}
                    onChange={(e) => setEditorForm({ ...editorForm, tags: e.target.value })}
                    className="bg-surface border border-surface-200 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-colors"
                    placeholder="例如：产品, 营销, SEO"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={handleCloseEditor}
                  className="px-5 py-2 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-surface-100 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSave}
                  disabled={!editorForm.title.trim() || !editorForm.content.trim()}
                  className="px-5 py-2 rounded-xl text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-surface transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {editingPrompt ? '保存修改' : '创建'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={handleCancelDelete}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="bg-surface-50 border border-white/[0.08] rounded-2xl w-full max-w-sm p-6 flex flex-col gap-5"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-display font-bold text-white">确认删除</h3>
              <p className="text-sm text-gray-400">确定要删除这个提示词吗？此操作无法撤销。</p>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={handleCancelDelete}
                  className="px-5 py-2 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-surface-100 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-5 py-2 rounded-xl text-sm font-semibold bg-red-500 hover:bg-red-600 text-white transition-colors"
                >
                  删除
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
