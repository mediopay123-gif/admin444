import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { AIEmployee } from '../../types';
import { Star, ArrowRight, Eye, ShoppingCart, CheckCircle2, Sparkles } from 'lucide-react';

interface Rudaai3DCardProps {
  employee: AIEmployee;
  isPurchased?: boolean;
  onPreview3D: (emp: AIEmployee) => void;
  onHire: (emp: AIEmployee) => void;
  onGoToWorkspace: () => void;
}

export const Rudaai3DCard: React.FC<Rudaai3DCardProps> = ({
  employee,
  isPurchased = false,
  onPreview3D,
  onHire,
  onGoToWorkspace
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse tilt physics using motion values & smooth springs
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 260, damping: 22 });
  const mouseYSpring = useSpring(y, { stiffness: 260, damping: 22 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['14deg', '-14deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-14deg', '14deg']);
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ['0%', '100%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <div
      style={{ perspective: 1000 }}
      className="w-full h-full select-none"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d'
        }}
        whileHover={{ scale: 1.025 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="relative h-full rounded-2xl overflow-hidden backdrop-blur-xl bg-gradient-to-b from-[#241738]/85 via-[#1c1228]/90 to-[#150f22]/95 border border-purple-500/25 hover:border-[#CC09E6]/70 shadow-xl hover:shadow-[0_20px_40px_rgba(204,9,230,0.22)] transition-colors duration-300 flex flex-col justify-between p-3.5 group"
      >
        {/* Dynamic Holographic Glare sweep */}
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 220px at ${glareX} ${glareY}, rgba(204, 9, 230, 0.22), rgba(121, 41, 210, 0.08), transparent 70%)`
          }}
        />

        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#CC09E6]/15 via-transparent to-transparent rounded-full blur-2xl pointer-events-none" />

        {/* ======================================================== */}
        {/* 1. TOP 55-60% 3D VISUAL HERO AREA (Spatial Dominant)      */}
        {/* ======================================================== */}
        <div
          style={{ transform: 'translateZ(30px)' }}
          className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-b from-[#1a102a] to-[#2a133f] border border-purple-500/20 group-hover:border-[#CC09E6]/40 transition-colors shadow-inner"
        >
          {/* Subtle Grid / Cyber Matrix Floor Background */}
          <div
            className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#7929d2_1px,transparent_1px),linear-gradient(to_bottom,#7929d2_1px,transparent_1px)] bg-[size:14px_14px]"
          />

          {/* Holographic Glowing Rings & Radial Halo */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-28 h-28 rounded-full border border-[#CC09E6]/30 animate-pulse" />
            <div className="absolute w-36 h-36 rounded-full border border-purple-500/20" />
            <div className="absolute w-20 h-20 rounded-full bg-gradient-to-tr from-[#7929D2]/40 to-[#CC09E6]/40 blur-xl" />
          </div>

          {/* 3D Floating Avatar Element */}
          <img
            src={employee.avatar}
            alt={employee.name}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
          />

          {/* Glass Gradient Scrim at base of image */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#150f22] via-transparent to-black/20" />

          {/* Top Badges (Category & Live Status) */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#17111F]/80 backdrop-blur-md text-[#CC09E6] border border-purple-500/30 flex items-center gap-1 shadow-sm">
              <Sparkles className="w-2.5 h-2.5 text-pink-400" />
              <span>{employee.industryName.split(' ')[0]}</span>
            </span>

            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-300 px-2 py-0.5 rounded-full bg-[#17111F]/80 backdrop-blur-md border border-amber-400/20 shadow-sm">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{employee.rating}</span>
            </div>
          </div>

          {/* Quick 3D Inspect Hover Trigger Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPreview3D(employee);
            }}
            className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-[#17111F]/85 hover:bg-[#CC09E6] backdrop-blur-md border border-purple-400/30 hover:border-pink-300 text-[10px] text-purple-200 hover:text-white transition-all flex items-center gap-1 shadow-md opacity-90 group-hover:opacity-100"
            title="查看 3D 全息交互模型"
          >
            <Eye className="w-3 h-3" />
            <span>3D 视角</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* 2. MINIMALIST METADATA SECTION (Text reduced by 70%)     */}
        {/* ======================================================== */}
        <div style={{ transform: 'translateZ(20px)' }} className="mt-3 space-y-1.5">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-base font-extrabold text-white group-hover:text-pink-300 transition-colors truncate">
              {employee.name}
            </h3>
            <span className="text-[10px] font-mono text-purple-300/60 uppercase shrink-0">
              {employee.englishName}
            </span>
          </div>

          {/* One-line role / specialty */}
          <p className="text-xs text-purple-300/80 font-medium truncate">
            {employee.title}
          </p>

          {/* Minimal Key capability pill */}
          <div className="flex items-center gap-1.5 text-[11px] text-gray-300">
            <CheckCircle2 className="w-3 h-3 text-[#CC09E6] shrink-0" />
            <span className="truncate">{employee.capabilities[0] || '全场景智能调度'}</span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 3. GLASS ACTION FOOTER (Pricing + Direct Hire CTA)        */}
        {/* ======================================================== */}
        <div
          style={{ transform: 'translateZ(25px)' }}
          className="mt-3 pt-2.5 border-t border-purple-900/30 flex items-center justify-between gap-3"
        >
          <div>
            <div className="flex items-baseline gap-0.5">
              <span className="text-[11px] text-purple-300/70">¥</span>
              <span className="text-lg font-black text-white">{employee.monthlyPrice}</span>
              <span className="text-[10px] text-purple-400">/月</span>
            </div>
            <div className="text-[10px] text-purple-300/50 font-mono">
              单次 ¥{employee.taskPrice}
            </div>
          </div>

          {isPurchased ? (
            <button
              onClick={onGoToWorkspace}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/50 transition-colors flex items-center gap-1 shadow-sm"
            >
              <span>已入驻</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          ) : (
            <button
              onClick={() => onHire(employee)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#7929D2] to-[#CC09E6] hover:from-[#8c32f2] hover:to-[#e612ff] text-white shadow-md shadow-purple-900/50 hover:shadow-pink-900/60 transition-all flex items-center gap-1.5 active:scale-95"
            >
              <ShoppingCart className="w-3 h-3" />
              <span>雇佣</span>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
