export const bigStats = [
  {
    label: 'Total Revenue',
    value: '₴48.2M',
    icon: 'trending-up',
    iconBg: '#E8FAF0',
    iconColor: '#25603A',
    trend: '+12% vs last month',
  },
  {
    label: 'Total Orders',
    value: '184',
    icon: 'clipboard-list',
    iconBg: '#EEF0FF',
    iconColor: '#5749F4',
    trend: '+8% vs last month',
  },
  {
    label: 'Active Employees',
    value: '14',
    icon: 'users',
    iconBg: '#FFF0E9',
    iconColor: '#A05A00',
    trend: '6 currently on jobs',
  },
  {
    label: 'Business Rating',
    value: '4.7 ⭐',
    icon: 'star',
    iconBg: '#FFF8E5',
    iconColor: '#B45309',
    trend: 'Based on 156 reviews',
  },
];

export const ordersByStatus = {
  total: 184,
  statuses: [
    {
      label: 'Completed',
      count: 102,
      trend: '+12%',
      trendUp: true,
      bg: '#A1E5A1',
      textColor: '#1A4D1A',
    },
    {
      label: 'Active',
      count: 45,
      trend: '+8%',
      trendUp: true,
      bg: '#F5F5F5',
      border: true,
      textColor: '#2A2933',
    },
    {
      label: 'Incoming',
      count: 22,
      trend: '+5%',
      trendUp: true,
      bg: '#C9D6F0',
      textColor: '#001133',
    },
    {
      label: 'Pending',
      count: 7,
      trend: '-3%',
      trendUp: false,
      bg: '#FFD9B2',
      textColor: '#4D2700',
    },
    {
      label: 'Cancelled',
      count: 8,
      trend: '+1%',
      trendUp: true,
      bg: '#FFBFB2',
      textColor: '#590F00',
    },
  ],
};

export const recentTransactions = [
  {
    type: 'incoming' as const,
    title: 'Order #BK-1247 payment',
    time: 'Today · 09:15',
    amount: 350_000,
  },
  {
    type: 'incoming' as const,
    title: 'Order #BK-1246 payment',
    time: 'Today · 08:30',
    amount: 180_000,
  },
  {
    type: 'outgoing' as const,
    title: 'Refund #BK-1240',
    time: 'Yesterday · 16:20',
    amount: -120_000,
  },
  {
    type: 'incoming' as const,
    title: 'Order #BK-1244 payment',
    time: 'Yesterday · 14:10',
    amount: 220_000,
  },
];

export const alerts = [
  {
    icon: 'clock',
    iconBg: '#B45309',
    title: '3 orders expiring within 2 hours',
    description: 'BK-1246, BK-1245, BK-1243 need master assignment',
    actionLabel: 'Act now →',
    actionColor: '#B45309',
    bg: '#FFF6E9',
    titleColor: '#4D2700',
    descColor: '#A05A00',
  },
  {
    icon: 'alert-triangle',
    iconBg: '#CC3314',
    title: 'Employee document expiring',
    description: 'Bekzod R. — license expires in 7 days',
    actionLabel: 'Review →',
    actionColor: '#CC3314',
    bg: '#FDEBEC',
    titleColor: '#590F00',
    descColor: '#CC3314',
  },
  {
    icon: 'star',
    iconBg: '#5749F4',
    title: 'New 5-star review received',
    description: 'From Aziz Karimov — Brake pad replacement',
    actionLabel: 'View →',
    actionColor: '#5749F4',
    bg: '#EEF0FF',
    titleColor: '#2A2933',
    descColor: '#616167',
  },
];

export const weeklySummary = {
  trendPercent: 12,
  newOrders: { count: 42, trend: '+8%', trendUp: true },
  completed: { count: 38, trend: '+15%', trendUp: true },
  bottomStats: [
    { value: '12.4M', label: 'Revenue', color: '#2A2933' },
    { value: '18 min', label: 'Response', color: '#2A2933' },
    { value: '94%', label: 'Satisfaction', color: '#25603A' },
  ],
};
