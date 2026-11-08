import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Employee3DPreview } from '../3d/Employee3DPreview';
import {
  X,
  Star,
  Zap,
  CheckCircle2,
  Wrench,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Cpu
} from 'lucide-react';

export const EmployeeDetailModal: React.FC = () => {
  const { previewEmployee, setPreviewEmployee, addToCart, purchasedEmployeeIds, setActivePortal } = useApp();
  const [billingChoice, setBillingChoice] = useState<'monthly' | 'task'>('monthly');

  if (!previewEmployee) return null;

  const isPurchased = purchasedEmployeeIds.includes(previewEmployee.id);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-10 flex items-center justify-center">
      {/* Backdrop */}
      <div
        onClick={() => setPreviewEmployee(null)}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      <div className="relative w-full max-w-4xl bg-[#17111F] border border-purple-500/30 rounded-3xl overflow-hidden shadow-2xl shadow-purple-950/90 text-white z-10 flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={() => setPreviewEmployee(null)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#241738]/80 text-purple-300 hover:text-white border border-purple-500/30"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: 3D Holographic Showcase */}
        <div className="w-full md:w-5/12 bg-gradient-to-b from-[#241738] to-[#17111F] border-b md:border-b-0 md:border-r border-purple-500/20 p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-[#CC09E6] border border-purple-500/30">
              {previewEmployee.industryName}
            </span>
            <div className="flex items-center gap-1 text-xs text-amber-300 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{previewEmployee.rating}</span>
              <span className="text-purple-300/60 font-normal">({previewEmployee.reviewsCount})</span>
            </div>
          </div>

          {/* Interactive 3D Hologram */}
          <div className="my-auto py-2">
            <Employee3DPreview employee={previewEmployee} className="h-64" />
          </div>

          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="p-2 rounded-xl bg-purple-900/20 border border-purple-500/20">
              <p className="text-[10px] text-purple-300/60 font-mono">响应延时</p>
              <p className="font-bold text-white mt-0.5">{previewEmployee.responseSpeed}</p>
            </div>
            <div className="p-2 rounded-xl bg-purple-900/20 border border-purple-500/20">
              <p className="text-[10px] text-purple-300/60 font-mono">准确率置信度</p>
              <p className="font-bold text-emerald-400 mt-0.5">{previewEmployee.accuracyRate}</p>
            </div>
          </div>
        </div>

        {/* Right Column: Specifications & Hire Options */}
        <div className="w-full md:w-7/12 p-6 md:p-8 overflow-y-auto flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-white">{previewEmployee.name}</h2>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <p className="text-xs text-purple-300 font-mono">{previewEmployee.englishName}</p>
              <p className="text-sm text-purple-200/90 font-medium mt-1">{previewEmployee.title} · {previewEmployee.role}</p>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed bg-[#241738]/40 p-3 rounded-xl border border-purple-500/15">
              {previewEmployee.bio}
            </p>

            {/* Core Capabilities */}
            <div>
              <h4 className="text-xs font-semibold text-purple-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#CC09E6]" />
                核心专业技能与能力模型
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {previewEmployee.capabilities.map((cap, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-lg bg-purple-900/30 text-purple-200 border border-purple-500/25 flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3 text-[#CC09E6]" />
                    {cap}
                  </span>
                ))}
              </div>
            </div>

            {/* Supported Tools */}
            <div>
              <h4 className="text-xs font-semibold text-purple-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-cyan-400" />
                已打通工具与外部生态
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {previewEmployee.supportedTools.map((tool, i) => (
                  <span
                    key={i}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-[#241738] text-purple-300 border border-purple-500/20 font-mono"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Sample Tasks */}
            <div>
              <h4 className="text-xs font-semibold text-purple-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                经典交付任务样例
              </h4>
              <ul className="space-y-1.5">
                {previewEmployee.sampleTasks.map((t, idx) => (
                  <li key={idx} className="text-xs text-gray-300 flex items-start gap-2">
                    <span className="text-[#CC09E6] font-bold">›</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Pricing & CTA */}
          <div className="pt-4 border-t border-purple-900/40 space-y-4">
            {/* Billing Switcher */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setBillingChoice('monthly')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  billingChoice === 'monthly'
                    ? 'bg-purple-900/40 border-[#CC09E6] ring-1 ring-[#CC09E6]'
                    : 'bg-[#241738]/40 border-purple-500/20 text-purple-300/70 hover:border-purple-500/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">月度全包订阅</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/30 text-purple-200">推荐</span>
                </div>
                <p className="text-xl font-black text-white mt-1">¥{previewEmployee.monthlyPrice}<span className="text-xs font-normal text-purple-300">/月</span></p>
                <p className="text-[10px] text-purple-400 mt-0.5">无限次协同与多端驻守</p>
              </button>

              <button
                onClick={() => setBillingChoice('task')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  billingChoice === 'task'
                    ? 'bg-purple-900/40 border-[#CC09E6] ring-1 ring-[#CC09E6]'
                    : 'bg-[#241738]/40 border-purple-500/20 text-purple-300/70 hover:border-purple-500/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">单任务交付制</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-900/50 text-purple-400">灵活</span>
                </div>
                <p className="text-xl font-black text-white mt-1">¥{previewEmployee.taskPrice}<span className="text-xs font-normal text-purple-300">/次</span></p>
                <p className="text-[10px] text-purple-400 mt-0.5">按需唤起，成果合格扣费</p>
              </button>
            </div>

            {/* Action Buttons */}
            {isPurchased ? (
              <button
                onClick={() => {
                  setPreviewEmployee(null);
                  setActivePortal('workspace');
                }}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-900/50 flex items-center justify-center gap-2 hover:opacity-95"
              >
                <Cpu className="w-4 h-4" />
                <span>该员工已在您的工作空间中，立即前往协同</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    addToCart(previewEmployee, billingChoice);
                    setPreviewEmployee(null);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-[#7929D2] via-[#CC09E6] to-pink-500 text-white shadow-lg shadow-purple-900/60 hover:opacity-95 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>加入购物车</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
