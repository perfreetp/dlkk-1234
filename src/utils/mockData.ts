export type ToolCategory = 'writing' | 'image' | 'translation' | 'research' | 'other';

export interface ToolQuota {
  used: number;
  total: number;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: string;
  quota: ToolQuota;
  expiresAt: string;
  isFavorited: boolean;
  suitableRoles: string[];
}

export interface Prompt {
  id: string;
  title: string;
  content: string;
  category: ToolCategory;
  tags: string[];
  isFavorited: boolean;
  variables: string[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowStep {
  id: string;
  toolId: string;
  order: number;
  config: Record<string, string>;
}

export interface Workflow {
  id: string;
  name: string;
  steps: WorkflowStep[];
  createdAt: string;
}

export interface TaskRecord {
  id: string;
  toolId: string;
  toolName: string;
  input: string;
  output: string;
  rating: number;
  isFavorited: boolean;
  createdAt: string;
  workflowId?: string;
}

export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface ToolApplication {
  id: string;
  toolName: string;
  description: string;
  reason: string;
  applicant: string;
  status: ApplicationStatus;
  createdAt: string;
}

export type SuggestionType = 'duplicate' | 'inefficient' | 'outdated';
export type SuggestionSeverity = 'high' | 'medium' | 'low';

export interface OptimizationSuggestion {
  id: string;
  type: SuggestionType;
  title: string;
  description: string;
  severity: SuggestionSeverity;
  relatedTools: string[];
}

export const mockTools: Tool[] = [
  {
    id: 'tool-1',
    name: '文案助手',
    description: '快速生成营销文案、广告语和产品描述，支持多种风格切换',
    category: 'writing',
    icon: 'PenLine',
    quota: { used: 45, total: 100 },
    expiresAt: '2026-12-31',
    isFavorited: true,
    suitableRoles: ['内容运营', '市场专员'],
  },
  {
    id: 'tool-2',
    name: 'SEO优化器',
    description: '分析并优化文章SEO关键词密度、标题结构和元描述',
    category: 'writing',
    icon: 'Search',
    quota: { used: 20, total: 50 },
    expiresAt: '2026-09-30',
    isFavorited: false,
    suitableRoles: ['内容运营', 'SEO专员'],
  },
  {
    id: 'tool-3',
    name: '内容改写',
    description: '智能改写已有内容，保持语义不变的同时调整表达方式',
    category: 'writing',
    icon: 'RefreshCw',
    quota: { used: 30, total: 80 },
    expiresAt: '2026-11-15',
    isFavorited: true,
    suitableRoles: ['内容运营', '编辑'],
  },
  {
    id: 'tool-4',
    name: 'AI配图',
    description: '根据文案内容自动生成匹配的插图和配图',
    category: 'image',
    icon: 'Image',
    quota: { used: 15, total: 40 },
    expiresAt: '2026-10-31',
    isFavorited: false,
    suitableRoles: ['设计师', '内容运营'],
  },
  {
    id: 'tool-5',
    name: '图片增强',
    description: '提升图片分辨率、修复模糊、调整色彩和对比度',
    category: 'image',
    icon: 'Wand2',
    quota: { used: 8, total: 30 },
    expiresAt: '2026-08-20',
    isFavorited: false,
    suitableRoles: ['设计师'],
  },
  {
    id: 'tool-6',
    name: '图标生成',
    description: '快速生成应用图标、Logo和品牌标识素材',
    category: 'image',
    icon: 'Shapes',
    quota: { used: 5, total: 25 },
    expiresAt: '2026-12-01',
    isFavorited: true,
    suitableRoles: ['设计师', '产品经理'],
  },
  {
    id: 'tool-7',
    name: '智能翻译',
    description: '支持50+语言互译，自动识别语境和专业术语',
    category: 'translation',
    icon: 'Languages',
    quota: { used: 60, total: 120 },
    expiresAt: '2026-12-31',
    isFavorited: true,
    suitableRoles: ['翻译', '内容运营'],
  },
  {
    id: 'tool-8',
    name: '多语言校对',
    description: '多语言文本语法检查、拼写校正和风格一致性校验',
    category: 'translation',
    icon: 'CheckCircle',
    quota: { used: 25, total: 60 },
    expiresAt: '2026-11-30',
    isFavorited: false,
    suitableRoles: ['翻译', '编辑'],
  },
  {
    id: 'tool-9',
    name: '术语库',
    description: '管理团队统一术语表，确保翻译内容术语一致',
    category: 'translation',
    icon: 'BookOpen',
    quota: { used: 10, total: 30 },
    expiresAt: '2026-10-15',
    isFavorited: false,
    suitableRoles: ['翻译', '内容运营'],
  },
  {
    id: 'tool-10',
    name: '资料整理',
    description: '自动整理和分类收集的研究资料，提取关键信息',
    category: 'research',
    icon: 'FolderSearch',
    quota: { used: 35, total: 70 },
    expiresAt: '2026-12-31',
    isFavorited: false,
    suitableRoles: ['研究员', '内容运营'],
  },
  {
    id: 'tool-11',
    name: '摘要生成',
    description: '从长文档中提取核心观点，生成简洁摘要',
    category: 'research',
    icon: 'FileText',
    quota: { used: 40, total: 80 },
    expiresAt: '2026-11-20',
    isFavorited: true,
    suitableRoles: ['研究员', '编辑'],
  },
  {
    id: 'tool-12',
    name: '数据提取',
    description: '从非结构化文本中批量提取结构化数据字段',
    category: 'research',
    icon: 'Table',
    quota: { used: 12, total: 50 },
    expiresAt: '2026-09-30',
    isFavorited: false,
    suitableRoles: ['数据分析师', '研究员'],
  },
  {
    id: 'tool-13',
    name: '格式转换',
    description: '支持Markdown、HTML、Word、PDF等格式互转',
    category: 'other',
    icon: 'FileOutput',
    quota: { used: 18, total: 60 },
    expiresAt: '2026-12-31',
    isFavorited: false,
    suitableRoles: ['编辑', '内容运营'],
  },
];

export const mockPrompts: Prompt[] = [
  {
    id: 'prompt-1',
    title: '产品发布文案模板',
    content: '请为{{产品名称}}撰写一篇产品发布文案，目标受众是{{目标受众}}，核心卖点是{{核心卖点}}，要求语调{{语调风格}}，字数控制在{{字数}}字以内。',
    category: 'writing',
    tags: ['产品', '发布', '营销'],
    isFavorited: true,
    variables: ['产品名称', '目标受众', '核心卖点', '语调风格', '字数'],
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-03-10T14:30:00Z',
  },
  {
    id: 'prompt-2',
    title: '社交媒体短文案',
    content: '为{{品牌名称}}创作一条{{平台}}风格的社交媒体文案，主题是{{主题}}，需要包含{{话题标签}}，风格{{风格要求}}。',
    category: 'writing',
    tags: ['社交媒体', '短文案', '日常运营'],
    isFavorited: false,
    variables: ['品牌名称', '平台', '主题', '话题标签', '风格要求'],
    createdAt: '2026-02-01T09:00:00Z',
    updatedAt: '2026-02-28T16:00:00Z',
  },
  {
    id: 'prompt-3',
    title: 'SEO文章大纲生成',
    content: '请围绕关键词{{关键词}}生成一篇SEO优化文章的大纲，包含{{段落数}}个主要段落，每段需包含相关长尾关键词，目标排名位置{{目标排名}}。',
    category: 'writing',
    tags: ['SEO', '大纲', '关键词'],
    isFavorited: true,
    variables: ['关键词', '段落数', '目标排名'],
    createdAt: '2026-02-10T10:00:00Z',
    updatedAt: '2026-04-05T11:20:00Z',
  },
  {
    id: 'prompt-4',
    title: '配图提示词生成',
    content: '根据以下文案内容生成AI配图提示词：{{文案内容}}。要求图片风格为{{图片风格}}，色调偏{{色调}}，画面中需要包含{{核心元素}}。',
    category: 'image',
    tags: ['配图', '提示词', 'AI生成'],
    isFavorited: false,
    variables: ['文案内容', '图片风格', '色调', '核心元素'],
    createdAt: '2026-03-01T08:30:00Z',
    updatedAt: '2026-03-15T09:00:00Z',
  },
  {
    id: 'prompt-5',
    title: '品牌Logo设计需求',
    content: '为{{品牌名称}}设计一个Logo，品牌定位是{{品牌定位}}，偏好的设计风格是{{设计风格}}，主色调为{{主色调}}，需要传达的价值观是{{价值观}}。',
    category: 'image',
    tags: ['Logo', '品牌', '设计'],
    isFavorited: true,
    variables: ['品牌名称', '品牌定位', '设计风格', '主色调', '价值观'],
    createdAt: '2026-03-10T11:00:00Z',
    updatedAt: '2026-04-20T15:00:00Z',
  },
  {
    id: 'prompt-6',
    title: '专业文档翻译',
    content: '将以下{{源语言}}内容翻译为{{目标语言}}，保持专业术语的准确性，领域为{{专业领域}}，术语风格参考{{术语标准}}：{{原文内容}}',
    category: 'translation',
    tags: ['翻译', '专业文档', '术语'],
    isFavorited: true,
    variables: ['源语言', '目标语言', '专业领域', '术语标准', '原文内容'],
    createdAt: '2026-01-20T07:00:00Z',
    updatedAt: '2026-05-01T10:00:00Z',
  },
  {
    id: 'prompt-7',
    title: '研究资料摘要',
    content: '请对以下研究资料进行摘要提取：{{资料内容}}。重点关注{{关注方向}}，摘要长度约{{字数}}字，需要保留的关键数据包括{{关键数据类型}}。',
    category: 'research',
    tags: ['摘要', '研究', '信息提取'],
    isFavorited: false,
    variables: ['资料内容', '关注方向', '字数', '关键数据类型'],
    createdAt: '2026-04-01T09:00:00Z',
    updatedAt: '2026-04-15T13:00:00Z',
  },
  {
    id: 'prompt-8',
    title: '竞品分析报告框架',
    content: '为{{产品名称}}生成一份竞品分析报告框架，竞品包括{{竞品列表}}，分析维度涵盖{{分析维度}}，报告用途是{{报告用途}}。',
    category: 'research',
    tags: ['竞品分析', '报告', '市场研究'],
    isFavorited: false,
    variables: ['产品名称', '竞品列表', '分析维度', '报告用途'],
    createdAt: '2026-04-10T10:00:00Z',
    updatedAt: '2026-05-05T14:00:00Z',
  },
  {
    id: 'prompt-9',
    title: '内容改写润色',
    content: '请将以下内容进行改写润色：{{原始内容}}。改写目标是{{改写目标}}，保持{{核心信息}}不变，目标读者是{{目标读者}}。',
    category: 'writing',
    tags: ['改写', '润色', '内容优化'],
    isFavorited: false,
    variables: ['原始内容', '改写目标', '核心信息', '目标读者'],
    createdAt: '2026-05-01T08:00:00Z',
    updatedAt: '2026-05-20T16:30:00Z',
  },
];

export const mockWorkflows: Workflow[] = [
  {
    id: 'wf-1',
    name: '内容发布流程',
    steps: [
      { id: 'step-1', toolId: 'tool-1', order: 1, config: { style: '专业', length: '500' } },
      { id: 'step-2', toolId: 'tool-2', order: 2, config: { targetKeywords: 'AI工具,效率', density: '2%' } },
      { id: 'step-3', toolId: 'tool-4', order: 3, config: { style: '扁平化', size: '1200x630' } },
    ],
    createdAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'wf-2',
    name: '翻译校对流程',
    steps: [
      { id: 'step-4', toolId: 'tool-7', order: 1, config: { source: 'zh', target: 'en', domain: '科技' } },
      { id: 'step-5', toolId: 'tool-8', order: 2, config: { checkLevel: 'strict', glossary: '产品术语表' } },
    ],
    createdAt: '2026-03-15T14:00:00Z',
  },
];

export const mockTaskRecords: TaskRecord[] = [
  {
    id: 'task-1',
    toolId: 'tool-1',
    toolName: '文案助手',
    input: '为新款智能手表撰写产品发布文案',
    output: '全新智能手表，重新定义腕上科技。精准健康监测，超长续航陪伴，让每一天都从容不迫。',
    rating: 5,
    isFavorited: true,
    createdAt: '2026-05-01T09:00:00Z',
  },
  {
    id: 'task-2',
    toolId: 'tool-7',
    toolName: '智能翻译',
    input: '将产品介绍翻译为英文',
    output: 'Our new smartwatch redefines wrist technology. Precision health monitoring, ultra-long battery life, making every day effortless.',
    rating: 4,
    isFavorited: false,
    createdAt: '2026-05-02T10:30:00Z',
  },
  {
    id: 'task-3',
    toolId: 'tool-2',
    toolName: 'SEO优化器',
    input: '优化博客文章的SEO关键词',
    output: '建议关键词密度调整：主关键词"AI工具"从1.2%提升至2.5%，增加长尾词"AI写作助手"出现频次。',
    rating: 4,
    isFavorited: true,
    createdAt: '2026-05-03T14:00:00Z',
  },
  {
    id: 'task-4',
    toolId: 'tool-4',
    toolName: 'AI配图',
    input: '为一篇关于远程办公的文章生成配图',
    output: '[生成了一张居家办公场景的插图，风格为扁平化设计]',
    rating: 3,
    isFavorited: false,
    createdAt: '2026-05-05T11:00:00Z',
  },
  {
    id: 'task-5',
    toolId: 'tool-11',
    toolName: '摘要生成',
    input: '提取这份50页行业报告的核心观点',
    output: '核心观点：1.AI内容工具市场年增长率达35%；2.企业级需求推动工具专业化；3.多模态能力成为竞争壁垒。',
    rating: 5,
    isFavorited: true,
    createdAt: '2026-05-06T09:30:00Z',
    workflowId: 'wf-1',
  },
  {
    id: 'task-6',
    toolId: 'tool-8',
    toolName: '多语言校对',
    input: '校对翻译后的英文产品说明书',
    output: '发现3处语法错误，2处术语不一致。建议将"equipment"统一为"device"，修正被动语态使用。',
    rating: 4,
    isFavorited: false,
    createdAt: '2026-05-07T16:00:00Z',
    workflowId: 'wf-2',
  },
  {
    id: 'task-7',
    toolId: 'tool-3',
    toolName: '内容改写',
    input: '改写这段产品描述，使其更具吸引力',
    output: '原文过于技术化，已调整为更具故事性和情感共鸣的表达方式，保留了核心参数信息。',
    rating: 3,
    isFavorited: false,
    createdAt: '2026-05-08T10:00:00Z',
  },
  {
    id: 'task-8',
    toolId: 'tool-6',
    toolName: '图标生成',
    input: '为AI工具箱项目生成应用图标',
    output: '[生成了6款风格各异的应用图标方案，含SVG源文件]',
    rating: 5,
    isFavorited: true,
    createdAt: '2026-05-10T13:00:00Z',
  },
  {
    id: 'task-9',
    toolId: 'tool-10',
    toolName: '资料整理',
    input: '整理收集的20篇竞品分析文章',
    output: '已按功能维度分类整理，提取出12个核心功能对比项，生成对比矩阵表格。',
    rating: 4,
    isFavorited: false,
    createdAt: '2026-05-12T15:00:00Z',
  },
  {
    id: 'task-10',
    toolId: 'tool-13',
    toolName: '格式转换',
    input: '将Markdown格式的文档转为Word',
    output: '已完成格式转换，保留了标题层级、表格和代码块样式。',
    rating: 4,
    isFavorited: false,
    createdAt: '2026-05-13T09:00:00Z',
  },
  {
    id: 'task-11',
    toolId: 'tool-12',
    toolName: '数据提取',
    input: '从客户反馈邮件中提取评分和关键词',
    output: '已提取85封邮件数据，平均评分4.2，高频关键词：响应速度、界面设计、稳定性。',
    rating: 2,
    isFavorited: false,
    createdAt: '2026-05-14T11:30:00Z',
  },
];

export const mockToolApplications: ToolApplication[] = [
  {
    id: 'app-1',
    toolName: '视频脚本生成器',
    description: '自动根据主题和目标受众生成短视频脚本，支持分镜和时长控制',
    reason: '短视频内容需求增长迅速，团队缺少专业的脚本编写工具，现有文案助手无法满足视频格式需求',
    applicant: '张明',
    status: 'pending',
    createdAt: '2026-06-01T09:00:00Z',
  },
  {
    id: 'app-2',
    toolName: '邮件模板库',
    description: '提供常用商务邮件模板，支持自定义变量和批量发送',
    reason: '市场团队每周需要发送大量商务邮件，模板化可显著提升效率',
    applicant: '李婷',
    status: 'approved',
    createdAt: '2026-05-15T10:00:00Z',
  },
  {
    id: 'app-3',
    toolName: '语音转文字工具',
    description: '将会议录音和语音笔记转换为结构化文字记录',
    reason: '会议纪要整理耗时较多，语音转文字可节省大量人工转录时间',
    applicant: '王磊',
    status: 'rejected',
    createdAt: '2026-05-20T14:00:00Z',
  },
];

export const mockOptimizationSuggestions: OptimizationSuggestion[] = [
  {
    id: 'opt-1',
    type: 'duplicate',
    title: '文案助手与内容改写功能重叠',
    description: '文案助手和内容改写在生成文案方面存在功能重叠，建议合并为统一工具或明确差异化定位',
    severity: 'high',
    relatedTools: ['tool-1', 'tool-3'],
  },
  {
    id: 'opt-2',
    type: 'inefficient',
    title: '翻译校对流程可简化',
    description: '智能翻译与多语言校对经常配合使用，建议将其整合为一体化翻译校对工具',
    severity: 'medium',
    relatedTools: ['tool-7', 'tool-8'],
  },
  {
    id: 'opt-3',
    type: 'outdated',
    title: '术语库使用率极低',
    description: '术语库工具近3个月使用率不足5%，大部分团队已改用外部术语管理平台',
    severity: 'low',
    relatedTools: ['tool-9'],
  },
  {
    id: 'opt-4',
    type: 'inefficient',
    title: '资料整理与数据提取功能边界模糊',
    description: '资料整理和数据提取在处理非结构化内容时功能边界不清晰，用户经常混淆两者的使用场景',
    severity: 'medium',
    relatedTools: ['tool-10', 'tool-12'],
  },
];
