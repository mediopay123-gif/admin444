import React, { useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';

export const SkillsShelfPage: React.FC = () => {
  const { setActivePortal, setSelectedSkill, addToast } = useApp();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Safe PostMessage Event Listener
    const handleMessage = (event: MessageEvent) => {
      // Validate structure
      if (!event.data || typeof event.data !== 'object') return;
      if (event.data.source !== 'RUDAAI_SKILLS_SHELF') return;

      const { type, payload } = event.data;

      if (type === 'SELECT_SKILL') {
        const { skillKey, skillName } = payload || {};
        if (skillKey) {
          setSelectedSkill(skillKey);
          addToast(
            '已选定技能货架',
            `已将货架筛选器设置为【${skillName}】，正在跳转至超市货架...`,
            'purple'
          );
          setActivePortal('marketplace');
        }
      } else if (type === 'VIEW_ALL_EMPLOYEES') {
        setSelectedSkill(null);
        setActivePortal('marketplace');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [setActivePortal, setSelectedSkill, addToast]);

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-[#17111F] flex flex-col text-white pb-16">
      {/* Top Bar with Back Navigation & PostMessage Protocol Verification */}
      <div className="border-b border-purple-900/40 bg-[#1c1228]/95 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActivePortal('marketplace')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-900/30 hover:bg-purple-900/60 text-purple-200 text-xs font-semibold border border-purple-500/20 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>返回超市首页</span>
          </button>
          <div className="hidden sm:flex items-center gap-2 text-xs text-purple-300 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>3D Complete Shelf Engine · Iframe Safe PostMessage Protocol Active</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-purple-400 font-mono hidden md:inline">
            7 大跨行业技能 · 独立沙箱隔离运行
          </span>
          <button
            onClick={() => {
              setSelectedSkill(null);
              setActivePortal('marketplace');
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#CC09E6] text-white hover:opacity-90 transition-opacity"
          >
            查看全部员工货架
          </button>
        </div>
      </div>

      {/* Embedded 3D Skills Shelf Iframe */}
      <div className="flex-1 w-full relative min-h-[720px] lg:min-h-[860px]">
        <iframe
          ref={iframeRef}
          src="/landing-pages/complete-shelf-v2.html"
          title="RUDAAI 3D AI Skills Shelf"
          className="w-full h-full border-0 absolute inset-0"
        />
      </div>
    </div>
  );
};
