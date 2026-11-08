import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    removeFromCart,
    clearCart,
    isCartOpen,
    setIsCartOpen,
    checkoutCart,
    setActivePortal
  } = useApp();

  if (!isCartOpen) return null;

  const total = cart.reduce((acc, item) => {
    return acc + (item.billingType === 'monthly' ? item.employee.monthlyPrice : item.employee.taskPrice);
  }, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#17111F] border-l border-purple-500/20 text-white flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-5 border-b border-purple-900/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#CC09E6]" />
              <h2 className="text-base font-bold">AI 超市购物车</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-300 font-mono">
                {cart.length} 件
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-purple-400 hover:text-white hover:bg-purple-900/30"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-purple-300/60">
                <ShoppingBag className="w-12 h-12 mb-3 text-purple-600/40" />
                <p className="font-medium text-sm">购物车空空如也</p>
                <p className="text-xs mt-1 text-purple-400/60">快去 24 大行业货架雇佣心仪的 AI 员工吧</p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.employee.id + item.billingType}
                  className="p-3.5 rounded-xl bg-[#241738]/60 border border-purple-500/20 flex items-center justify-between gap-3"
                >
                  <img
                    src={item.employee.avatar}
                    alt={item.employee.name}
                    className="w-12 h-12 rounded-lg object-cover border border-purple-400/30"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-white truncate">{item.employee.name}</h4>
                    <p className="text-[11px] text-purple-300/70">{item.employee.title}</p>
                    <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-200 font-medium">
                      {item.billingType === 'monthly' ? '月度全包订阅' : '单任务交付委托'}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">
                      ¥{item.billingType === 'monthly' ? item.employee.monthlyPrice : item.employee.taskPrice}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.employee.id)}
                      className="mt-1 text-red-400/70 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-purple-900/40 bg-[#1c1426] space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-purple-300/80">合计应付：</span>
                <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-pink-300">
                  ¥{total.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-400/90 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>购买后自动解锁至个人 AI 工作空间，无需二次注册</span>
              </div>
              <button
                onClick={() => {
                  checkoutCart();
                  setActivePortal('workspace');
                }}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-[#7929D2] via-[#CC09E6] to-pink-500 text-white shadow-lg shadow-purple-900/60 hover:opacity-95 flex items-center justify-center gap-2"
              >
                <span>立即确认雇佣与结算</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={clearCart}
                className="w-full text-center text-xs text-purple-400/60 hover:text-purple-300 py-1"
              >
                清空购物车
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
