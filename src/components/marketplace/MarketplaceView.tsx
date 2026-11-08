import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RudaaiHeroScene } from '../3d/RudaaiHeroScene';
import { SkillsShelfSection } from './SkillsShelfSection';
import { Rudaai3DCard } from './Rudaai3DCard';
import { AI_SKILL_TOOLS } from '../../data/mockData';
import {
  Search,
  Sparkles,
  ArrowRight,
  Star,
  CheckCircle2,
  SlidersHorizontal,
  Flame,
  Zap,
  TrendingUp,
  Cpu,
  Layers,
  ChevronRight,
  Filter,
  X
} from 'lucide-react';
import { AIEmployee } from '../../types';

export const MarketplaceView: React.FC = () => {
  const {
    industries,
    employees,
    addToCart,
    setPreviewEmployee,
    setActivePortal,
    purchasedEmployeeIds,
    deviceMode,
    selectedSkill,
    setSelectedSkill,
    getRealIndustryCount
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'popular' | 'tools' | 'teams'>('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'priceAsc' | 'priceDesc'>('relevance');

  const hotKeywords = ['AI客服', '内容创作', '数据分析', '营销助手', '系统架构师', '量化风控'];

  // Filter & Search logic
  const activeSkillObj = selectedSkill ? AI_SKILL_TOOLS.find((t) => t.id === selectedSkill) : null;

  const filteredEmployees = employees.filter((emp) => {
    const matchesIndustry = selectedIndustry === 'all' || emp.industryId === selectedIndustry;
    const matchesSearch =
      searchQuery.trim() === '' ||
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.capabilities.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      categoryFilter === 'all' ||
      (categoryFilter === 'popular' && (emp.isPopular || emp.featured)) ||
      (categoryFilter === 'tools' && emp.supportedTools.length > 3) ||
      (categoryFilter === 'teams' && emp.rating >= 4.97);

    const matchesSkill =
      !activeSkillObj ||
      activeSkillObj.sampleKeywords.some(
        (kw) =>
          emp.capabilities.some((c) => c.toLowerCase().includes(kw.toLowerCase())) ||
          emp.name.toLowerCase().includes(kw.toLowerCase()) ||
          emp.role.toLowerCase().includes(kw.toLowerCase()) ||
          emp.title.toLowerCase().includes(kw.toLowerCase()) ||
          emp.bio.toLowerCase().includes(kw.toLowerCase())
      );

    return matchesIndustry && matchesSearch && matchesCategory && matchesSkill;
  }).sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'priceAsc') return a.monthlyPrice - b.monthlyPrice;
    if (sortBy === 'priceDesc') return b.monthlyPrice - a.monthlyPrice;
    return b.tasksCompleted - a.tasksCompleted;
  });

  return (
    <div className="w-full text-white pb-24">
      {/* ======================================================== */}
      {/* 1. SUPER 3D HERO SECTION (Desktop 2-Col, Mobile Stacked) */}
      {/* ======================================================== */}
      <section className="relative overflow-hidden pt-6 pb-12 md:py-16 bg-gradient-to-b from-[#17111F] via-[#241238] to-[#17111F] border-b border-purple-900/30">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#CC09E6]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#7929D2]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left: Branding, Copy, Smart Search */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-900/40 border border-purple-500/30 text-xs text-purple-200">
                <Sparkles className="w-3.5 h-3.5 text-[#CC09E6]" />
                <span className="font-semibold">RUDAAI SUPERMARKET 2.0</span>
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                <span className="text-purple-300">全球 24 行业 AI 员工即买即用</span>
              </div>

              <div>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                  Your AI Workforce <br className="hidden sm:inline" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-pink-300">
                    Starts Here
                  </span>
                </h1>
                <p className="text-xl sm:text-2xl font-bold text-purple-200 mt-2">
                  你的 AI 员工，从这里开始。
                </p>
                <p className="text-sm sm:text-base text-gray-300 max-w-xl mt-3 leading-relaxed">
                  一个超市，汇集全球 AI 员工、AI 工具和行业智能服务。无需提示词门槛，一键入驻工作空间，全天候处理研发、设计、电商、法务与营销。
                </p>
              </div>

              {/* Natural Language AI Search Box */}
              <div className="space-y-2.5 max-w-xl">
                <div className="relative flex items-center p-1.5 rounded-2xl bg-[#241738]/90 border border-purple-500/40 shadow-xl shadow-purple-950/60 focus-within:border-[#CC09E6] focus-within:ring-2 focus-within:ring-[#CC09E6]/30 transition-all">
                  <Search className="w-5 h-5 text-purple-400 ml-3 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="你需要什么 AI 员工？例如：帮我分析本月销售数据、编写爬虫..."
                    className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder-purple-300/50 focus:outline-none"
                  />
                  <button
                    onClick={() => {}}
                    className="px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-[#7929D2] to-[#CC09E6] text-white hover:opacity-90 transition-opacity shrink-0 flex items-center gap-1.5 shadow-md shadow-purple-900/40"
                  >
                    <span>搜索</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Hot Searches */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-purple-300/80">
                  <span className="flex items-center gap-1 text-[11px] text-purple-400 font-medium">
                    <Flame className="w-3.5 h-3.5 text-orange-400" />
                    热门搜索:
                  </span>
                  {hotKeywords.map((kw) => (
                    <button
                      key={kw}
                      onClick={() => setSearchQuery(kw)}
                      className="px-2.5 py-0.5 rounded-lg bg-purple-900/30 hover:bg-purple-900/60 text-purple-200 border border-purple-500/20 text-[11px] transition-colors"
                    >
                      {kw}
                    </button>
                  ))}
                </div>
              </div>

              {/* Primary Call to Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    const el = document.getElementById('market-shelves');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-[#7929D2] via-[#CC09E6] to-pink-500 text-white shadow-xl shadow-purple-900/60 hover:opacity-95 flex items-center gap-2"
                >
                  <Cpu className="w-4 h-4" />
                  <span>进入超市货架</span>
                </button>
                <button
                  onClick={() => setActivePortal('workspace')}
                  className="px-6 py-3 rounded-xl font-bold text-sm bg-[#241738]/80 hover:bg-[#241738] text-purple-200 border border-purple-500/30 flex items-center gap-2 transition-colors"
                >
                  <span>探索 AI 工作空间</span>
                  <ChevronRight className="w-4 h-4 text-purple-400" />
                </button>
              </div>
            </div>

            {/* Right: 3D Holographic AI Core Scene */}
            <div className="lg:col-span-5 h-[380px] sm:h-[450px] lg:h-[520px] relative">
              <RudaaiHeroScene className="w-full h-full" />
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. 24 POPULAR INDUSTRIES 3D QUICK SELECTOR STRIP          */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="p-4 sm:p-5 rounded-2xl bg-[#1f1430]/95 backdrop-blur-xl border border-purple-500/30 shadow-2xl shadow-purple-950/80">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#CC09E6]" />
              <h3 className="text-sm font-extrabold text-white tracking-wide">
                24 个热门行业 · 一站式 AI 解决方案
              </h3>
            </div>
            <button
              onClick={() => setSelectedIndustry('all')}
              className="text-xs text-purple-300 hover:text-white flex items-center gap-1 font-medium"
            >
              <span>重置筛选 ({industries.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Horizontal Scrollable Industry Node Pills */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-purple-900/60">
            <button
              onClick={() => setSelectedIndustry('all')}
              className={`shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                selectedIndustry === 'all'
                  ? 'bg-gradient-to-r from-[#7929D2] to-[#CC09E6] border-pink-400 text-white shadow-md'
                  : 'bg-[#17111F]/70 border-purple-500/20 text-purple-200/80 hover:border-purple-500/40'
              }`}
            >
              <span>🌐</span>
              <span>全部行业</span>
            </button>

            {industries.map((ind) => {
              const isSelected = selectedIndustry === ind.id;
              const realCount = getRealIndustryCount(ind.id);
              return (
                <button
                  key={ind.id}
                  onClick={() => setSelectedIndustry(ind.id)}
                  className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all group ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#7929D2] to-[#CC09E6] border-pink-400 text-white shadow-md'
                      : 'bg-[#17111F]/70 border-purple-500/20 text-purple-200/80 hover:border-purple-500/40 hover:text-white'
                  }`}
                >
                  <span className="text-base group-hover:scale-110 transition-transform">{ind.icon}</span>
                  <span>{ind.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-black/30' : 'bg-purple-900/50 text-purple-300'}`}>
                    {realCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. 探索 AI 技能货架 (SEVEN TOOLS · INFINITE POSSIBILITIES) */}
      {/* ======================================================== */}
      <SkillsShelfSection
        onSelectSkill={() => {
          const el = document.getElementById('market-shelves');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* ======================================================== */}
      {/* 4. 热门 AI 员工真实商品货架 (Clean, High-tech Grid)       */}
      {/* ======================================================== */}
      <section id="market-shelves" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
        {/* Active Skill Filter Indicator Bar if skill selected */}
        {activeSkillObj && (
          <div className="mb-4 p-3.5 rounded-2xl bg-gradient-to-r from-purple-900/60 to-pink-900/40 border border-[#CC09E6]/50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">{activeSkillObj.icon}</span>
              <div>
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>当前技能货架筛选: <strong>{activeSkillObj.name} ({activeSkillObj.chineseName})</strong></span>
                </p>
                <p className="text-[11px] text-purple-300/80">{activeSkillObj.description}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedSkill(null)}
              className="px-2.5 py-1 rounded-lg bg-black/40 hover:bg-black/60 text-purple-200 text-xs flex items-center gap-1 font-mono border border-purple-500/20"
            >
              <X className="w-3.5 h-3.5 text-pink-400" />
              <span>清除技能筛选</span>
            </button>
          </div>
        )}

        {/* Shelf Toolbar: Category Filter & Sort */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-purple-900/30">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: '全部商品' },
              { id: 'popular', label: '热门 AI 员工' },
              { id: 'tools', label: '生态工具集成' },
              { id: 'teams', label: '高好评大师级' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCategoryFilter(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  categoryFilter === tab.id
                    ? 'bg-[#CC09E6] text-white shadow-md shadow-pink-900/40'
                    : 'bg-[#241738]/60 text-purple-300 hover:text-white hover:bg-purple-900/40'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-xs text-purple-300/70 font-mono">
              共发现 <strong className="text-white">{filteredEmployees.length}</strong> 位上架 AI 员工
            </span>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              aria-label="商品排序方式"
              className="bg-[#241738] border border-purple-500/30 rounded-xl px-3 py-1.5 text-xs text-purple-200 focus:outline-none focus:border-[#CC09E6]"
            >
              <option value="relevance">综合热度排序</option>
              <option value="rating">评分最高</option>
              <option value="priceAsc">月费从低到高</option>
              <option value="priceDesc">月费从高到低</option>
            </select>
          </div>
        </div>

        {/* Product Cards Grid: Responsive 4-col desktop, 2-col tablet, 1-col mobile */}
        {filteredEmployees.length === 0 ? (
          <div className="py-20 text-center">
            <Cpu className="w-12 h-12 mx-auto text-purple-600/50 mb-3" />
            <h4 className="text-base font-bold text-white">未找到匹配的 AI 员工</h4>
            <p className="text-xs text-purple-300/70 mt-1">您可以尝试清空筛选关键词，或浏览其他行业货架</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedIndustry('all');
                setCategoryFilter('all');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-purple-900/40 text-purple-200 text-xs hover:bg-purple-900/60"
            >
              重置所有筛选
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {filteredEmployees.map((emp) => {
              const isPurchased = purchasedEmployeeIds.includes(emp.id);
              return (
                <Rudaai3DCard
                  key={emp.id}
                  employee={emp}
                  isPurchased={isPurchased}
                  onPreview3D={(employee) => setPreviewEmployee(employee)}
                  onHire={(employee) => addToCart(employee, 'monthly')}
                  onGoToWorkspace={() => setActivePortal('workspace')}
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
