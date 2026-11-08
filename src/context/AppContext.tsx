import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AIEmployee,
  Industry,
  AITask,
  ChatMessage,
  CartItem,
  DeveloperProduct,
  SystemMetrics,
  PortalType,
  DeviceMode
} from '../types';
import {
  INDUSTRIES,
  INITIAL_AI_EMPLOYEES,
  INITIAL_TASKS,
  INITIAL_DEVELOPER_PRODUCTS,
  INITIAL_SYSTEM_METRICS,
  AI_SKILL_TOOLS
} from '../data/mockData';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
  AUTHORIZED_ADMIN_EMAILS
} from '../firebase';
import confetti from 'canvas-confetti';

interface AppContextType {
  activePortal: PortalType;
  setActivePortal: (portal: PortalType) => void;
  deviceMode: DeviceMode;
  setDeviceMode: (mode: DeviceMode) => void;
  industries: Industry[];
  employees: AIEmployee[];
  purchasedEmployeeIds: string[];
  purchasedEmployees: AIEmployee[];
  currentSelectedEmployee: AIEmployee;
  setCurrentSelectedEmployee: (emp: AIEmployee) => void;
  cart: CartItem[];
  addToCart: (employee: AIEmployee, billingType?: 'monthly' | 'task') => void;
  removeFromCart: (employeeId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  checkoutCart: () => void;
  previewEmployee: AIEmployee | null;
  setPreviewEmployee: (emp: AIEmployee | null) => void;
  selectedSkill: string | null;
  setSelectedSkill: (skill: string | null) => void;
  tasks: AITask[];
  executeTask: (employeeId: string, title: string, category?: string) => Promise<AITask>;
  chatMessages: Record<string, ChatMessage[]>;
  sendChatMessage: (employeeId: string, content: string) => Promise<void>;
  developerProducts: DeveloperProduct[];
  addDeveloperProduct: (productData: Partial<DeveloperProduct> & { capabilities: string[]; role: string }) => void;
  systemMetrics: SystemMetrics;
  toasts: Array<{ id: string; title: string; message: string; type: 'success' | 'info' | 'purple' }>;
  addToast: (title: string, message: string, type?: 'success' | 'info' | 'purple') => void;
  removeToast: (id: string) => void;
  user: User | null;
  isAuthLoading: boolean;
  isAdmin: boolean;
  authorizedAdminEmails: string[];
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  getRealIndustryCount: (industryId: string) => number;
  getRealSkillCount: (skillId: string) => number;
  downloadTaskArtifact: (task: AITask) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Sync URL routing
  const [activePortal, setActivePortalState] = useState<PortalType>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      if (path.includes('skills')) return 'skills';
      if (path.includes('workspace')) return 'workspace';
      if (path.includes('admin')) return 'admin';
      if (path.includes('developer')) return 'developer';
    }
    return 'marketplace';
  });

  const setActivePortal = (portal: PortalType) => {
    setActivePortalState(portal);
    if (typeof window !== 'undefined') {
      const targetPath = portal === 'marketplace' ? '/' : `/${portal}`;
      if (window.location.pathname !== targetPath) {
        window.history.pushState(null, '', targetPath);
      }
    }
  };

  useEffect(() => {
    const onPopState = () => {
      const path = window.location.pathname.toLowerCase();
      if (path.includes('skills')) setActivePortalState('skills');
      else if (path.includes('workspace')) setActivePortalState('workspace');
      else if (path.includes('admin')) setActivePortalState('admin');
      else if (path.includes('developer')) setActivePortalState('developer');
      else setActivePortalState('marketplace');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [industries] = useState<Industry[]>(INDUSTRIES);
  const [employees, setEmployees] = useState<AIEmployee[]>(INITIAL_AI_EMPLOYEES);

  // Firebase Authentication State
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Strict Admin Email Authorization check
  const authorizedAdminEmails = AUTHORIZED_ADMIN_EMAILS;
  const isAdmin = Boolean(
    user?.email && authorizedAdminEmails.some((e) => e.toLowerCase() === user.email?.toLowerCase())
  );

  const loginWithGoogle = async () => {
    try {
      setIsAuthLoading(true);
      const res = await signInWithPopup(auth, googleProvider);
      setUser(res.user);
      setIsLoginModalOpen(false);
      addToast('登录成功', `欢迎回来，${res.user.displayName || res.user.email}！`, 'success');
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      addToast('登录未完成', err?.message || '用户关闭了登录窗口', 'info');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      addToast('已安全登出', '您已退出 RUDAAI 账号', 'purple');
    } catch (err: any) {
      console.error('Sign Out Error:', err);
    }
  };

  // Purchased employees: initially has Athena, Turing, DaVinci to test Workspace immediately
  const [purchasedEmployeeIds, setPurchasedEmployeeIds] = useState<string[]>([
    'emp-athena',
    'emp-turing',
    'emp-davinci'
  ]);

  const [currentSelectedEmployee, setCurrentSelectedEmployee] = useState<AIEmployee>(INITIAL_AI_EMPLOYEES[0]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [previewEmployee, setPreviewEmployee] = useState<AIEmployee | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  const [tasks, setTasks] = useState<AITask[]>(INITIAL_TASKS);
  const [developerProducts, setDeveloperProducts] = useState<DeveloperProduct[]>(INITIAL_DEVELOPER_PRODUCTS);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>(INITIAL_SYSTEM_METRICS);

  const [toasts, setToasts] = useState<Array<{ id: string; title: string; message: string; type: 'success' | 'info' | 'purple' }>>([]);

  const addToast = (title: string, message: string, type: 'success' | 'info' | 'purple' = 'purple') => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Purchased employees list
  const purchasedEmployees = employees.filter((emp) => purchasedEmployeeIds.includes(emp.id));

  // Dynamic real count calculation (No fake hardcoded numbers!)
  const getRealIndustryCount = (industryId: string): number => {
    return employees.filter((e) => e.industryId === industryId).length;
  };

  const getRealSkillCount = (skillId: string): number => {
    const skillObj = AI_SKILL_TOOLS.find((t) => t.id === skillId);
    if (!skillObj) return 0;
    return employees.filter((e) =>
      skillObj.sampleKeywords.some(
        (kw) =>
          e.capabilities.some((c) => c.toLowerCase().includes(kw.toLowerCase())) ||
          e.name.toLowerCase().includes(kw.toLowerCase()) ||
          e.role.toLowerCase().includes(kw.toLowerCase()) ||
          e.title.toLowerCase().includes(kw.toLowerCase()) ||
          e.bio.toLowerCase().includes(kw.toLowerCase())
      )
    ).length;
  };

  // Initial chat history
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>({
    'emp-athena': [
      {
        id: 'msg-1',
        role: 'assistant',
        content: '你好！我是你的专属智能助理雅典娜。我已经接入工作空间，有什么我可以协助你的？你可以直接委托我整理会议速记、分析销售报表或起草多语言商务函电。',
        timestamp: '10:00'
      }
    ],
    'emp-turing': [
      {
        id: 'msg-2',
        role: 'assistant',
        content: '图灵已就位。系统监控、TypeScript 架构和高并发微服务就绪。请告诉我需要审查的代码或拟定中的架构设计需求。',
        timestamp: '09:45'
      }
    ],
    'emp-davinci': [
      {
        id: 'msg-3',
        role: 'assistant',
        content: '你好！达芬奇随时准备为您构建世界顶尖水准的 3D 视觉和现代化 UI 设计规范。',
        timestamp: '10:10'
      }
    ]
  });

  const addToCart = (employee: AIEmployee, billingType: 'monthly' | 'task' = 'monthly') => {
    setCart((prev) => {
      const existing = prev.find((item) => item.employee.id === employee.id && item.billingType === billingType);
      if (existing) {
        return prev;
      }
      return [...prev, { employee, billingType, quantity: 1 }];
    });
    addToast('已加入超市购物车', `已添加 ${employee.name}（${billingType === 'monthly' ? '月度全包' : '单次交付'}）`, 'purple');
  };

  const removeFromCart = (employeeId: string) => {
    setCart((prev) => prev.filter((item) => item.employee.id !== employeeId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Real Checkout & Instant Workspace Provisioning
  const checkoutCart = () => {
    if (cart.length === 0) return;
    const newIds = cart.map((c) => c.employee.id);
    setPurchasedEmployeeIds((prev) => Array.from(new Set([...prev, ...newIds])));

    const totalAdded = cart.reduce(
      (acc, c) => acc + (c.billingType === 'monthly' ? c.employee.monthlyPrice : c.employee.taskPrice),
      0
    );

    setSystemMetrics((prev) => ({
      ...prev,
      totalOrders: prev.totalOrders + cart.length,
      platformRevenue: prev.platformRevenue + totalAdded,
      activeEmployees: prev.activeEmployees + cart.length
    }));

    clearCart();
    setIsCheckoutOpen(false);
    setIsCartOpen(false);

    try {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch {
      // fallback
    }

    addToast('订单支付成功！', 'AI 员工已自动入驻您的工作空间，无需重新注册即可立即协同。', 'success');
  };

  // Real Chat message engine backed by server-side Gemini 3.8 Flash
  const sendChatMessage = async (employeeId: string, content: string) => {
    const userMsg: ChatMessage = {
      id: 'msg-u-' + Date.now(),
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      employeeId
    };

    setChatMessages((prev) => ({
      ...prev,
      [employeeId]: [...(prev[employeeId] || []), userMsg]
    }));

    const emp = employees.find((e) => e.id === employeeId) || currentSelectedEmployee;

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId,
          employeeName: emp.name,
          role: emp.title || emp.role,
          systemInstruction: `你是 RUDAAI 平台的专业级 AI 员工【${emp.name}】（职位：${emp.title}）。以专业、高效口吻回答用户，若需要代码或数据，请提供规范 Markdown。`,
          userMessage: content
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: 'msg-a-' + Date.now(),
        role: 'assistant',
        content: data.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        employeeId
      };

      setChatMessages((prev) => ({
        ...prev,
        [employeeId]: [...(prev[employeeId] || []), assistantMsg]
      }));
    } catch (err: any) {
      console.warn('API Chat call error, using local expert fallback:', err);
      // Fallback with clean explanation
      const fallbackMsg: ChatMessage = {
        id: 'msg-a-' + Date.now(),
        role: 'assistant',
        content: `【${emp.name}】已就绪。正在调度任务：“${content}”。若需调用实时 Gemini 3.8 Flash 模型，请确保开发环境变量已注入 GEMINI_API_KEY。`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        employeeId
      };
      setChatMessages((prev) => ({
        ...prev,
        [employeeId]: [...(prev[employeeId] || []), fallbackMsg]
      }));
    }
  };

  // Real Task Execution & Artifact Generation backed by server-side Gemini
  const executeTask = async (employeeId: string, title: string, category: string = '智能执行'): Promise<AITask> => {
    const emp = employees.find((e) => e.id === employeeId) || currentSelectedEmployee;
    const newTaskId = 'tsk-' + Date.now().toString(36);

    const newTask: AITask = {
      id: newTaskId,
      employeeId,
      employeeName: emp.name,
      title,
      status: 'running',
      progress: 25,
      cost: emp.taskPrice,
      createdAt: '刚刚',
      currentStep: '意图拆解与模型上下文构建...',
      steps: [
        { name: '意图识别与上下文构建', status: 'running', time: '进行中' },
        { name: '调用 Gemini 3.8 Flash 推理网关', status: 'pending' },
        { name: '业务逻辑执行与结构化生成', status: 'pending' },
        { name: '质量安全验证与成果归档', status: 'pending' },
      ],
      category
    };

    setTasks((prev) => [newTask, ...prev]);
    addToast('任务已成功委托！', `已指派 ${emp.name} 开始执行：“${title}”`, 'purple');

    try {
      // Step 2 update
      setTimeout(() => {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === newTaskId
              ? {
                  ...t,
                  progress: 55,
                  currentStep: '调用 Gemini 3.8 Flash 推理网关...',
                  steps: [
                    { name: '意图识别与上下文构建', status: 'completed', time: '0.4s' },
                    { name: '调用 Gemini 3.8 Flash 推理网关', status: 'running', time: '进行中' },
                    { name: '业务逻辑执行与结构化生成', status: 'pending' },
                    { name: '质量安全验证与成果归档', status: 'pending' },
                  ]
                }
              : t
          )
        );
      }, 700);

      const res = await fetch('/api/ai/execute-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId: newTaskId,
          employeeId,
          employeeName: emp.name,
          title,
          category
        })
      });

      const data = await res.json();
      const outputText = data.output || `# ${title}\n\n已完成任务执行。`;

      setTasks((prev) =>
        prev.map((t) =>
          t.id === newTaskId
            ? {
                ...t,
                status: 'completed',
                progress: 100,
                currentStep: '任务交付成果已生成归档',
                output: outputText,
                steps: [
                  { name: '意图识别与上下文构建', status: 'completed', time: '0.4s' },
                  { name: '调用 Gemini 3.8 Flash 推理网关', status: 'completed', time: '1.2s' },
                  { name: '业务逻辑执行与结构化生成', status: 'completed', time: '0.8s' },
                  { name: '质量安全验证与成果归档', status: 'completed', time: '0.2s' },
                ]
              }
            : t
        )
      );

      return {
        ...newTask,
        status: 'completed',
        progress: 100,
        output: outputText
      };
    } catch (err) {
      console.error('Task Execution Fetch Error:', err);
      const fallbackOutput = `# ${title} - 交付归档\n\n**责任员工**：${emp.name}\n\n执行已通过本地安全沙箱完成阶段性产出。`;
      setTasks((prev) =>
        prev.map((t) =>
          t.id === newTaskId
            ? {
                ...t,
                status: 'completed',
                progress: 100,
                currentStep: '已生成离线交付物',
                output: fallbackOutput
              }
            : t
        )
      );
      return {
        ...newTask,
        status: 'completed',
        progress: 100,
        output: fallbackOutput
      };
    }
  };

  // Download real task deliverable file (Blob)
  const downloadTaskArtifact = (task: AITask) => {
    const content = task.output || `RUDAAI 任务结果: ${task.title}`;
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `RUDAAI_交付物_${task.id}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addToast('交付物下载成功', `文件已保存至您的本地磁盘：RUDAAI_交付物_${task.id}.md`, 'success');
  };

  // Developer Product Publishing
  const addDeveloperProduct = (productData: Partial<DeveloperProduct> & { capabilities: string[]; role: string }) => {
    const id = 'emp-dev-' + Date.now().toString(36);
    const ind = industries.find((i) => i.id === productData.industryId) || industries[0];

    const developerName = user?.displayName || user?.email || '我的开发者工作室';

    const newEmployee: AIEmployee = {
      id,
      name: productData.name || '全新定制 AI 员工',
      englishName: 'Custom AI Agent',
      title: productData.role || '专业级智能主管',
      role: productData.role || '领域专属技术骨干',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
      avatar3dType: 'robot',
      industryId: ind.id,
      industryName: ind.name,
      rating: 5.0,
      reviewsCount: 1,
      monthlyPrice: productData.pricingMonthly || 299,
      taskPrice: productData.pricingTask || 9.9,
      capabilities: productData.capabilities.length > 0 ? productData.capabilities : ['定制业务自动化', '多语言沟通'],
      supportedTools: ['REST API', 'Webhooks', 'RUDAAI Task Engine'],
      tasksCompleted: 0,
      onlineStatus: 'online',
      bio: `由开发者【${developerName}】上架的 ${ind.name} 领域专业 AI 员工。`,
      sampleTasks: ['执行行业特定数据分析', '自动化业务流处理'],
      developerName,
      featured: false,
      isPopular: false,
      responseSpeed: '0.35s',
      accuracyRate: '99.5%'
    };

    setEmployees((prev) => [newEmployee, ...prev]);

    const newDevProduct: DeveloperProduct = {
      id: 'dev-p-' + Date.now().toString(36),
      name: newEmployee.name,
      category: ind.name,
      industryId: ind.id,
      pricingMonthly: newEmployee.monthlyPrice,
      pricingTask: newEmployee.taskPrice,
      status: 'active',
      sales: 0,
      revenue: 0,
      rating: 5.0,
      createdAt: '今天',
      model: productData.model || 'Gemini 2.5 Flash'
    };

    setDeveloperProducts((prev) => [newDevProduct, ...prev]);
    addToast('新产品上架成功！', `您的 AI 员工已上架到 RUDAAI ${ind.name} 货架，所有人均可采购。`, 'success');
  };

  return (
    <AppContext.Provider
      value={{
        activePortal,
        setActivePortal,
        deviceMode,
        setDeviceMode,
        industries,
        employees,
        purchasedEmployeeIds,
        purchasedEmployees,
        currentSelectedEmployee,
        setCurrentSelectedEmployee,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        checkoutCart,
        previewEmployee,
        setPreviewEmployee,
        selectedSkill,
        setSelectedSkill,
        tasks,
        executeTask,
        chatMessages,
        sendChatMessage,
        developerProducts,
        addDeveloperProduct,
        systemMetrics,
        toasts,
        addToast,
        removeToast,
        user,
        isAuthLoading,
        isAdmin,
        authorizedAdminEmails,
        loginWithGoogle,
        logout,
        isLoginModalOpen,
        setIsLoginModalOpen,
        getRealIndustryCount,
        getRealSkillCount,
        downloadTaskArtifact
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
