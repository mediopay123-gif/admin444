import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Code2,
  PlusCircle,
  TrendingUp,
  DollarSign,
  Key,
  Layers,
  BookOpen,
  LifeBuoy,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  Copy,
  Check,
  Cpu,
  Star
} from 'lucide-react';

export const DeveloperView: React.FC = () => {
  const {
    industries,
    developerProducts,
    addDeveloperProduct,
    setActivePortal,
    user,
    setIsLoginModalOpen
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'create' | 'api' | 'revenue'>('overview');
  const [apiKeyRevealed, setApiKeyRevealed] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  // New Employee Form State
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formIndustryId, setFormIndustryId] = useState(industries[0]?.id || 'it');
  const [formModel, setFormModel] = useState('Gemini 2.5 Flash');
  const [formMonthlyPrice, setFormMonthlyPrice] = useState('399');
  const [formTaskPrice, setFormTaskPrice] = useState('12.9');
  const [formCapabilities, setFormCapabilities] = useState('行业数据分析, 自动化报表, 跨境公文撰写');

  const handleSubmitNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const caps = formCapabilities.split(/[,，]/).map((s) => s.trim()).filter(Boolean);

    addDeveloperProduct({
      name: formName,
      role: formRole || '领域专属技术主管',
      industryId: formIndustryId,
      model: formModel,
      pricingMonthly: parseFloat(formMonthlyPrice) || 299,
      pricingTask: parseFloat(formTaskPrice) || 9.9,
      capabilities: caps.length > 0 ? caps : ['定制智能执行', '自动化流程']
    });

    // Reset form & switch to products tab
    setFormName('');
    setFormRole('');
    setActiveTab('products');
  };

  const fakeApiKey = 'rud_live_948f2c39e801b7a661d90234';

  const copyApiKey = () => {
    navigator.clipboard.writeText(fakeApiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const navItems: Array<{ id: 'overview' | 'products' | 'create' | 'api' | 'revenue'; label: string; icon: any; count?: number }> = [
    { id: 'overview', label: '开发者中心', icon: Code2 },
    { id: 'products', label: '我的产品', icon: Layers, count: developerProducts.length },
    { id: 'create', label: '创建 AI 员工', icon: PlusCircle },
    { id: 'api', label: 'API 配置', icon: Key },
    { id: 'revenue', label: '收益管理', icon: DollarSign },
  ];

  return (
    <div className="w-full text-white min-h-[calc(100vh-80px)] bg-[#140e1e] pb-24">
      {/* Top Header */}
      <div className="border-b border-purple-900/40 bg-[#1c1228]/95 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#7929D2] to-[#CC09E6] p-[2px]">
              <div className="w-full h-full rounded-[10px] bg-[#17111F] flex items-center justify-center">
                <Code2 className="w-4 h-4 text-purple-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-white">RUDAAI 开发者平台</h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-[#CC09E6] border border-purple-500/30">
                  DEVELOPER ECOSYSTEM
                </span>
              </div>
              <p className="text-[11px] text-purple-300/70">加入 RUDAAI，共建全球 AI 员工与自动化生态</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('create')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#7929D2] to-[#CC09E6] text-white shadow-md shadow-purple-900/40 hover:opacity-90 transition-opacity"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>新建 AI 员工</span>
            </button>
            {user ? (
              <div className="flex items-center gap-2 text-xs text-purple-200 bg-[#241738] px-3 py-1.5 rounded-xl border border-purple-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="truncate max-w-[140px] font-mono">{user.displayName || user.email?.split('@')[0]}</span>
              </div>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="flex items-center gap-1.5 text-xs text-pink-300 bg-[#241738] hover:bg-[#2e1d47] px-3 py-1.5 rounded-xl border border-pink-500/30 transition-colors"
              >
                <span>登录开发者账号</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Developer Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Menu */}
          <div className="lg:col-span-3 space-y-2 bg-[#1c1228] p-3 rounded-2xl border border-purple-500/20">
            <p className="text-[11px] font-bold text-purple-400/60 uppercase tracking-wider px-3 py-1">工作台目录</p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#7929D2] to-[#CC09E6] text-white shadow-md'
                      : 'text-purple-300/70 hover:text-white hover:bg-purple-900/30'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-black/30' : 'bg-purple-900/60 text-purple-300'}`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="pt-3 border-t border-purple-900/30 space-y-1 px-1">
              <button
                onClick={() => setActivePortal('marketplace')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-purple-300 hover:text-white hover:bg-purple-900/20"
              >
                <span>前往超市查看在架商品</span>
                <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
              </button>
            </div>
          </div>

          {/* Right Main Container */}
          <div className="lg:col-span-9 space-y-6">
            {activeTab === 'overview' && (
              <>
                {/* Developer Welcome Banner */}
                <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#241738] via-[#32104C] to-[#45105c] border border-purple-500/30 overflow-hidden shadow-xl">
                  <div className="max-w-xl relative z-10 space-y-3">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-[#CC09E6] border border-purple-500/30">
                      RUDAAI VENDOR SUITE
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-white">
                      成为 RUDAAI 创作者，上架你的专属 AI 员工
                    </h2>
                    <p className="text-xs sm:text-sm text-purple-200/80 leading-relaxed">
                      依托 RUDAAI 全球 24 行业超市与 7 大通用技能货架，将你的专业领域模型、Prompt 智能体与工具链快速商业化，坐享 80% 平台高额分润。
                    </p>
                    <button
                      onClick={() => setActiveTab('create')}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-[#7929D2] to-[#CC09E6] text-white shadow-lg shadow-purple-950/80 hover:opacity-90"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>立即创建新员工并上架</span>
                    </button>
                  </div>
                </div>

                {/* Developer Overview KPIs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-[#1c1228] border border-purple-500/20 space-y-2">
                    <span className="text-[11px] text-purple-300/60 font-mono block">我的在架产品</span>
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl font-black text-white">{developerProducts.length} 款</span>
                      <span className="text-xs text-purple-300">均已上线</span>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#1c1228] border border-purple-500/20 space-y-2">
                    <span className="text-[11px] text-purple-300/60 font-mono block">总累计收益</span>
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl font-black text-white">¥128,560</span>
                      <span className="text-xs text-emerald-400 font-bold font-mono">↑ 12%</span>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#1c1228] border border-purple-500/20 space-y-2">
                    <span className="text-[11px] text-purple-300/60 font-mono block">本月收益</span>
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl font-black text-pink-300">¥32,260</span>
                      <span className="text-xs text-emerald-400 font-bold font-mono">↑ 18%</span>
                    </div>
                  </div>
                </div>

                {/* Recent Products List */}
                <div className="p-6 rounded-3xl bg-[#1c1228] border border-purple-500/20 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">我的上架商品清单</h3>
                    <button
                      onClick={() => setActiveTab('create')}
                      className="text-xs text-[#CC09E6] hover:underline font-semibold"
                    >
                      + 新增商品
                    </button>
                  </div>

                  <div className="divide-y divide-purple-900/30">
                    {developerProducts.map((p) => (
                      <div key={p.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-white text-sm">{p.name}</h4>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-900/50 text-purple-300">
                              {p.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-purple-300/70 mt-0.5">
                            基础模型: {p.model} · 上线时间: {p.createdAt}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-white font-mono">¥{p.pricingMonthly}/月</p>
                          <span className="text-[10px] text-emerald-400 font-semibold">
                            累计销量: {p.sales}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* TAB: Create AI Employee Form */}
            {activeTab === 'create' && (
              <div className="p-6 sm:p-8 rounded-3xl bg-[#1c1228] border border-purple-500/20 space-y-6">
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#CC09E6]" />
                    创建并上架全新 AI 员工商品
                  </h3>
                  <p className="text-xs text-purple-300/80 mt-1">
                    提交后将即时注入 RUDAAI 24 行业超市与 7 大技能货架，平台用户可直接订购或雇佣
                  </p>
                </div>

                <form onSubmit={handleSubmitNewProduct} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-purple-200 mb-1">
                        AI 员工名称 *
                      </label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="例如：普罗米修斯 · 智造排产总监"
                        className="w-full bg-[#241738] border border-purple-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-purple-300/40 focus:outline-none focus:border-[#CC09E6]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-purple-200 mb-1">
                        职称与工作角色
                      </label>
                      <input
                        type="text"
                        value={formRole}
                        onChange={(e) => setFormRole(e.target.value)}
                        placeholder="例如：高级工业产线调度与设备预测维护主管"
                        className="w-full bg-[#241738] border border-purple-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-purple-300/40 focus:outline-none focus:border-[#CC09E6]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-purple-200 mb-1">
                        所属行业分类
                      </label>
                      <select
                        value={formIndustryId}
                        onChange={(e) => setFormIndustryId(e.target.value)}
                        aria-label="所属行业分类"
                        className="w-full bg-[#241738] border border-purple-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#CC09E6]"
                      >
                        {industries.map((ind) => (
                          <option key={ind.id} value={ind.id}>
                            {ind.name} ({ind.englishName})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-purple-200 mb-1">
                        底层驱动大模型
                      </label>
                      <select
                        value={formModel}
                        onChange={(e) => setFormModel(e.target.value)}
                        aria-label="底层驱动大模型"
                        className="w-full bg-[#241738] border border-purple-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#CC09E6]"
                      >
                        <option value="Gemini 2.5 Flash">Gemini 2.5 Flash (极速响应与多模态)</option>
                        <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet (长文本逻辑推理)</option>
                        <option value="DeepSeek R1">DeepSeek R1 (数学推导与代码审查)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-purple-200 mb-1">
                        月度订阅价格 (¥/月)
                      </label>
                      <input
                        type="number"
                        value={formMonthlyPrice}
                        onChange={(e) => setFormMonthlyPrice(e.target.value)}
                        className="w-full bg-[#241738] border border-purple-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#CC09E6]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-purple-200 mb-1">
                        单次任务价格 (¥/次)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={formTaskPrice}
                        onChange={(e) => setFormTaskPrice(e.target.value)}
                        className="w-full bg-[#241738] border border-purple-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#CC09E6]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-purple-200 mb-1">
                      核心技能标签 (逗号分隔)
                    </label>
                    <input
                      type="text"
                      value={formCapabilities}
                      onChange={(e) => setFormCapabilities(e.target.value)}
                      placeholder="例如：产线排产, PLC代写, 故障预测"
                      className="w-full bg-[#241738] border border-purple-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-purple-300/40 focus:outline-none focus:border-[#CC09E6]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-[#7929D2] via-[#CC09E6] to-pink-500 text-white shadow-lg shadow-purple-900/60 hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>确认提交并即时在超市上架</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB: Products List */}
            {activeTab === 'products' && (
              <div className="p-6 rounded-3xl bg-[#1c1228] border border-purple-500/20 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">我的在架商品 ({developerProducts.length})</h3>
                  <button
                    onClick={() => setActiveTab('create')}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#CC09E6] text-white hover:opacity-90"
                  >
                    + 新建商品
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {developerProducts.map((p) => (
                    <div
                      key={p.id}
                      className="p-4 rounded-2xl bg-[#241738]/60 border border-purple-500/20 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-900/40 text-purple-300">
                            {p.category}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono">
                            在架运行
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-white">{p.name}</h4>
                        <p className="text-xs text-purple-300/70 mt-1">模型: {p.model}</p>
                      </div>

                      <div className="pt-3 mt-3 border-t border-purple-900/30 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-white font-bold font-mono">¥{p.pricingMonthly}/月</span>
                          <span className="text-[10px] text-purple-400 ml-2">单次 ¥{p.pricingTask}</span>
                        </div>
                        <span className="text-emerald-400 font-mono font-semibold">
                          总销量 {p.sales}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: API Configuration */}
            {activeTab === 'api' && (
              <div className="p-6 rounded-3xl bg-[#1c1228] border border-purple-500/20 space-y-5">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Key className="w-4 h-4 text-[#CC09E6]" />
                    开发者 API 凭证与集成配置
                  </h3>
                  <p className="text-xs text-purple-300/80 mt-1">
                    使用此密钥可将外部自建 Agent、自动化脚本或工作流引擎直连 RUDAAI 平台
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#241738] border border-purple-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-purple-300">生产环境密钥 (Production Secret)</span>
                    <button
                      onClick={() => setApiKeyRevealed(!apiKeyRevealed)}
                      className="text-purple-400 hover:text-white p-1"
                    >
                      {apiKeyRevealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type={apiKeyRevealed ? 'text' : 'password'}
                      readOnly
                      value={fakeApiKey}
                      className="w-full bg-[#17111F] border border-purple-500/30 rounded-xl px-3 py-2 text-xs font-mono text-white select-all"
                    />
                    <button
                      onClick={copyApiKey}
                      className="px-3 py-2 rounded-xl bg-purple-900/40 hover:bg-purple-900/70 text-purple-200 border border-purple-500/30 flex items-center gap-1 text-xs shrink-0"
                    >
                      {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey ? '已复制' : '复制'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Revenue */}
            {activeTab === 'revenue' && (
              <div className="p-6 rounded-3xl bg-[#1c1228] border border-purple-500/20 space-y-4">
                <h3 className="text-sm font-bold text-white">收益账单与分润结算 (80% 结算比例)</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-purple-900/20 border border-purple-500/20">
                    <span className="text-[10px] text-purple-300/60 block">待结算金额</span>
                    <span className="text-lg font-bold text-emerald-400">¥12,480</span>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-900/20 border border-purple-500/20">
                    <span className="text-[10px] text-purple-300/60 block">已到账金额</span>
                    <span className="text-lg font-bold text-white">¥116,080</span>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-900/20 border border-purple-500/20">
                    <span className="text-[10px] text-purple-300/60 block">结算银行账户</span>
                    <span className="text-xs font-mono text-purple-300 block mt-1">招商银行 (尾号 6820)</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
