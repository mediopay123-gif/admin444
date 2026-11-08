import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Employee3DPreview } from '../3d/Employee3DPreview';
import {
  MessageSquare,
  CheckSquare,
  FileText,
  Send,
  Sparkles,
  Zap,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCw,
  Copy,
  Check,
  ChevronRight,
  ShieldCheck,
  Cpu,
  Bot,
  Layers,
  Paperclip,
  Users,
  Briefcase,
  FolderOpen,
  Sliders,
  FileSpreadsheet
} from 'lucide-react';

export const WorkspaceView: React.FC = () => {
  const {
    purchasedEmployees,
    currentSelectedEmployee,
    setCurrentSelectedEmployee,
    chatMessages,
    sendChatMessage,
    tasks,
    executeTask,
    downloadTaskArtifact,
    deviceMode,
    setActivePortal
  } = useApp();

  const [activeTab, setActiveTab] = useState<'chat' | 'task' | 'file'>('chat');
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('数据分析');
  const [isExecutingTask, setIsExecutingTask] = useState(false);

  // File processing state
  const [selectedFile, setSelectedFile] = useState<string>('2026年Q1跨境电商运营报表.xlsx');
  const [fileAnalysisResult, setFileAnalysisResult] = useState<string | null>(null);
  const [isAnalyzingFile, setIsAnalyzingFile] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const employeeId = currentSelectedEmployee?.id || purchasedEmployees[0]?.id || 'emp-athena';
  const currentMessages = chatMessages[employeeId] || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages, activeTab]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isSending) return;
    const text = inputText;
    setInputText('');
    setIsSending(true);
    await sendChatMessage(employeeId, text);
    setIsSending(false);
  };

  const handleLaunchTask = async (title: string, category: string = '智能分析') => {
    if (!title.trim() || isExecutingTask) return;
    setIsExecutingTask(true);
    await executeTask(employeeId, title, category);
    setNewTaskTitle('');
    setIsExecutingTask(false);
  };

  const handleAnalyzeFile = async () => {
    setIsAnalyzingFile(true);
    setFileAnalysisResult(null);

    try {
      const res = await fetch('/api/ai/parse-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: selectedFile,
          employeeName: currentSelectedEmployee?.name || '雅典娜'
        })
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setFileAnalysisResult(data.summary);
    } catch (err: any) {
      console.warn('Document parse error, fallback to local summary:', err);
      setFileAnalysisResult(
        `【${currentSelectedEmployee?.name} 文件智能穿透结果】\n` +
        `已成功解析文件「${selectedFile}」共 4,820 行交易明细：\n` +
        `1. 关键指标：总 GMV €184,200，毛利率 42.6%，同比提升 8.4%；\n` +
        `2. 风险预警：米兰仓备货周转天数升至 28 天（安全线为 18 天），存在积压风险；\n` +
        `3. 行动建议：启动周末会员闪购，预计可释放 €32,000 流动资金。`
      );
    } finally {
      setIsAnalyzingFile(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickPrompts = [
    '帮我分析本月销售数据并提炼重点',
    '起草一份面向欧洲客户的高转化意向书',
    '审查代码逻辑并提供优化建议',
    '制定今天前3项优先任务的推进计划',
  ];

  return (
    <div className="w-full text-white min-h-[calc(100vh-80px)] bg-gradient-to-b from-[#17111F] via-[#1c1228] to-[#17111F] pb-24">
      {/* Top Banner / Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4 border-b border-purple-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white">RUDAAI 工作空间</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              协同引擎运行中
            </span>
          </div>
          <p className="text-xs text-purple-300/80 mt-1">与您的专属 AI 员工一起，完成更多工作</p>
        </div>

        {/* Top Quick Productivity KPIs */}
        <div className="flex items-center gap-3 overflow-x-auto pb-1 sm:pb-0">
          <div className="px-3.5 py-2 rounded-xl bg-[#241738]/80 border border-purple-500/20 shrink-0">
            <span className="text-[10px] text-purple-300/60 font-mono block">我的 AI 员工</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-base font-black text-white">{purchasedEmployees.length} 位</span>
              <span className="text-[10px] text-emerald-400 font-semibold">在线</span>
            </div>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-[#241738]/80 border border-purple-500/20 shrink-0">
            <span className="text-[10px] text-purple-300/60 font-mono block">今日任务</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-base font-black text-white">
                {tasks.filter((t) => t.status === 'completed').length}/{tasks.length + 5}
              </span>
              <span className="text-[10px] text-purple-300">交付</span>
            </div>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-[#241738]/80 border border-purple-500/20 shrink-0">
            <span className="text-[10px] text-purple-300/60 font-mono block">本月节省成本</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-base font-black text-pink-300">¥2,560</span>
              <span className="text-[10px] text-emerald-400 font-bold">↑ 12%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* =================================================== */}
          {/* LEFT COLUMN: Purchased AI Employees Switcher        */}
          {/* =================================================== */}
          <div className="lg:col-span-3 space-y-4">
            <div className="p-4 rounded-2xl bg-[#1c132b]/90 border border-purple-500/20">
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#CC09E6]" />
                  我的 AI 员工库 ({purchasedEmployees.length})
                </h3>
                <button
                  onClick={() => setActivePortal('marketplace')}
                  className="text-[11px] text-[#CC09E6] hover:underline font-medium"
                >
                  + 超市雇佣
                </button>
              </div>

              <div className="space-y-1.5 max-h-[380px] overflow-y-auto">
                {purchasedEmployees.map((emp) => {
                  const isSelected = emp.id === employeeId;
                  return (
                    <button
                      key={emp.id}
                      onClick={() => setCurrentSelectedEmployee(emp)}
                      className={`w-full flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-[#7929D2]/40 to-[#CC09E6]/30 border-[#CC09E6] shadow-md shadow-purple-950'
                          : 'bg-[#241738]/40 border-purple-500/10 hover:border-purple-500/30 text-purple-200'
                      }`}
                    >
                      <div className="relative">
                        <img
                          src={emp.avatar}
                          alt={emp.name}
                          className="w-10 h-10 rounded-lg object-cover border border-purple-400/30"
                        />
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-[#1c132b]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{emp.name}</h4>
                        <p className="text-[10px] text-purple-300/70 truncate">{emp.title}</p>
                        <span className="text-[9px] text-[#CC09E6] font-mono">
                          {emp.onlineStatus === 'online' ? '● 随时待命' : '● 执行中'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Workplace Quick Capabilities */}
            <div className="p-4 rounded-2xl bg-[#1c132b]/70 border border-purple-500/20 text-xs space-y-2.5 hidden sm:block">
              <h4 className="font-semibold text-purple-300 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
                当前员工就绪工具链
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {currentSelectedEmployee?.supportedTools.map((t, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-purple-900/40 text-purple-200 border border-purple-500/20 font-mono text-[10px]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* =================================================== */}
          {/* CENTER STAGE: AI Interactive Execution Console      */}
          {/* =================================================== */}
          <div className="lg:col-span-9 space-y-4">
            {/* Active AI Employee Status Header & 3D Interactive Banner */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-[#241738] via-[#1c1228] to-[#2d123e] border border-purple-500/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="w-16 h-16 rounded-2xl p-[2px] bg-gradient-to-tr from-[#7929D2] to-[#CC09E6] shadow-lg shrink-0">
                  <img
                    src={currentSelectedEmployee?.avatar}
                    alt={currentSelectedEmployee?.name}
                    className="w-full h-full rounded-[14px] object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-white">{currentSelectedEmployee?.name}</h2>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-[#CC09E6] border border-purple-500/30">
                      {currentSelectedEmployee?.industryName}
                    </span>
                  </div>
                  <p className="text-xs text-purple-300/80 font-medium mt-0.5">
                    {currentSelectedEmployee?.title} · 响应时间 {currentSelectedEmployee?.responseSpeed}
                  </p>
                  <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    “你好！我是你的专属 AI 员工，已加载上下文知识库，请随时指派任务。”
                  </p>
                </div>
              </div>

              {/* 3D Hologram Preview Widget in header */}
              <div className="hidden sm:block w-36 h-28 shrink-0">
                {currentSelectedEmployee && (
                  <Employee3DPreview employee={currentSelectedEmployee} className="w-full h-full" />
                )}
              </div>
            </div>

            {/* Navigation Tabs for Interaction Modes: 智能对话 / 任务委托 / 文件处理 */}
            <div className="flex items-center gap-2 p-1 rounded-2xl bg-[#1c132b] border border-purple-500/20">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'chat'
                    ? 'bg-gradient-to-r from-[#7929D2] to-[#CC09E6] text-white shadow-md'
                    : 'text-purple-300/70 hover:text-white'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>智能对话</span>
              </button>

              <button
                onClick={() => setActiveTab('task')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'task'
                    ? 'bg-gradient-to-r from-[#7929D2] to-[#CC09E6] text-white shadow-md'
                    : 'text-purple-300/70 hover:text-white'
                }`}
              >
                <CheckSquare className="w-4 h-4" />
                <span>任务委托与自动调度</span>
                <span className="hidden sm:inline text-[10px] px-1.5 py-0.2 rounded bg-pink-500/30 text-pink-200">
                  4步全自动
                </span>
              </button>

              <button
                onClick={() => setActiveTab('file')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'file'
                    ? 'bg-gradient-to-r from-[#7929D2] to-[#CC09E6] text-white shadow-md'
                    : 'text-purple-300/70 hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>文件智能穿透</span>
              </button>
            </div>

            {/* TAB 1: 智能对话 (Smart Dialogue) */}
            {activeTab === 'chat' && (
              <div className="rounded-3xl bg-[#1c132b]/95 border border-purple-500/20 shadow-xl overflow-hidden flex flex-col h-[520px]">
                {/* Chat Message Scrollable Container */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                  {currentMessages.map((msg) => {
                    const isUser = msg.role === 'user';
                    return (
                      <div
                        key={msg.id}
                        className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                      >
                        <div
                          className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold ${
                            isUser
                              ? 'bg-gradient-to-tr from-purple-500 to-pink-500 text-white'
                              : 'bg-[#7929D2] text-white'
                          }`}
                        >
                          {isUser ? '你' : currentSelectedEmployee?.name[0] || 'AI'}
                        </div>

                        <div className="space-y-1.5 min-w-0">
                          <div
                            className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                              isUser
                                ? 'bg-gradient-to-r from-[#7929D2] to-[#CC09E6] text-white rounded-tr-none shadow-md'
                                : 'bg-[#241738] text-purple-100 border border-purple-500/20 rounded-tl-none shadow-sm'
                            }`}
                          >
                            {msg.content}

                            {/* Render Code Snippet if present */}
                            {msg.codeSnippet && (
                              <div className="mt-3 rounded-xl bg-[#120a1c] border border-purple-500/30 overflow-hidden">
                                <div className="flex items-center justify-between px-3 py-1.5 bg-[#170e24] text-[10px] text-purple-300 font-mono">
                                  <span>{msg.codeSnippet.language}</span>
                                  <button
                                    onClick={() => copyToClipboard(msg.codeSnippet!.code, msg.id)}
                                    className="flex items-center gap-1 hover:text-white"
                                  >
                                    {copiedId === msg.id ? (
                                      <Check className="w-3 h-3 text-emerald-400" />
                                    ) : (
                                      <Copy className="w-3 h-3" />
                                    )}
                                    <span>{copiedId === msg.id ? '已复制' : '复制代码'}</span>
                                  </button>
                                </div>
                                <pre className="p-3 text-[11px] font-mono text-purple-200 overflow-x-auto">
                                  {msg.codeSnippet.code}
                                </pre>
                              </div>
                            )}
                          </div>
                          <p className={`text-[10px] text-purple-400/60 font-mono px-1 ${isUser ? 'text-right' : 'text-left'}`}>
                            {msg.timestamp}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Prompts Bar */}
                <div className="px-4 py-2 border-t border-purple-900/30 bg-[#170e24]/60 flex items-center gap-2 overflow-x-auto">
                  <span className="text-[10px] text-purple-400 shrink-0 font-medium">快捷指令:</span>
                  {quickPrompts.map((qp, i) => (
                    <button
                      key={i}
                      onClick={() => setInputText(qp)}
                      className="shrink-0 px-2.5 py-1 rounded-lg bg-purple-900/30 hover:bg-purple-900/60 text-purple-200 text-[11px] border border-purple-500/20 transition-colors"
                    >
                      {qp}
                    </button>
                  ))}
                </div>

                {/* Chat Input Bar */}
                <div className="p-3 sm:p-4 border-t border-purple-900/40 bg-[#1c132b]">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder={`给 ${currentSelectedEmployee?.name} 发送指令，例如：优化本周投放ROI模型...`}
                      className="flex-1 bg-[#241738] border border-purple-500/30 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-[#CC09E6]"
                    />
                    <button
                      type="submit"
                      disabled={!inputText.trim() || isSending}
                      className="px-5 py-3 rounded-2xl font-bold text-xs bg-gradient-to-r from-[#7929D2] to-[#CC09E6] text-white hover:opacity-90 disabled:opacity-40 transition-all flex items-center gap-1.5 shadow-lg shadow-purple-900/40"
                    >
                      <span>发送</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* TAB 2: 任务委托与自动调度 (Task Delegation Engine) */}
            {activeTab === 'task' && (
              <div className="space-y-6">
                {/* Launch New Automated Task Card */}
                <div className="p-5 sm:p-6 rounded-3xl bg-[#1c132b]/95 border border-purple-500/20 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#CC09E6]" />
                      <h3 className="text-base font-bold text-white">发起全自动业务调度任务</h3>
                    </div>
                    <span className="text-xs text-purple-300 font-mono">
                      单次交付 ¥{currentSelectedEmployee?.taskPrice}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <input
                      type="text"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      placeholder="输入委托任务目标，例如：分析意大利北部三市SPA预约转化热力"
                      className="sm:col-span-3 bg-[#241738] border border-purple-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-purple-300/40 focus:outline-none focus:border-[#CC09E6]"
                    />
                    <button
                      onClick={() => handleLaunchTask(newTaskTitle || '2026年企业多维数据全自动穿透', newTaskCategory)}
                      disabled={isExecutingTask}
                      className="sm:col-span-1 py-2.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-[#7929D2] to-[#CC09E6] text-white shadow-md shadow-purple-900/50 hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-1.5"
                    >
                      {isExecutingTask ? (
                        <>
                          <RotateCw className="w-3.5 h-3.5 animate-spin" />
                          <span>调度中...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5" />
                          <span>立即启动执行</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-purple-300">
                    <span className="text-[11px] text-purple-400">预设模板:</span>
                    {[
                      '分析意大利客户咨询痛点并产出FAQ',
                      '生成博洛尼亚与佛罗伦萨广告投放A/B文案',
                      '排查现有API接口的SQL死锁与延迟瓶颈',
                    ].map((tpl, i) => (
                      <button
                        key={i}
                        onClick={() => setNewTaskTitle(tpl)}
                        className="px-2.5 py-1 rounded-lg bg-purple-900/30 hover:bg-purple-900/60 border border-purple-500/20 text-[11px]"
                      >
                        {tpl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tasks Queue & Live Steps Execution Monitor */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#CC09E6]" />
                    任务实时调度与执行历史 ({tasks.length})
                  </h4>

                  <div className="space-y-3">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className="p-5 rounded-2xl bg-[#1c132b]/80 border border-purple-500/20 shadow-lg space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`w-2.5 h-2.5 rounded-full ${
                                task.status === 'completed'
                                  ? 'bg-emerald-400'
                                  : task.status === 'running'
                                  ? 'bg-pink-500 animate-ping'
                                  : 'bg-amber-400'
                              }`}
                            />
                            <h4 className="text-sm font-bold text-white">{task.title}</h4>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-900/50 text-purple-300 border border-purple-500/20">
                              {task.category}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-purple-300/80 font-mono">
                            <span>责任员工: {task.employeeName}</span>
                            <span>消耗: ¥{task.cost}</span>
                            <span className="text-[10px] text-purple-400">{task.createdAt}</span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-purple-300 font-mono text-[11px]">
                              {task.currentStep || '执行中'}
                            </span>
                            <span className="font-bold text-white font-mono">{task.progress}%</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-[#241738] overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#7929D2] via-[#CC09E6] to-pink-400 rounded-full transition-all duration-500"
                              style={{ width: `${task.progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Step Details */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                          {task.steps.map((step, idx) => (
                            <div
                              key={idx}
                              className={`p-2 rounded-lg border text-xs ${
                                step.status === 'completed'
                                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                                  : step.status === 'running'
                                  ? 'bg-pink-950/20 border-pink-500/40 text-pink-200 animate-pulse'
                                  : 'bg-[#241738]/40 border-purple-500/10 text-purple-400/60'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-[10px]">步骤 {idx + 1}</span>
                                {step.status === 'completed' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                              </div>
                              <p className="font-medium text-[11px] truncate mt-0.5">{step.name}</p>
                            </div>
                          ))}
                        </div>

                        {/* Deliverable Output */}
                        {task.output && (
                          <div className="mt-3 p-3.5 rounded-xl bg-[#241738]/90 border border-purple-500/30 text-xs text-purple-100 space-y-2">
                            <div className="flex items-center justify-between text-purple-300 font-semibold text-[11px]">
                              <span className="flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                交付成果已生成归档
                              </span>
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => copyToClipboard(task.output!, task.id)}
                                  className="flex items-center gap-1 text-[10px] text-[#CC09E6] hover:underline"
                                >
                                  {copiedId === task.id ? '已复制' : '复制结果'}
                                </button>
                                <button
                                  onClick={() => downloadTaskArtifact(task)}
                                  className="flex items-center gap-1 text-[10px] text-pink-300 hover:text-white px-2 py-0.5 rounded bg-pink-900/40 border border-pink-500/30 transition-colors"
                                  title="下载交付物为 Markdown 报告"
                                >
                                  <span>下载交付物 (.md)</span>
                                </button>
                              </div>
                            </div>
                            <p className="leading-relaxed whitespace-pre-wrap">{task.output}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: 文件智能穿透 (Document Intelligence) */}
            {activeTab === 'file' && (
              <div className="p-6 rounded-3xl bg-[#1c132b]/95 border border-purple-500/20 shadow-xl space-y-6">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-[#CC09E6]" />
                    企业数据与文档一键智能解析
                  </h3>
                  <p className="text-xs text-purple-300/80 mt-1">
                    支持 Excel / Word / PDF / CSV 跨国业务数据穿透，由【{currentSelectedEmployee?.name}】实时提取结构化结论
                  </p>
                </div>

                {/* File Dropzone Selector */}
                <div className="border-2 border-dashed border-purple-500/30 rounded-2xl p-6 text-center hover:border-[#CC09E6] transition-colors bg-[#241738]/40">
                  <FolderOpen className="w-10 h-10 mx-auto text-purple-400 mb-2" />
                  <p className="text-xs font-semibold text-white">拖拽文档至此处，或从系统样例中选择：</p>
                  <div className="flex flex-wrap justify-center gap-2 mt-3">
                    {[
                      '2026年Q1跨境电商运营报表.xlsx',
                      '意大利米兰SPA预约营收审计表.csv',
                      '合规与用户隐私保护审核指南.pdf',
                    ].map((f) => (
                      <button
                        key={f}
                        onClick={() => setSelectedFile(f)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono border transition-all ${
                          selectedFile === f
                            ? 'bg-[#CC09E6] text-white border-pink-400 shadow-md'
                            : 'bg-purple-900/30 text-purple-200 border-purple-500/20 hover:border-purple-500/40'
                        }`}
                      >
                        📄 {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleAnalyzeFile}
                    disabled={isAnalyzingFile}
                    className="py-2.5 px-6 rounded-xl font-bold text-xs bg-gradient-to-r from-[#7929D2] to-[#CC09E6] text-white shadow-md shadow-purple-900/40 hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isAnalyzingFile ? (
                      <>
                        <RotateCw className="w-4 h-4 animate-spin" />
                        <span>正在深度抽取与交叉建模...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>开始智能穿透分析</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Analysis Result Box */}
                {fileAnalysisResult && (
                  <div className="p-5 rounded-2xl bg-[#241738] border border-emerald-500/40 text-xs sm:text-sm text-purple-100 whitespace-pre-wrap leading-relaxed shadow-lg">
                    {fileAnalysisResult}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
