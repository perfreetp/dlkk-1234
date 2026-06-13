import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  BarChart3,
  Heart,
  Star,
  Filter,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  ClipboardList,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import useStore from '@/store/useStore';

export default function Records() {
  const { taskRecords, updateTaskRating, toggleRecordFavorite } = useStore();
  const [ratingFilter, setRatingFilter] = useState(0);
  const [showFavOnly, setShowFavOnly] = useState(false);
  const [expandedRecordId, setExpandedRecordId] = useState<string | null>(null);

  const filteredRecords = useMemo(() => {
    let records = [...taskRecords];
    if (ratingFilter > 0) {
      records = records.filter((r) => r.rating === ratingFilter);
    }
    if (showFavOnly) {
      records = records.filter((r) => r.isFavorited);
    }
    return records.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [taskRecords, ratingFilter, showFavOnly]);

  const totalCount = taskRecords.length;
  const avgRating =
    totalCount > 0
      ? (taskRecords.reduce((sum, r) => sum + r.rating, 0) / totalCount).toFixed(1)
      : '0.0';
  const favCount = taskRecords.filter((r) => r.isFavorited).length;

  const toolStats = useMemo(() => {
    const map = new Map<string, { name: string; count: number; totalRating: number }>();
    taskRecords.forEach((r) => {
      const existing = map.get(r.toolId);
      if (existing) {
        existing.count += 1;
        existing.totalRating += r.rating;
      } else {
        map.set(r.toolId, { name: r.toolName, count: 1, totalRating: r.rating });
      }
    });
    return Array.from(map.entries())
      .map(([id, stat]) => ({
        id,
        name: stat.name,
        count: stat.count,
        avgRating: Number((stat.totalRating / stat.count).toFixed(1)),
      }))
      .sort((a, b) => b.count - a.count);
  }, [taskRecords]);

  const maxToolCount = Math.max(...toolStats.map((t) => t.count), 1);

  const inefficientTools = toolStats.filter((t) => t.avgRating < 3);

  const formatDateTime = (iso: string) => {
    const d = new Date(iso);
    const date = d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
    const time = d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    return { date, time };
  };

  const truncate = (text: string, max: number) =>
    text.length > max ? text.slice(0, max) + '...' : text;

  const ratingOptions = [
    { value: 0, label: '全部' },
    { value: 1, label: '1星' },
    { value: 2, label: '2星' },
    { value: 3, label: '3星' },
    { value: 4, label: '4星' },
    { value: 5, label: '5星' },
  ];

  return (
    <div className="min-h-screen p-6 space-y-8 font-body">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-display font-bold text-gradient-amber">任务记录</h1>
        <p className="text-slate-400 mt-1">查看和管理你的 AI 工具使用记录与效率分析</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: ClipboardList, value: totalCount, label: '总记录数', color: 'text-indigo-400' },
          { icon: Star, value: avgRating, label: '平均评分', color: 'text-amber-400' },
          { icon: Heart, value: favCount, label: '收藏记录', color: 'text-rose-400' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="glass rounded-xl p-5 flex items-center gap-4"
          >
            <div
              className={cn(
                'w-12 h-12 rounded-lg flex items-center justify-center bg-surface-100',
                stat.color
              )}
            >
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-display font-bold text-white">{stat.value}</div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="glass rounded-xl p-4 flex flex-wrap items-center gap-3"
      >
        <Filter className="w-4 h-4 text-slate-400" />
        <span className="text-sm text-slate-400 mr-1">评分筛选:</span>
        {ratingOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setRatingFilter(opt.value)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
              ratingFilter === opt.value
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-surface-100 text-slate-400 border border-transparent hover:text-slate-300'
            )}
          >
            {opt.label}
          </button>
        ))}
        <div className="w-px h-6 bg-surface-200 mx-2" />
        <button
          onClick={() => setShowFavOnly(!showFavOnly)}
          className={cn(
            'px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5',
            showFavOnly
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              : 'bg-surface-100 text-slate-400 border border-transparent hover:text-slate-300'
          )}
        >
          <Heart className={cn('w-3.5 h-3.5', showFavOnly && 'fill-rose-400')} />
          仅收藏
        </button>
      </motion.div>

      <div className="space-y-0">
        <AnimatePresence mode="popLayout">
          {filteredRecords.map((record, i) => {
            const { date, time } = formatDateTime(record.createdAt);
            const isExpanded = expandedRecordId === record.id;
            return (
              <motion.div
                key={record.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                className="flex gap-4"
              >
                <div className="flex flex-col items-center w-20 shrink-0 pt-4">
                  <div className="text-xs text-slate-500 font-mono">{date}</div>
                  <div className="text-xs text-slate-600 font-mono">{time}</div>
                  <div className="flex-1 w-px bg-gradient-to-b from-indigo-500/40 via-indigo-500/20 to-transparent my-2" />
                  <div className="w-2 h-2 rounded-full bg-indigo-500/60 shrink-0" />
                  <div className="flex-1 w-px bg-gradient-to-b from-indigo-500/20 via-indigo-500/10 to-transparent" />
                </div>

                <motion.div
                  layout
                  className={cn(
                    'flex-1 glass rounded-xl p-5 mb-4 transition-all cursor-pointer card-gradient-border',
                    isExpanded && 'glow-indigo'
                  )}
                  onClick={() => setExpandedRecordId(isExpanded ? null : record.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-500/15 text-indigo-300 text-xs font-medium mb-3">
                        <Sparkles className="w-3 h-3" />
                        {record.toolName}
                      </span>

                      <div className="space-y-2">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-display">
                            输入
                          </span>
                          <p className="text-sm text-slate-300 mt-0.5">
                            {isExpanded ? record.input : truncate(record.input, 60)}
                          </p>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-display">
                            输出
                          </span>
                          <p className="text-sm text-slate-300 mt-0.5">
                            {isExpanded ? record.output : truncate(record.output, 80)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={(e) => {
                              e.stopPropagation();
                              updateTaskRating(record.id, star);
                            }}
                            className="p-0.5 transition-transform hover:scale-125"
                          >
                            <Star
                              className={cn(
                                'w-4 h-4 transition-colors',
                                star <= record.rating
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-slate-600'
                              )}
                            />
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRecordFavorite(record.id);
                        }}
                        className="p-1 transition-transform hover:scale-125"
                      >
                        <Heart
                          className={cn(
                            'w-4 h-4 transition-colors',
                            record.isFavorited
                              ? 'text-rose-400 fill-rose-400'
                              : 'text-slate-600'
                          )}
                        />
                      </button>

                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-500" />
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredRecords.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass rounded-xl p-12 text-center text-slate-500"
          >
            <ClipboardList className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>暂无匹配的任务记录</p>
          </motion.div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="glass rounded-xl p-6 space-y-6"
      >
        <h2 className="text-xl font-display font-semibold text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-amber-400" />
          效率分析
        </h2>

        <div className="space-y-4">
          <h3 className="text-sm text-slate-400 font-display uppercase tracking-wider">工具使用频率</h3>
          {toolStats.map((tool) => (
            <div key={tool.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300">{tool.name}</span>
                <span className="text-slate-500 font-mono">{tool.count} 次</span>
              </div>
              <div className="w-full h-3 bg-surface-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(tool.count / maxToolCount) * 100}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-amber-500"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3 pt-4 border-t border-surface-200">
          <h3 className="text-sm text-slate-400 font-display uppercase tracking-wider">工具平均评分</h3>
          {toolStats.map((tool) => (
            <div key={tool.id} className="flex items-center justify-between text-sm">
              <span className="text-slate-300">{tool.name}</span>
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={cn(
                        'w-3 h-3',
                        s <= Math.round(tool.avgRating)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-700'
                      )}
                    />
                  ))}
                </div>
                <span
                  className={cn(
                    'font-mono text-xs',
                    tool.avgRating < 3 ? 'text-rose-400' : 'text-slate-400'
                  )}
                >
                  {tool.avgRating}
                </span>
              </div>
            </div>
          ))}
        </div>

        {inefficientTools.length > 0 && (
          <div className="pt-4 border-t border-surface-200 space-y-3">
            <h3 className="text-sm text-slate-400 font-display uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              低效工具
            </h3>
            {inefficientTools.map((tool) => (
              <div
                key={tool.id}
                className="flex items-center justify-between p-3 rounded-lg bg-rose-500/10 border border-rose-500/20"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span className="text-sm text-rose-300">{tool.name}</span>
                </div>
                <span className="text-xs text-rose-400 font-mono">
                  平均评分 {tool.avgRating}
                </span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
