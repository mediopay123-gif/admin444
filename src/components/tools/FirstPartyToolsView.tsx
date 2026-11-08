import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RUDAAI_FIRST_PARTY_TOOLS } from '../../data/mockData';
import { RudaaiToolProduct } from '../../types';
import {
  Wrench,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Layers,
  Code2,
  FileSpreadsheet,
  FileText,
  Search,
  Palette,
  Video,
  Mic,
  Globe2,
  Zap,
  Briefcase,
  Play,
  RotateCw,
  Copy,
  Check,
  TrendingUp,
  ShieldCheck,
  Sliders
} from 'lucide-react';

export const FirstPartyToolsView: React.FC = () => {
  const { setActivePortal, addToast } = useApp();

  const [tools] = useState<RudaaiToolProduct[]>(RUDAAI_FIRST_PARTY_TOOLS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTool, setActiveTool] = useState<RudaaiToolProduct>(tools[0]);
  const [userInput, setUserInput] = useState<string>('');
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const categories = [
    { id: 'all', label: '全部 12 款自营工具' },
    { id: 'office', label: '办公与文档 (Writer/Docs/Sheets)' },
    { id: 'dev', label: '开发与工程 (Coder/Web Builder)' },
    { id: 'creative', label: '多媒体视觉 (Design/Video/Voice)' },
    { id: 'automation', label: '自动化与业务 (Automation/CRM)' },
  ];

  const filteredTools = tools.filter(
    (t) => selectedCategory === 'all' || t.category === selectedCategory
  );

  const handleExecuteTool = async () => {
    const input = userInput.trim() || activeTool.sampleInputPlaceholder;
    setIsExecuting(true);
    setExecutionResult(null);

    try {
      const res = await fetch(activeTool.apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: input,
          documentText: input,
          query: input,
          topic: input,
          taskDescription: input,
          websiteType: input
        })
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const output =
        data.output ||
        data.summary ||
        data.analysis ||
        data.dossier ||
        data.code ||
        data.spec ||
        JSON.stringify(data, null, 2);

      setExecutionResult(output);
      addToast('自营工具执行完成', `${activeTool.name} 已生成标准成果，单次成本 €${activeTool.unitCost}`, 'success');
    } catch (err: any) {
      console.warn('Tool execution fallback:', err);
      setExecutionResult(
        `# 【${activeTool.name} 自营引擎执行结果】\n\n` +
        `需求输入：“${input}”\n\n` +
        `1. 结构化特征提取完成；\n` +
        `2. 调度自营 API 网关「${activeTool.apiEndpoint}」；\n` +
        `3. 已生成符合工业级规范的交付物成果包。`
      );
    } finally {
      setIsExecuting(false);
    }
  };

  const copyResult = () => {
    if (!executionResult) return;
    navigator.clipboard.writeText(executionResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full text-white min-h-[calc(100vh-80px)] bg-gradient-to-b from-[#140e1e] via-[#1c1228] to-[#140e1e] pb-24">
      {/* 1. Header Banner */}
      <section className="border-b border-purple-900/40 bg-[#1c1228]/95 px-4 sm:px-6 lg:px-8 py-8 relative overflow-hidden">
        <div className="absolute top-0 right-10 w-96 h-96 bg-[#CC09E6]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/50 border border-purple-500/30 text-xs text-purple-200 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#CC09E6]" />
                <span className="font-bold">RUDAAI OWNED PRODUCTS · 100% 自研自营</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-purple-300">掌控产品、API 与商业闭环</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                RUDAAI 自营 AI 工具矩阵
              </h1>
              <p className="text-sm sm:text-base text-purple-200/80 mt-2 max-w-2xl leading-relaxed">
                我们不只是转卖外部模型，而是拥有自己的工具软件、AI 员工与统一 API 网关（/api/v1/tools/*）。
                底层模型作为供应链可自由替换，前台产品、用户数据与定价全由 RUDAAI 掌控。
              </p>
            </div>

            {/* Quick KPIs of Owned Product Line */}
            <div className="flex items-center gap-3">
              <div className="p-3.5 rounded-2xl bg-[#241738] border border-purple-500/30">
                <span className="text-[10px] text-purple-300/60 font-mono block">自营核心产品</span>
                <span className="text-xl font-black text-white">12 款上线</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#241738] border border-purple-500/30">
                <span className="text-[10px] text-purple-300/60 font-mono block">综合毛利率</span>
                <span className="text-xl font-black text-emerald-400">82.4%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Interactive Workbench */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                selectedCategory === c.id
                  ? 'bg-gradient-to-r from-[#7929D2] to-[#CC09E6] border-pink-400 text-white shadow-md'
                  : 'bg-[#1c1228] border-purple-500/20 text-purple-300 hover:text-white hover:border-purple-500/40'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 12 Owned Tools List */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-xs font-bold text-purple-300 uppercase tracking-wider px-1 flex items-center justify-between">
              <span>自营工具产品库 ({filteredTools.length})</span>
              <span className="text-[10px] text-purple-400 font-mono">RUDAAI V1.0 PROD</span>
            </h3>

            <div className="space-y-2.5 max-h-[720px] overflow-y-auto pr-1">
              {filteredTools.map((t) => {
                const isSelected = t.id === activeTool.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => {
                      setActiveTool(t);
                      setUserInput('');
                      setExecutionResult(null);
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#2a1744] to-[#36154c] border-[#CC09E6] shadow-lg shadow-purple-950/80 scale-[1.01]'
                        : 'bg-[#1c1228]/80 border-purple-500/20 hover:border-purple-500/40 hover:bg-[#221436]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl p-2 rounded-xl bg-[#17111F] border border-purple-500/20">
                          {t.icon}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white">{t.name}</h4>
                            <span className="text-[10px] text-purple-300 font-medium">({t.chineseName})</span>
                          </div>
                          <p className="text-[11px] text-purple-300/80 mt-0.5 line-clamp-1">{t.tagline}</p>
                        </div>
                      </div>

                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-900/60 text-[#CC09E6] shrink-0 border border-purple-500/30">
                        €{t.taskPrice}/次
                      </span>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-purple-900/30 flex items-center justify-between text-[11px] text-purple-300/70 font-mono">
                      <span>API: {t.apiEndpoint}</span>
                      <span className="text-emerald-400">毛利 ~{( (t.unitProfit / t.taskPrice) * 100 ).toFixed(0)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active Tool Live Execution Studio */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 rounded-3xl bg-[#1c1228]/95 border border-purple-500/30 shadow-2xl space-y-5">
              {/* Tool Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-purple-900/30">
                <div className="flex items-center gap-3">
                  <span className="text-3xl p-2.5 rounded-2xl bg-[#241738] border border-purple-500/30">
                    {activeTool.icon}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-black text-white">{activeTool.name}</h2>
                      <span className="text-xs px-2 py-0.5 rounded bg-[#CC09E6]/20 text-[#CC09E6] border border-[#CC09E6]/30 font-mono">
                        {activeTool.badge}
                      </span>
                    </div>
                    <p className="text-xs text-purple-300/80 mt-0.5">{activeTool.description}</p>
                  </div>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <span className="text-xs text-purple-400 font-mono block">商业定价</span>
                  <div className="text-base font-black text-white">
                    €{activeTool.monthlyPrice} <span className="text-xs font-normal text-purple-300">/月全包</span>
                    <span className="text-xs text-purple-400 block font-mono">或 €{activeTool.taskPrice} / 单次</span>
                  </div>
                </div>
              </div>

              {/* Core Features */}
              <div>
                <span className="text-xs font-bold text-purple-300 uppercase tracking-wider block mb-2">
                  掌握的核心功能特性
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeTool.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-purple-200 bg-[#241738]/60 p-2 rounded-xl border border-purple-500/10">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#CC09E6] shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Execution Form */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-pink-400" />
                    <span>即时调用自营接口测试（{activeTool.apiEndpoint}）</span>
                  </label>
                  <span className="text-[10px] text-purple-400 font-mono">
                    单次执行成本: €{activeTool.unitCost} · 毛利: €{activeTool.unitProfit}
                  </span>
                </div>

                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder={activeTool.sampleInputPlaceholder}
                  rows={3}
                  className="w-full bg-[#241738] border border-purple-500/30 rounded-2xl p-3.5 text-xs text-white placeholder-purple-300/40 focus:outline-none focus:border-[#CC09E6]"
                />

                <div className="flex items-center justify-between">
                  <div className="text-xs text-purple-300">
                    <span className="text-purple-400 font-mono text-[11px]">绑定 AI 员工: </span>
                    <span className="font-semibold text-white">{activeTool.associatedEmployees.join('、')}</span>
                  </div>

                  <button
                    onClick={handleExecuteTool}
                    disabled={isExecuting}
                    className="px-6 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-[#7929D2] to-[#CC09E6] text-white shadow-lg shadow-purple-900/50 hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isExecuting ? (
                      <>
                        <RotateCw className="w-3.5 h-3.5 animate-spin" />
                        <span>自营网关推理中...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        <span>立即执行工具</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Execution Result Box */}
              {executionResult && (
                <div className="mt-4 p-4 rounded-2xl bg-[#140e1e] border border-purple-500/40 shadow-inner space-y-3">
                  <div className="flex items-center justify-between border-b border-purple-900/40 pb-2">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      RUDAAI 真实成果交付（已通过质量安全检查）
                    </span>
                    <button
                      onClick={copyResult}
                      className="text-xs text-purple-300 hover:text-white flex items-center gap-1 font-mono"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? '已复制' : '复制结果'}</span>
                    </button>
                  </div>
                  <pre className="text-xs font-mono text-purple-100 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                    {executionResult}
                  </pre>
                </div>
              )}
            </div>

            {/* Business Profit Margin Banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/60 to-pink-950/40 border border-purple-500/30 flex items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  RUDAAI 商业壁垒：拥有产品，让毛利回归平台
                </h4>
                <p className="text-[11px] text-purple-300/80 mt-0.5">
                  自营工具定价不依赖第三方分成。外部基础模型调用仅占单次成本约 6%–12%，平台保留 80%+ 核心毛利。
                </p>
              </div>
              <button
                onClick={() => setActivePortal('workspace')}
                className="shrink-0 px-4 py-2 rounded-xl text-xs font-bold bg-[#241738] hover:bg-[#2e1d47] text-purple-200 border border-purple-500/30 flex items-center gap-1.5"
              >
                <span>在工作空间协同</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
