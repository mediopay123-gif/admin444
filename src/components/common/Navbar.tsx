import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShoppingBag,
  Cpu,
  Shield,
  Code2,
  Search,
  ShoppingCart,
  User,
  Monitor,
  Tablet,
  Smartphone,
  Sparkles,
  ChevronRight,
  Menu,
  X,
  Layers,
  Wrench
} from 'lucide-react';
import { PortalType } from '../../types';

export const Navbar: React.FC = () => {
  const {
    activePortal,
    setActivePortal,
    deviceMode,
    setDeviceMode,
    cart,
    setIsCartOpen,
    purchasedEmployees,
    user,
    isAdmin,
    logout,
    setIsLoginModalOpen
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const portals: Array<{ id: PortalType; label: string; icon: any; desc: string; badge?: string }> = [
    { id: 'marketplace', label: 'AI 超市', icon: ShoppingBag, desc: '发现与雇佣员工' },
    { id: 'tools', label: '自营工具', icon: Wrench, desc: '12大自研自营产品工作室', badge: '100% 自研' },
    { id: 'skills', label: '技能货架', icon: Layers, desc: '7大通用技能 3D 书架', badge: '7 TOOLS' },
    { id: 'workspace', label: '工作空间', icon: Cpu, desc: 'AI 员工协同与执行', badge: `${purchasedEmployees.length} 在线` },
    { id: 'admin', label: '控制中心', icon: Shield, desc: '平台运营与监控' },
    { id: 'developer', label: '开发者端', icon: Code2, desc: '自建与上架 AI 员工' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#17111F]/90 backdrop-blur-xl border-b border-purple-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo & Slogan */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActivePortal('marketplace')}
              className="flex items-center gap-3 group text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7929D2] via-[#CC09E6] to-pink-400 p-[2px] shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-[10px] bg-[#17111F] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-purple-300" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-extrabold tracking-wider text-white">
                    RUDA<span className="text-[#CC09E6]">AI</span>
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    3D PRO
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 hidden sm:block">AI 超级员工商业市场</p>
              </div>
            </button>

            {/* Portal Switcher (Desktop Tabs) */}
            <nav className="hidden lg:flex items-center gap-1.5 p-1 rounded-xl bg-[#241738]/80 border border-purple-500/20">
              {portals.map((p) => {
                const Icon = p.icon;
                const isActive = activePortal === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setActivePortal(p.id)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-[#7929D2] to-[#CC09E6] text-white shadow-md shadow-purple-900/50'
                        : 'text-purple-200/70 hover:text-white hover:bg-purple-900/30'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{p.label}</span>
                    {p.badge && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-black/30 text-white' : 'bg-purple-500/30 text-purple-200'}`}>
                        {p.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Controls: Device Mode Simulator, Cart, Profile */}
          <div className="flex items-center gap-3">
            {/* Device Mode Simulator Switcher */}
            <div className="hidden sm:flex items-center gap-1 p-1 rounded-lg bg-[#241738]/60 border border-purple-500/20 text-xs">
              <span className="text-[11px] text-purple-300/60 px-1 font-mono">视口:</span>
              <button
                onClick={() => setDeviceMode('desktop')}
                title="桌面宽屏体验"
                className={`p-1.5 rounded ${deviceMode === 'desktop' ? 'bg-[#CC09E6] text-white' : 'text-purple-300 hover:text-white'}`}
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDeviceMode('tablet')}
                title="平板自适应体验"
                className={`p-1.5 rounded ${deviceMode === 'tablet' ? 'bg-[#CC09E6] text-white' : 'text-purple-300 hover:text-white'}`}
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDeviceMode('mobile')}
                title="手机端专用优化体验"
                className={`p-1.5 rounded ${deviceMode === 'mobile' ? 'bg-[#CC09E6] text-white' : 'text-purple-300 hover:text-white'}`}
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-purple-900/30 hover:bg-purple-900/50 border border-purple-500/30 text-purple-200 transition-colors"
              title="超市购物车"
            >
              <ShoppingCart className="w-4 h-4" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#CC09E6] text-white text-[10px] font-bold flex items-center justify-center border border-[#17111F]">
                  {cart.length}
                </span>
              )}
            </button>

            {/* User Profile Pill or Login Button */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#241738]/80 hover:bg-[#241738] border border-purple-500/30 text-xs text-white transition-colors">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="" className="w-6 h-6 rounded-full object-cover border border-purple-400" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-[11px] font-bold">
                      {user.displayName?.[0] || user.email?.[0] || 'U'}
                    </div>
                  )}
                  <span className="font-medium max-w-[90px] sm:max-w-[120px] truncate">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                  {isAdmin && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
                      ADMIN
                    </span>
                  )}
                </button>

                {/* Dropdown Menu on Hover/Click */}
                <div className="absolute right-0 top-full mt-1.5 w-56 rounded-2xl bg-[#1c1228] border border-purple-500/30 p-2 shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all z-50 text-xs space-y-1">
                  <div className="px-3 py-2 border-b border-purple-900/30 text-[11px] text-purple-300">
                    <p className="font-bold text-white truncate">{user.displayName || 'RUDAAI 用户'}</p>
                    <p className="font-mono text-purple-400 truncate">{user.email}</p>
                    {isAdmin ? (
                      <span className="inline-block mt-1 text-[10px] text-emerald-400 font-semibold">
                        ✓ 授权平台超级管理员
                      </span>
                    ) : (
                      <span className="inline-block mt-1 text-[10px] text-purple-400">
                        标准企业客户
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setActivePortal('workspace')}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-purple-900/30 text-purple-200"
                  >
                    前往我的工作空间
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => setActivePortal('admin')}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-purple-900/30 text-emerald-300 font-semibold"
                    >
                      进入运营控制中心 (ADMIN)
                    </button>
                  )}
                  <button
                    onClick={logout}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-950/40 text-red-300"
                  >
                    退出登录
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#7929D2] to-[#CC09E6] text-white text-xs font-bold shadow-md shadow-purple-900/40 hover:opacity-95"
              >
                <User className="w-3.5 h-3.5" />
                <span>登录 / 注册</span>
              </button>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-purple-200 hover:text-white bg-purple-900/30"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-purple-900/40 bg-[#17111F] px-4 py-4 space-y-3">
          <p className="text-xs font-medium text-purple-300/60 uppercase tracking-wider">选择业务端口</p>
          <div className="grid grid-cols-2 gap-2">
            {portals.map((p) => {
              const Icon = p.icon;
              const isActive = activePortal === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setActivePortal(p.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#7929D2] to-[#CC09E6] border-purple-400 text-white'
                      : 'bg-[#241738]/40 border-purple-500/20 text-purple-200'
                  }`}
                >
                  <Icon className="w-5 h-5 mb-1 text-purple-300" />
                  <span className="text-xs font-semibold">{p.label}</span>
                  <span className="text-[10px] text-purple-300/70">{p.desc}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-purple-900/30 flex items-center justify-between text-xs text-purple-300">
            <span>切换视口模拟:</span>
            <div className="flex gap-1">
              <button
                onClick={() => setDeviceMode('desktop')}
                className={`px-2 py-1 rounded text-[11px] ${deviceMode === 'desktop' ? 'bg-[#CC09E6] text-white' : 'bg-purple-900/40'}`}
              >
                桌面
              </button>
              <button
                onClick={() => setDeviceMode('tablet')}
                className={`px-2 py-1 rounded text-[11px] ${deviceMode === 'tablet' ? 'bg-[#CC09E6] text-white' : 'bg-purple-900/40'}`}
              >
                平板
              </button>
              <button
                onClick={() => setDeviceMode('mobile')}
                className={`px-2 py-1 rounded text-[11px] ${deviceMode === 'mobile' ? 'bg-[#CC09E6] text-white' : 'bg-purple-900/40'}`}
              >
                手机
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
