import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShoppingBag, Cpu, Shield, Code2, ShoppingCart } from 'lucide-react';

import { PortalType } from '../../types';

export const MobileBottomNav: React.FC = () => {
  const { activePortal, setActivePortal, cart, setIsCartOpen, purchasedEmployees } = useApp();

  const tabs: Array<{ id: PortalType; label: string; icon: any; badge?: number }> = [
    { id: 'marketplace', label: 'AI超市', icon: ShoppingBag },
    { id: 'workspace', label: '工作空间', icon: Cpu, badge: purchasedEmployees.length },
    { id: 'admin', label: '控制台', icon: Shield },
    { id: 'developer', label: '开发者', icon: Code2 },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#17111F]/95 backdrop-blur-xl border-t border-purple-500/20 px-2 py-1.5 flex items-center justify-around safe-bottom">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activePortal === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActivePortal(tab.id)}
            className={`relative flex flex-col items-center justify-center w-16 py-1 transition-all ${
              isActive ? 'text-[#CC09E6]' : 'text-purple-300/60 hover:text-purple-200'
            }`}
          >
            <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-[#CC09E6]/10' : ''}`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium tracking-tight mt-0.5">{tab.label}</span>
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className="absolute top-0 right-3 px-1 min-w-[14px] h-[14px] text-[9px] font-bold rounded-full bg-[#CC09E6] text-white flex items-center justify-center">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}

      {/* Cart button */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="relative flex flex-col items-center justify-center w-14 py-1 text-purple-300/60 hover:text-purple-200"
      >
        <div className="p-1 rounded-xl">
          <ShoppingCart className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-medium tracking-tight mt-0.5">购物车</span>
        {cart.length > 0 && (
          <span className="absolute top-0 right-2 px-1 min-w-[14px] h-[14px] text-[9px] font-bold rounded-full bg-pink-500 text-white flex items-center justify-center">
            {cart.length}
          </span>
        )}
      </button>
    </div>
  );
};
