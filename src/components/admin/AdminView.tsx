import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SystemTopology3D } from '../3d/SystemTopology3D';
import {
  Shield,
  LayoutDashboard,
  ShoppingBag,
  Cpu,
  Users,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Activity,
  Layers,
  Settings,
  Lock,
  Search,
  Bell,
  ChevronRight,
  RefreshCw,
  Sliders,
  Play,
  Pause,
  LogIn,
  AlertOctagon,
  ArrowRight,
  Wrench
} from 'lucide-react';
import { RUDAAI_FIRST_PARTY_TOOLS, MODEL_SUPPLY_CHAIN_PROVIDERS } from '../../data/mockData';

export const AdminView: React.FC = () => {
  const {
    systemMetrics,
    employees,
    tasks,
    developerProducts,
    user,
    isAdmin,
    loginWithGoogle,
    logout,
    setActivePortal,
    authorizedAdminEmails
  } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'infrastructure' | 'products' | 'tasks' | 'finance' | 'security'>('overview');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  // ACCESS GATE 1: User is not logged in
  if (!user) {
    return (
      <div className="w-full min-h-[calc(100vh-80px)] bg-[#120b1a] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#1c1228] border border-purple-500/30 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl shadow-purple-950/90 text-white">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-[#7929D2] via-[#CC09E6] to-pink-500 p-[2px]">
            <div className="w-full h-full rounded-[14px] bg-[#17111F] flex items-center justify-center">
              <Lock className="w-7 h-7 text-[#CC09E6]" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-black text-white">RUDAAI AI 控制中心 · 管理员验证</h2>
            <p className="text-xs text-purple-300/80 mt-2 leading-relaxed">
              平台控制台包含全量业务数据、模型调度与财务分润敏感接口。请先验证您的管理员身份。
            </p>
          </div>
          <button
            onClick={loginWithGoogle}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-[#7929D2] via-[#CC09E6] to-pink-500 text-white shadow-xl flex items-center justify-center gap-2 hover:opacity-95"
          >
            <LogIn className="w-4 h-4" />
            <span>使用 Google 管理员账号登录</span>
          </button>
          <div className="text-left text-[11px] font-mono text-purple-300/60 bg-[#17111F] p-3 rounded-xl border border-purple-500/15">
            <span className="text-emerald-400 font-semibold block mb-0.5">授权提示：</span>
            已配置授权管理员名单（包含 mediopay123@gmail.com 等）。登录后系统将自动校验证书与角色声明。
          </div>
          <button
            onClick={() => setActivePortal('marketplace')}
            className="text-xs text-purple-400 hover:text-purple-300"
          >
            ← 返回 AI 员工超市
          </button>
        </div>
      </div>
    );
  }

  // ACCESS GATE 2: User is logged in, but their email is NOT in authorizedAdminEmails
  if (!isAdmin) {
    return (
      <div className="w-full min-h-[calc(100vh-80px)] bg-[#120b1a] flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-[#1c1228] border border-red-500/30 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl shadow-red-950/50 text-white">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-red-950/60 border border-red-500/40 flex items-center justify-center text-red-400">
            <AlertOctagon className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
              403 FORBIDDEN · ACCESS RESTRICTED
            </span>
            <h2 className="text-xl font-black text-white mt-2">权限不足：非管理员账号</h2>
            <p className="text-xs text-red-200/80 mt-2 leading-relaxed">
              当前登录账号为 <strong className="text-white font-mono">{user.email}</strong>。该账号未被收录在 RUDAAI 平台超级管理员名单中，无法查看运营大屏或执行调度干预。
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#17111F] border border-red-500/20 text-left text-xs font-mono space-y-1 text-purple-300/80">
            <p className="text-purple-200 font-semibold">系统授权白名单包含：</p>
            {authorizedAdminEmails.map((email) => (
              <p key={email} className="text-[11px] text-purple-400">
                • {email}
              </p>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={loginWithGoogle}
              className="flex-1 py-3 px-4 rounded-xl text-xs font-bold bg-[#CC09E6] text-white hover:opacity-90 flex items-center justify-center gap-1.5"
            >
              <span>切换管理员账号登录</span>
            </button>
            <button
              onClick={() => setActivePortal('marketplace')}
              className="flex-1 py-3 px-4 rounded-xl text-xs font-bold bg-purple-900/30 hover:bg-purple-900/50 text-purple-200 border border-purple-500/30 flex items-center justify-center gap-1.5"
            >
              <span>返回 AI 超市</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ACCESS GRANTED: User is authorized admin!
  const navItems: Array<{ id: 'overview' | 'infrastructure' | 'products' | 'tasks' | 'finance' | 'security'; label: string; icon: any; count?: number }> = [
    { id: 'overview', label: '总览', icon: LayoutDashboard },
    { id: 'infrastructure', label: '模型供应链与自营工具', icon: Cpu, count: 12 },
    { id: 'products', label: '商品管理', icon: ShoppingBag, count: employees.length },
    { id: 'tasks', label: '任务中心', icon: Activity, count: tasks.length },
    { id: 'finance', label: '财务管理', icon: DollarSign },
    { id: 'security', label: '安全中心', icon: Lock },
  ];

  return (
    <div className="w-full text-white min-h-[calc(100vh-80px)] bg-[#120b1a] pb-24">
      {/* Top Admin Header */}
      <div className="border-b border-purple-900/40 bg-[#17111F]/90 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#7929D2] to-[#CC09E6] p-[2px]">
              <div className="w-full h-full rounded-[10px] bg-[#17111F] flex items-center justify-center">
                <Shield className="w-4 h-4 text-purple-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-white">RUDAAI 管理后台</h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  COMMAND CENTER · ONLINE
                </span>
              </div>
              <p className="text-[11px] text-purple-300/70">AI Command Center · 平台运营控制台</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-emerald-300 bg-emerald-950/30 px-3 py-1.5 rounded-xl border border-emerald-500/30 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>特权授权: {user.email}</span>
            </div>
            <div className="relative hidden md:block">
              <Search className="w-3.5 h-3.5 text-purple-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="全局检索模型、节点、任务..."
                className="bg-[#241738] border border-purple-500/20 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-purple-300/40 focus:outline-none focus:border-[#CC09E6] w-48 sm:w-64"
              />
            </div>
            <button
              onClick={logout}
              className="text-xs text-red-300 hover:text-white px-2.5 py-1.5 rounded-lg bg-red-950/30 hover:bg-red-900/50 border border-red-500/20"
            >
              退出
            </button>
          </div>
        </div>
      </div>

      {/* Main Admin Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Navigation Menu */}
          <div className="lg:col-span-3 space-y-2 bg-[#17111F] p-3 rounded-2xl border border-purple-500/20">
            <p className="text-[11px] font-bold text-purple-400/60 uppercase tracking-wider px-3 py-1">平台控制</p>
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

            <div className="pt-3 border-t border-purple-900/30 px-3 text-[11px] text-purple-400/60 space-y-1">
              <p>系统核心: RUDAAI Kernel v4.2</p>
              <p>运行节点: 128 集群</p>
            </div>
          </div>

          {/* Right Main Admin Content */}
          <div className="lg:col-span-9 space-y-6">
            {activeTab === 'overview' && (
              <>
                {/* 3D Core Network & KPI Cards Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  {/* Left: 3D Topology Visualization */}
                  <div className="lg:col-span-7 rounded-3xl bg-[#17111F] border border-purple-500/20 p-5 flex flex-col justify-between relative overflow-hidden shadow-xl">
                    <div className="flex items-center justify-between z-10">
                      <div>
                        <h3 className="text-sm font-bold text-white">RUDAAI 3D 核心控制拓扑</h3>
                        <p className="text-[11px] text-purple-300/70">多集群模型与并发工作流实时映射</p>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        AI 模型: 运行正常
                      </span>
                    </div>

                    <div className="my-2 h-52">
                      <SystemTopology3D className="w-full h-full" />
                    </div>

                    {/* Nodes Status Strip */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-purple-900/30 text-center text-xs">
                      <div className="p-1.5 rounded-lg bg-purple-900/20 border border-purple-500/10">
                        <span className="text-[10px] text-purple-300/60 block">活跃用户</span>
                        <span className="font-bold text-white text-xs">{systemMetrics.activeUsers.toLocaleString()}</span>
                        <span className="text-[9px] text-emerald-400 block font-mono">↑ 12%</span>
                      </div>
                      <div className="p-1.5 rounded-lg bg-purple-900/20 border border-purple-500/10">
                        <span className="text-[10px] text-purple-300/60 block">总订单量</span>
                        <span className="font-bold text-white text-xs">{systemMetrics.totalOrders.toLocaleString()}</span>
                        <span className="text-[9px] text-emerald-400 block font-mono">↑ 18%</span>
                      </div>
                      <div className="p-1.5 rounded-lg bg-purple-900/20 border border-purple-500/10">
                        <span className="text-[10px] text-purple-300/60 block">AI 员工数</span>
                        <span className="font-bold text-white text-xs">{systemMetrics.activeEmployees.toLocaleString()}</span>
                        <span className="text-[9px] text-emerald-400 block font-mono">↑ 15%</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Revenue Trend Graph */}
                  <div className="lg:col-span-5 rounded-3xl bg-[#17111F] border border-purple-500/20 p-5 flex flex-col justify-between shadow-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-purple-300">平台收入趋势</h4>
                        <p className="text-xl font-black text-white mt-1">¥{systemMetrics.platformRevenue.toLocaleString()}</p>
                      </div>
                      <div className="flex gap-1 bg-[#241738] p-1 rounded-lg text-[10px] font-mono">
                        {(['7d', '30d', '90d'] as const).map((r) => (
                          <button
                            key={r}
                            onClick={() => setTimeRange(r)}
                            className={`px-2 py-0.5 rounded ${timeRange === r ? 'bg-[#CC09E6] text-white' : 'text-purple-300 hover:text-white'}`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* SVG Styled Curve */}
                    <div className="my-4 h-36 flex items-end">
                      <svg className="w-full h-full" viewBox="0 0 300 120" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#CC09E6" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#7929D2" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M0,100 Q40,90 75,70 T150,55 T225,25 T300,10 L300,120 L0,120 Z"
                          fill="url(#gradRevenue)"
                        />
                        <path
                          d="M0,100 Q40,90 75,70 T150,55 T225,25 T300,10"
                          fill="none"
                          stroke="#CC09E6"
                          strokeWidth="3"
                        />
                      </svg>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-purple-300/70 border-t border-purple-900/30 pt-2 font-mono">
                      <span>4/21</span>
                      <span>4/23</span>
                      <span>4/25</span>
                      <span>4/27 (今日)</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Status Metric Indicators */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-[#17111F] border border-purple-500/20 flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-purple-900/30 text-[#CC09E6]">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] text-purple-300/60 font-mono">待处理订单</p>
                      <p className="text-xl font-bold text-white mt-0.5">{systemMetrics.pendingOrders}</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#17111F] border border-purple-500/20 flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-cyan-950/40 text-cyan-400">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] text-purple-300/60 font-mono">运行中任务集群</p>
                      <p className="text-xl font-bold text-white mt-0.5">{systemMetrics.runningTasks}</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#17111F] border border-purple-500/20 flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-emerald-950/40 text-emerald-400">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] text-purple-300/60 font-mono">核心安全态势</p>
                      <p className="text-xl font-bold text-emerald-400 mt-0.5">正常 (0 威胁)</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Model Supply Chain & First-Party Tools Infrastructure Tab */}
            {activeTab === 'infrastructure' && (
              <div className="space-y-6">
                {/* 1. Model Supply Chain Grid */}
                <div className="p-6 rounded-3xl bg-[#17111F] border border-purple-500/20 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Cpu className="w-5 h-5 text-[#CC09E6]" />
                        <span>AI 模型技术供应链配置中心 (Model Supply Chain)</span>
                      </h3>
                      <p className="text-xs text-purple-300/70 mt-0.5">
                        RUDAAI 统筹技术调度：前台商品与用户完全解耦，后端按成本与任务复杂度自动分流。
                      </p>
                    </div>
                    <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      网关状态: 极速运转 (340ms)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {MODEL_SUPPLY_CHAIN_PROVIDERS.map((prov) => (
                      <div
                        key={prov.id}
                        className="p-4 rounded-2xl bg-[#241738]/80 border border-purple-500/20 space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-xs font-bold text-white">{prov.name}</span>
                            <span className="text-[10px] text-purple-300 block font-mono mt-0.5">
                              Model ID: {prov.modelId}
                            </span>
                          </div>
                          <span
                            className={`text-[9px] font-mono px-2 py-0.5 rounded-full ${
                              prov.status === 'active'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            {prov.status.toUpperCase()}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-[10px] font-mono bg-[#17111F]/60 p-2 rounded-xl text-purple-200">
                          <div>
                            <span className="text-purple-400/60 block">单价/1K Token</span>
                            <span className="font-bold text-white">€{prov.unitCostPer1kTokens}</span>
                          </div>
                          <div>
                            <span className="text-purple-400/60 block">并发上限</span>
                            <span className="font-bold text-white">{prov.maxConcurrency} QPS</span>
                          </div>
                          <div>
                            <span className="text-purple-400/60 block">基准延时</span>
                            <span className="font-bold text-emerald-400">{prov.latencyMs}ms</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-purple-300/80 pt-1">
                          <span>{prov.isSelfHosted ? '🏛️ RUDAAI 私有化机房' : '☁️ 托管商业 API'}</span>
                          <span className="text-xs text-[#CC09E6] hover:underline cursor-pointer">
                            配置参数 &gt;
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. First-Party Owned Tools Commercial Overview */}
                <div className="p-6 rounded-3xl bg-[#17111F] border border-purple-500/20 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Wrench className="w-5 h-5 text-pink-400" />
                        <span>RUDAAI 12 款自营工具业务监控与成本分析</span>
                      </h3>
                      <p className="text-xs text-purple-300/70 mt-0.5">
                        按真实单次调用成本 (€0.10–€0.60) 实时扣算，保障各产品线综合贡献毛利 &gt; 80%。
                      </p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-purple-900/40 text-purple-300 font-mono">
                          <th className="py-2.5">工具名称</th>
                          <th>API 路由</th>
                          <th>单次售价</th>
                          <th>预估模型成本</th>
                          <th>单次净毛利</th>
                          <th>毛利率</th>
                          <th>当前状态</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-purple-900/20 text-purple-200">
                        {RUDAAI_FIRST_PARTY_TOOLS.map((t) => {
                          const margin = ((t.unitProfit / t.taskPrice) * 100).toFixed(1);
                          return (
                            <tr key={t.id} className="hover:bg-purple-900/10 transition-colors">
                              <td className="py-2.5 font-bold text-white flex items-center gap-2">
                                <span>{t.icon}</span>
                                <span>{t.name}</span>
                              </td>
                              <td className="font-mono text-purple-300 text-[11px]">{t.apiEndpoint}</td>
                              <td className="font-bold text-white">€{t.taskPrice}</td>
                              <td className="font-mono text-red-300">€{t.unitCost}</td>
                              <td className="font-mono text-emerald-300 font-bold">€{t.unitProfit}</td>
                              <td>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                  {margin}%
                                </span>
                              </td>
                              <td>
                                <span className="text-[10px] font-mono text-emerald-400">● 生产就绪</span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div className="p-6 rounded-3xl bg-[#17111F] border border-purple-500/20 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">上架 AI 员工与服务清单 ({employees.length})</h3>
                  <span className="text-xs text-purple-400 font-mono">支持即时审核与定价调整</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-purple-900/40 text-purple-300 font-mono">
                        <th className="py-2.5">员工名称</th>
                        <th>行业分类</th>
                        <th>月订阅费</th>
                        <th>单次任务费</th>
                        <th>评分</th>
                        <th>累计交付任务</th>
                        <th>状态</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-900/20">
                      {employees.map((emp) => (
                        <tr key={emp.id} className="hover:bg-purple-900/10">
                          <td className="py-3 font-semibold text-white flex items-center gap-2">
                            <img src={emp.avatar} alt="" className="w-7 h-7 rounded-lg object-cover" />
                            <span>{emp.name}</span>
                          </td>
                          <td className="text-purple-300">{emp.industryName}</td>
                          <td className="font-mono text-white">¥{emp.monthlyPrice}</td>
                          <td className="font-mono text-purple-300">¥{emp.taskPrice}</td>
                          <td className="text-amber-300 font-semibold">{emp.rating} ★</td>
                          <td className="font-mono text-purple-200">{emp.tasksCompleted}</td>
                          <td>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono">
                              在架销售
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Task Center Tab */}
            {activeTab === 'tasks' && (
              <div className="p-6 rounded-3xl bg-[#17111F] border border-purple-500/20 space-y-4">
                <h3 className="text-sm font-bold text-white">全平台执行中与已完成任务实时审计 ({tasks.length})</h3>
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div key={task.id} className="p-4 rounded-xl bg-[#241738]/50 border border-purple-500/20 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{task.title}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-900/60 text-purple-300">
                            {task.status === 'completed' ? '已完成' : '执行中'}
                          </span>
                        </div>
                        <p className="text-[11px] text-purple-300/70 mt-0.5">指派员工: {task.employeeName} · 进度: {task.progress}%</p>
                      </div>
                      <span className="font-mono text-xs text-white">¥{task.cost}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Finance Tab */}
            {activeTab === 'finance' && (
              <div className="p-6 rounded-3xl bg-[#17111F] border border-purple-500/20 space-y-4">
                <h3 className="text-sm font-bold text-white">财务损益与开发者分佣明细</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-purple-900/20 border border-purple-500/20">
                    <span className="text-[10px] text-purple-300/60 block">总订阅收入</span>
                    <span className="text-base font-bold text-white">¥1,920,400</span>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-900/20 border border-purple-500/20">
                    <span className="text-[10px] text-purple-300/60 block">单任务佣金</span>
                    <span className="text-base font-bold text-white">¥940,160</span>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-900/20 border border-purple-500/20">
                    <span className="text-[10px] text-purple-300/60 block">开发者结算款</span>
                    <span className="text-base font-bold text-emerald-400">¥1,850,200</span>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-900/20 border border-purple-500/20">
                    <span className="text-[10px] text-purple-300/60 block">模型推理成本</span>
                    <span className="text-base font-bold text-pink-400">¥245,000</span>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="p-6 rounded-3xl bg-[#17111F] border border-purple-500/20 space-y-4">
                <h3 className="text-sm font-bold text-white">系统审计与访问安全日志</h3>
                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-[#241738]/40 border border-emerald-500/20 text-emerald-300 flex justify-between">
                    <span>[2026-11-07 22:04:12] WebGL 探针探测通过 - 60 FPS 渲染无异常</span>
                    <span>10.0.1.2</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#241738]/40 border border-purple-500/20 text-purple-200 flex justify-between">
                    <span>[2026-11-07 21:55:08] 开发者产品上架审核通过：雅典娜·智能助理</span>
                    <span>Admin-01</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#241738]/40 border border-purple-500/20 text-purple-200 flex justify-between">
                    <span>[2026-11-07 21:40:30] 任务调度集群自动弹性伸缩至 128 节点</span>
                    <span>KubeAutoscale</span>
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
