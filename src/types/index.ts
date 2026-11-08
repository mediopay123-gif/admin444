export type PortalType = 'marketplace' | 'workspace' | 'admin' | 'developer' | 'skills' | 'tools';

export type DeviceMode = 'desktop' | 'tablet' | 'mobile';

export interface RudaaiToolProduct {
  id: string;
  name: string;
  chineseName: string;
  category: 'office' | 'dev' | 'creative' | 'automation' | 'enterprise';
  tagline: string;
  description: string;
  icon: string;
  badge: string;
  apiEndpoint: string;
  features: string[];
  sampleInputPlaceholder: string;
  monthlyPrice: number;
  taskPrice: number;
  associatedEmployees: string[];
  unitCost: number; // in EUR/RMB
  unitProfit: number;
  status: 'production' | 'preview';
}

export interface ModelProviderConfig {
  id: string;
  name: string;
  provider: 'google' | 'openai' | 'anthropic' | 'open_source';
  baseUrl: string;
  modelId: string;
  unitCostPer1kTokens: number;
  status: 'active' | 'standby' | 'disabled';
  maxConcurrency: number;
  latencyMs: number;
  isSelfHosted: boolean;
}

export interface AIEmployee {
  id: string;
  name: string;
  englishName: string;
  title: string;
  role: string;
  avatar: string;
  avatar3dType: 'robot' | 'assistant' | 'engineer' | 'executive' | 'designer' | 'doctor';
  industryId: string;
  industryName: string;
  rating: number;
  reviewsCount: number;
  monthlyPrice: number;
  taskPrice: number;
  capabilities: string[];
  supportedTools: string[];
  tasksCompleted: number;
  onlineStatus: 'online' | 'busy' | 'offline';
  bio: string;
  sampleTasks: string[];
  developerName: string;
  featured?: boolean;
  isPopular?: boolean;
  responseSpeed: string;
  accuracyRate: string;
}

export interface Industry {
  id: string;
  name: string;
  englishName: string;
  code: string;
  icon: string;
  color: string;
  employeeCount: number;
  popularProductsCount: number;
  description: string;
}

export interface AISkillTool {
  id: string;
  name: string;
  chineseName: string;
  description: string;
  icon: string;
  badge: string;
  employeeCount: number;
  sampleKeywords: string[];
}

export interface AITask {
  id: string;
  employeeId: string;
  employeeName: string;
  title: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  cost: number;
  createdAt: string;
  currentStep?: string;
  steps: {
    name: string;
    status: 'pending' | 'running' | 'completed';
    time?: string;
  }[];
  output?: string;
  category: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  employeeId?: string;
  isTaskResult?: boolean;
  codeSnippet?: {
    language: string;
    code: string;
  };
}

export interface CartItem {
  employee: AIEmployee;
  billingType: 'monthly' | 'task';
  quantity: number;
}

export interface DeveloperProduct {
  id: string;
  name: string;
  category: string;
  industryId: string;
  pricingMonthly: number;
  pricingTask: number;
  status: 'active' | 'in_review' | 'draft';
  sales: number;
  revenue: number;
  rating: number;
  createdAt: string;
  model: string;
}

export interface SystemMetrics {
  activeUsers: number;
  totalOrders: number;
  activeEmployees: number;
  platformRevenue: number;
  activeTasks: number;
  systemHealth: 'normal' | 'warning' | 'critical';
  pendingOrders: number;
  runningTasks: number;
}
