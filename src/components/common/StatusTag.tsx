import { cn } from '@/lib/utils';

interface StatusTagProps {
  status: string;
  variant?: 'default' | 'hazard' | 'plan' | 'report' | 'training' | 'attendee' | 'drill' | 'exam';
}

const statusColors: Record<string, Record<string, string>> = {
  hazard: {
    '待整改': 'bg-red-100 text-red-700 border-red-200',
    '整改中': 'bg-amber-100 text-amber-700 border-amber-200',
    '待复查': 'bg-blue-100 text-blue-700 border-blue-200',
    '已完成': 'bg-green-100 text-green-700 border-green-200',
    '已逾期': 'bg-red-600 text-white border-red-700'
  },
  plan: {
    '未开始': 'bg-slate-100 text-slate-600 border-slate-200',
    '进行中': 'bg-blue-100 text-blue-700 border-blue-200',
    '已完成': 'bg-green-100 text-green-700 border-green-200',
    '已逾期': 'bg-red-100 text-red-700 border-red-200'
  },
  report: {
    '待受理': 'bg-slate-100 text-slate-600 border-slate-200',
    '处理中': 'bg-amber-100 text-amber-700 border-amber-200',
    '已处理': 'bg-blue-100 text-blue-700 border-blue-200',
    '已结案': 'bg-green-100 text-green-700 border-green-200'
  },
  default: {
    '重点': 'bg-red-100 text-red-700 border-red-200',
    '一般': 'bg-green-100 text-green-700 border-green-200',
    '关注': 'bg-amber-100 text-amber-700 border-amber-200',
    '正常': 'bg-green-100 text-green-700 border-green-200',
    '过期': 'bg-red-100 text-red-700 border-red-200',
    '维修中': 'bg-amber-100 text-amber-700 border-amber-200',
    '缺失': 'bg-red-600 text-white border-red-700',
    '一般隐患': 'bg-amber-100 text-amber-700 border-amber-200',
    '较大隐患': 'bg-orange-100 text-orange-700 border-orange-200',
    '重大隐患': 'bg-red-100 text-red-700 border-red-200'
  },
  training: {
    '未开始': 'bg-slate-100 text-slate-600 border-slate-200',
    '进行中': 'bg-blue-100 text-blue-700 border-blue-200',
    '已结束': 'bg-green-100 text-green-700 border-green-200'
  },
  attendee: {
    '已签到': 'bg-green-100 text-green-700 border-green-200',
    '未签到': 'bg-red-100 text-red-700 border-red-200',
    '已签退': 'bg-blue-100 text-blue-700 border-blue-200'
  },
  drill: {
    '优秀': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    '良好': 'bg-blue-100 text-blue-700 border-blue-200',
    '合格': 'bg-amber-100 text-amber-700 border-amber-200',
    '不合格': 'bg-red-100 text-red-700 border-red-200'
  },
  exam: {
    '已通过': 'bg-green-100 text-green-700 border-green-200',
    '未通过': 'bg-red-100 text-red-700 border-red-200'
  }
};

export function StatusTag({ status, variant = 'default' }: StatusTagProps) {
  const colors = statusColors[variant] || statusColors.default;
  const colorClass = colors[status] || 'bg-slate-100 text-slate-600 border-slate-200';

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        colorClass
      )}
    >
      {status}
    </span>
  );
}
