import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, ShieldCheck, Sparkles, LogIn } from 'lucide-react';

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, loginWithGoogle, isAuthLoading } = useApp();

  if (!isLoginModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={() => setIsLoginModalOpen(false)}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      <div className="relative w-full max-w-md bg-[#1c1228] border border-purple-500/30 rounded-3xl p-6 sm:p-8 text-white z-10 shadow-2xl shadow-purple-950/90 text-center space-y-6">
        <button
          onClick={() => setIsLoginModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full bg-purple-900/30 text-purple-300 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Icon */}
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-[#7929D2] via-[#CC09E6] to-pink-400 p-[2px] shadow-xl shadow-purple-900/50">
          <div className="w-full h-full rounded-[14px] bg-[#17111F] flex items-center justify-center">
            <Sparkles className="w-7 h-7 text-[#CC09E6]" />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-black text-white">登录 RUDAAI 统一账户</h2>
          <p className="text-xs text-purple-300/80 mt-1.5 leading-relaxed">
            通行 AI 超市、工作空间、开发者平台与管理员控制中心
          </p>
        </div>

        {/* Google One-Click Login Button */}
        <button
          onClick={loginWithGoogle}
          disabled={isAuthLoading}
          className="w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-white hover:bg-gray-100 text-gray-900 shadow-xl flex items-center justify-center gap-3 transition-transform active:scale-95 disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>{isAuthLoading ? '正在连接安全认证...' : '使用 Google 账号快捷登录'}</span>
        </button>

        <div className="pt-2 border-t border-purple-900/30 text-[11px] text-purple-300/70 font-mono space-y-1 text-left">
          <p className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Firebase Authentication 银行级加密安全</span>
          </p>
          <p>平台超级管理员特权邮箱已预设（包含 mediopay123@gmail.com 等）。登录后将自动验证权限等级并开放管理后台。</p>
        </div>
      </div>
    </div>
  );
};
