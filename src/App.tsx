import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { ToastContainer } from './components/common/ToastContainer';
import { CartDrawer } from './components/common/CartDrawer';
import { EmployeeDetailModal } from './components/common/EmployeeDetailModal';
import { LoginModal } from './components/common/LoginModal';

// Four Portals + Skills Shelf View
import { MarketplaceView } from './components/marketplace/MarketplaceView';
import { SkillsShelfPage } from './components/skills/SkillsShelfPage';
import { FirstPartyToolsView } from './components/tools/FirstPartyToolsView';
import { WorkspaceView } from './components/workspace/WorkspaceView';
import { AdminView } from './components/admin/AdminView';
import { DeveloperView } from './components/developer/DeveloperView';

const AppContent: React.FC = () => {
  const { activePortal, deviceMode } = useApp();

  return (
    <div className="min-h-screen bg-[#17111F] text-white flex flex-col font-sans selection:bg-[#CC09E6] selection:text-white">
      {/* Top Universal Navbar */}
      <Navbar />

      {/* Main View Area with optional device simulation wrapper */}
      <main className="flex-1 flex flex-col items-center justify-start w-full">
        {deviceMode === 'desktop' ? (
          <div className="w-full flex-1">
            {activePortal === 'marketplace' && <MarketplaceView />}
            {activePortal === 'tools' && <FirstPartyToolsView />}
            {activePortal === 'skills' && <SkillsShelfPage />}
            {activePortal === 'workspace' && <WorkspaceView />}
            {activePortal === 'admin' && <AdminView />}
            {activePortal === 'developer' && <DeveloperView />}
          </div>
        ) : deviceMode === 'tablet' ? (
          <div className="w-full max-w-3xl my-4 px-2 py-4 rounded-3xl border-2 border-purple-500/40 bg-[#17111F] shadow-2xl shadow-purple-950/80 overflow-hidden flex-1">
            <div className="text-center text-[11px] font-mono text-purple-300/60 pb-2 border-b border-purple-900/40 mb-2">
              📱 平板端自适应模拟模式 (768px - 1024px)
            </div>
            {activePortal === 'marketplace' && <MarketplaceView />}
            {activePortal === 'tools' && <FirstPartyToolsView />}
            {activePortal === 'skills' && <SkillsShelfPage />}
            {activePortal === 'workspace' && <WorkspaceView />}
            {activePortal === 'admin' && <AdminView />}
            {activePortal === 'developer' && <DeveloperView />}
          </div>
        ) : (
          <div className="w-full max-w-sm my-4 px-1 py-4 rounded-3xl border-2 border-pink-500/40 bg-[#17111F] shadow-2xl shadow-purple-950/80 overflow-hidden flex-1 pb-16">
            <div className="text-center text-[11px] font-mono text-purple-300/60 pb-2 border-b border-purple-900/40 mb-2 flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>📲 手机移动端专用优化视口 (375px - 430px)</span>
            </div>
            {activePortal === 'marketplace' && <MarketplaceView />}
            {activePortal === 'tools' && <FirstPartyToolsView />}
            {activePortal === 'skills' && <SkillsShelfPage />}
            {activePortal === 'workspace' && <WorkspaceView />}
            {activePortal === 'admin' && <AdminView />}
            {activePortal === 'developer' && <DeveloperView />}
          </div>
        )}
      </main>

      {/* Global Interactive Overlays */}
      <CartDrawer />
      <EmployeeDetailModal />
      <LoginModal />
      <ToastContainer />
      <MobileBottomNav />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
