import React from 'react';
import { useApp } from '../../context/AppContext';
import { AI_SKILL_TOOLS } from '../../data/mockData';
import { Sparkles, ArrowRight, Layers, ExternalLink } from 'lucide-react';

interface SkillsShelfSectionProps {
  onSelectSkill?: (skillId: string) => void;
}

export const SkillsShelfSection: React.FC<SkillsShelfSectionProps> = ({ onSelectSkill }) => {
  const { setActivePortal, setSelectedSkill, selectedSkill } = useApp();

  const handleCardClick = (skillId: string) => {
    setSelectedSkill(selectedSkill === skillId ? null : skillId);
    if (onSelectSkill) {
      onSelectSkill(skillId);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/40 border border-purple-500/30 text-xs text-purple-200 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#CC09E6] shadow-sm shadow-[#CC09E6]" />
            <span className="font-mono font-semibold tracking-wider">SEVEN TOOLS · INFINITE POSSIBILITIES</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            探索 AI 技能货架
          </h2>
          <p className="text-xs sm:text-sm text-purple-300/80 mt-1">
            七大通用 AI 创造力基石 · 跨行业智能赋能与即时工具调用
          </p>
        </div>

        {/* Action button to open full 3D Skills Shelf page */}
        <button
          onClick={() => setActivePortal('skills')}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-[#7929D2] via-[#CC09E6] to-pink-500 text-white shadow-lg shadow-purple-950/80 hover:opacity-95 transition-opacity"
        >
          <span>进入完整 3D 书架导航 (/skills)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3D Shelf Rack Simulation Grid */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#241738]/90 via-[#1c1228] to-[#17111F] border border-purple-500/30 p-5 sm:p-7 shadow-2xl shadow-purple-950/90">
        {/* Top ambient highlight line */}
        <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-[#CC09E6] to-transparent" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {AI_SKILL_TOOLS.map((tool, idx) => {
            const isSelected = selectedSkill === tool.id;
            return (
              <div
                key={tool.id}
                onClick={() => handleCardClick(tool.id)}
                className={`group relative rounded-2xl p-5 border text-left cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                  idx === 6 ? 'sm:col-span-2 lg:col-span-2' : ''
                } ${
                  isSelected
                    ? 'bg-gradient-to-br from-[#381a54] to-[#1f132e] border-[#CC09E6] ring-2 ring-[#CC09E6]/50 shadow-xl shadow-purple-950'
                    : 'bg-[#1a1126]/80 border-purple-500/20 hover:border-purple-400 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-950/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono text-purple-300/70 font-semibold tracking-wider">
                      {tool.badge}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-purple-900/40 border border-purple-500/30 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                      {tool.icon}
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#CC09E6] transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-purple-300 font-medium mt-0.5 mb-2">
                    {tool.chineseName}
                  </p>
                  <p className="text-xs text-gray-300/80 line-clamp-2 leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-purple-900/30 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-purple-400">
                    {tool.employeeCount} 位在架员工
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(tool.id);
                    }}
                    className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg transition-all ${
                      isSelected
                        ? 'bg-[#CC09E6] text-white shadow-sm'
                        : 'bg-purple-900/40 text-purple-200 group-hover:bg-[#CC09E6] group-hover:text-white'
                    }`}
                  >
                    <span>{isSelected ? '已筛选' : '探索 AI 技能'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3D Shelf Depth Bottom Plank */}
        <div className="mt-6 pt-4 border-t border-purple-900/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-purple-300/70 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>24 行业负责行业分类 · 7 大技能负责跨行业能力 · 点击卡片即时筛选</span>
          </div>
          {selectedSkill && (
            <button
              onClick={() => setSelectedSkill(null)}
              className="text-[#CC09E6] hover:underline font-bold"
            >
              清空技能筛选 (恢复全部商品)
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
