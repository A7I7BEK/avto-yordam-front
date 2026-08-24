export const bigStats = [
  {
    label: 'Total Revenue',
    value: '₴48.2M',
    icon: 'trending-up',
    iconBg: 'var(--success-bg)',
    iconColor: 'var(--success)',
    trend: '+12% vs last month',
  },
  {
    label: 'Total Orders',
    value: '184',
    icon: 'clipboard-list',
    iconBg: 'var(--primary-tint)',
    iconColor: 'var(--primary)',
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
    iconBg: 'var(--warning-bg)',
    iconColor: 'var(--warning)',
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
      bg: 'var(--color-success)',
      textColor: 'var(--color-success-foreground)',
    },
    {
      label: 'Active',
      count: 45,
      trend: '+8%',
      trendUp: true,
      bg: 'var(--muted)',
      border: true,
      textColor: 'var(--foreground)',
    },
    {
      label: 'Incoming',
      count: 22,
      trend: '+5%',
      trendUp: true,
      bg: 'var(--color-info)',
      textColor: 'var(--color-info-foreground)',
    },
    {
      label: 'Pending',
      count: 7,
      trend: '-3%',
      trendUp: false,
      bg: 'var(--color-warning)',
      textColor: 'var(--color-warning-foreground)',
    },
    {
      label: 'Cancelled',
      count: 8,
      trend: '+1%',
      trendUp: true,
      bg: 'var(--color-error)',
      textColor: 'var(--color-error-foreground)',
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
    iconBg: 'var(--warning)',
    title: '3 orders expiring within 2 hours',
    description: 'BK-1246, BK-1245, BK-1243 need master assignment',
    actionLabel: 'Act now →',
    actionColor: 'var(--warning)',
    bg: 'var(--warning-bg)',
    titleColor: 'var(--color-warning-foreground)',
    descColor: '#A05A00',
  },
  {
    icon: 'alert-triangle',
    iconBg: 'var(--destructive)',
    title: 'Employee document expiring',
    description: 'Bekzod R. — license expires in 7 days',
    actionLabel: 'Review →',
    actionColor: 'var(--destructive)',
    bg: 'var(--destructive-soft)',
    titleColor: 'var(--color-error-foreground)',
    descColor: 'var(--destructive)',
  },
  {
    icon: 'star',
    iconBg: 'var(--primary)',
    title: 'New 5-star review received',
    description: 'From Aziz Karimov — Brake pad replacement',
    actionLabel: 'View →',
    actionColor: 'var(--primary)',
    bg: 'var(--primary-tint)',
    titleColor: 'var(--foreground)',
    descColor: 'var(--muted-foreground)',
  },
];

export const weeklySummary = {
  trendPercent: 12,
  newOrders: { count: 42, trend: '+8%', trendUp: true },
  completed: { count: 38, trend: '+15%', trendUp: true },
  bottomStats: [
    { value: '12.4M', label: 'Revenue', color: 'var(--foreground)' },
    { value: '18 min', label: 'Response', color: 'var(--foreground)' },
    { value: '94%', label: 'Satisfaction', color: 'var(--success)' },
  ],
};
