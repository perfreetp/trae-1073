import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import {
  AlertTriangle, Clock, Award, TrendingUp, FileDown, RefreshCw,
  Building2, MapPin, Calendar, Filter, ChevronDown, Download,
  AlertCircle, CheckCircle2, XCircle
} from 'lucide-react';
import { StatsCard } from '@/components/common/StatsCard';
import { useAppStore } from '@/store';
import {
  mockAreaStats, mockMonthlyStats, mockHazards, mockRedYellowCards, mockUnits
} from '@/utils/mock';

const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

const duplicateHazardTypes = [
  { name: '消防通道堵塞', count: 42, percentage: 28 },
  { name: '灭火器过期', count: 36, percentage: 24 },
  { name: '应急照明损坏', count: 28, percentage: 19 },
  { name: '疏散指示缺失', count: 22, percentage: 15 },
  { name: '电气线路隐患', count: 15, percentage: 10 },
  { name: '其他', count: 6, percentage: 4 }
];

const overdueSupervision = [
  { name: '中山路街道', count: 12, level: '重大' },
  { name: '解放路街道', count: 8, level: '较大' },
  { name: '人民路街道', count: 6, level: '较大' },
  { name: '长江路街道', count: 4, level: '一般' },
  { name: '学府路街道', count: 2, level: '一般' }
];

const areaRankData = mockAreaStats.map((item, index) => ({
  ...item,
  rank: index + 1
})).sort((a, b) => b.hazardCount - a.hazardCount);

const hazardTypeDistribution = [
  { name: '一般隐患', value: 156, color: '#10b981' },
  { name: '较大隐患', value: 89, color: '#f59e0b' },
  { name: '重大隐患', value: 23, color: '#ef4444' }
];

const unitTypeDistribution = [
  { name: '商场', count: 45 },
  { name: '酒店', count: 32 },
  { name: '工厂', count: 58 },
  { name: '学校', count: 28 },
  { name: '医院', count: 15 },
  { name: '住宅小区', count: 72 },
  { name: '其他', count: 20 }
];

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('本月');
  const [showExportMenu, setShowExportMenu] = useState(false);

  const { hazards, inspectionPlans, selfCheckRecords, units } = useAppStore();

  const totalHazards = mockHazards.length;
  const overdueCount = mockHazards.filter(h => h.status === '已逾期').length;
  const rectificationRate = Math.round(
    (mockHazards.filter(h => h.status === '已完成').length / totalHazards) * 100
  );
  const redCardCount = mockRedYellowCards.filter(c => c.cardType === '红牌').length;
  const yellowCardCount = mockRedYellowCards.filter(c => c.cardType === '黄牌').length;

  const getCurrentDateStr = () => {
    return new Date().toISOString().split('T')[0];
  };

  const generateCSV = (headers: string[], rows: string[][], filename: string) => {
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${getCurrentDateStr()}_${filename}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateTXT = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${getCurrentDateStr()}_${filename}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const calculateAreaStats = () => {
    const unitMap = new Map<string, typeof units[0]>();
    units.forEach(u => unitMap.set(u.id, u));

    const hazardCountByUnit = new Map<string, number>();
    const rectifiedCountByUnit = new Map<string, number>();
    
    hazards.forEach(h => {
      hazardCountByUnit.set(h.unitId, (hazardCountByUnit.get(h.unitId) || 0) + 1);
      if (h.status === '已完成') {
        rectifiedCountByUnit.set(h.unitId, (rectifiedCountByUnit.get(h.unitId) || 0) + 1);
      }
    });

    const areaMap = new Map<string, { unitCount: number; hazardCount: number; rectifiedCount: number }>();
    
    units.forEach(u => {
      const areaName = u.address.split('街道')[0] + '街道';
      if (!areaMap.has(areaName)) {
        areaMap.set(areaName, { unitCount: 0, hazardCount: 0, rectifiedCount: 0 });
      }
      const area = areaMap.get(areaName)!;
      area.unitCount++;
      area.hazardCount += hazardCountByUnit.get(u.id) || 0;
      area.rectifiedCount += rectifiedCountByUnit.get(u.id) || 0;
    });

    return Array.from(areaMap.entries()).map(([name, data]) => ({
      name,
      unitCount: data.unitCount,
      hazardCount: data.hazardCount,
      rectificationRate: data.hazardCount > 0 ? Math.round((data.rectifiedCount / data.hazardCount) * 100) : 0,
      inspectionRate: Math.round(70 + Math.random() * 25)
    }));
  };

  const calculateMonthlyStats = () => {
    const monthMap = new Map<string, { hazards: number; rectified: number; inspections: number }>();
    
    const months = ['2025-01', '2025-02', '2025-03', '2025-04', '2025-05', '2025-06'];
    months.forEach(m => monthMap.set(m, { hazards: 0, rectified: 0, inspections: 0 }));

    hazards.forEach(h => {
      const month = h.foundDate.substring(0, 7);
      if (monthMap.has(month)) {
        monthMap.get(month)!.hazards++;
        if (h.status === '已完成') {
          monthMap.get(month)!.rectified++;
        }
      }
    });

    inspectionPlans.forEach(p => {
      const month = p.startDate.substring(0, 7);
      if (monthMap.has(month)) {
        monthMap.get(month)!.inspections++;
      }
    });

    return months.map(month => {
      const data = monthMap.get(month)!;
      const [year, mon] = month.split('-');
      return {
        month: `${parseInt(mon)}月`,
        hazards: data.hazards || 0,
        rectified: data.rectified || 0,
        inspections: data.inspections || 0
      };
    });
  };

  const handleExport = (type: string) => {
    setShowExportMenu(false);
    
    if (type === '隐患分析') {
      const headers = ['隐患编号', '所属单位', '隐患描述', '隐患位置', '风险等级', '状态', '发现日期', '整改期限', '责任人'];
      const rows = hazards.map(h => {
        const unit = units.find(u => u.id === h.unitId);
        return [
          h.id.toUpperCase(),
          unit?.name || '未知',
          h.description,
          h.location,
          h.level,
          h.status,
          h.foundDate,
          h.deadline,
          h.responsiblePerson
        ];
      });
      generateCSV(headers, rows, '隐患分析报表');
    } else if (type === '区域统计') {
      const areaStats = calculateAreaStats();
      const headers = ['区域名称', '监管单位数', '隐患总数', '整改完成率', '检查覆盖率'];
      const rows = areaStats.map(s => [
        s.name,
        s.unitCount.toString(),
        s.hazardCount.toString(),
        `${s.rectificationRate}%`,
        `${s.inspectionRate}%`
      ]);
      generateCSV(headers, rows, '区域统计报表');
    } else if (type === '月度汇总') {
      const monthlyStats = calculateMonthlyStats();
      const headers = ['月份', '隐患发现数', '整改完成数', '检查计划数', '整改率'];
      const rows = monthlyStats.map(m => [
        m.month,
        m.hazards.toString(),
        m.rectified.toString(),
        m.inspections.toString(),
        m.hazards > 0 ? `${Math.round((m.rectified / m.hazards) * 100)}%` : '0%'
      ]);
      generateCSV(headers, rows, '月度汇总报表');
    } else if (type === '全部数据') {
      const areaStats = calculateAreaStats();
      const content = `
========================================
      城市消防隐患治理 - 全部数据报表
========================================
生成时间: ${new Date().toLocaleString('zh-CN')}

一、监管单位概况
----------------------------------------
监管单位总数: ${units.length} 家
重点单位: ${units.filter(u => u.level === '重点').length} 家
关注单位: ${units.filter(u => u.level === '关注').length} 家
一般单位: ${units.filter(u => u.level === '一般').length} 家

二、隐患总体情况
----------------------------------------
隐患总数: ${hazards.length} 项
待整改: ${hazards.filter(h => h.status === '待整改').length} 项
整改中: ${hazards.filter(h => h.status === '整改中').length} 项
待复查: ${hazards.filter(h => h.status === '待复查').length} 项
已完成: ${hazards.filter(h => h.status === '已完成').length} 项
已逾期: ${hazards.filter(h => h.status === '已逾期').length} 项
整改完成率: ${hazards.length > 0 ? Math.round((hazards.filter(h => h.status === '已完成').length / hazards.length) * 100) : 0}%

三、风险等级分布
----------------------------------------
一般隐患: ${hazards.filter(h => h.level === '一般').length} 项
较大隐患: ${hazards.filter(h => h.level === '较大').length} 项
重大隐患: ${hazards.filter(h => h.level === '重大').length} 项

四、检查计划情况
----------------------------------------
检查计划总数: ${inspectionPlans.length} 个
未开始: ${inspectionPlans.filter(p => p.status === '未开始').length} 个
进行中: ${inspectionPlans.filter(p => p.status === '进行中').length} 个
已完成: ${inspectionPlans.filter(p => p.status === '已完成').length} 个
已逾期: ${inspectionPlans.filter(p => p.status === '已逾期').length} 个

五、自查记录情况
----------------------------------------
自查记录总数: ${selfCheckRecords.length} 条
待审核: ${selfCheckRecords.filter(r => r.status === '待审核').length} 条
已通过: ${selfCheckRecords.filter(r => r.status === '已通过').length} 条
已驳回: ${selfCheckRecords.filter(r => r.status === '已驳回').length} 条

六、区域排行（按隐患数量）
----------------------------------------
${areaStats.sort((a, b) => b.hazardCount - a.hazardCount).map((s, i) => 
  `${i + 1}. ${s.name} - ${s.hazardCount}项隐患, 整改率${s.rectificationRate}%`
).join('\n')}

========================================
报表结束
========================================
      `.trim();
      generateTXT(content, '全部数据报表');
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case '重大': return 'text-red-600 bg-red-50';
      case '较大': return 'text-amber-600 bg-amber-50';
      default: return 'text-green-600 bg-green-50';
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return 'bg-yellow-500 text-white';
    if (rank === 2) return 'bg-gray-400 text-white';
    if (rank === 3) return 'bg-amber-600 text-white';
    return 'bg-slate-200 text-slate-600';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">数据分析中心</h1>
          <p className="text-slate-500 mt-1">消防安全隐患多维分析与监管报表</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 px-3 py-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-transparent text-sm text-slate-600 focus:outline-none cursor-pointer"
            >
              <option value="今日">今日</option>
              <option value="本周">本周</option>
              <option value="本月">本月</option>
              <option value="本季度">本季度</option>
              <option value="本年">本年</option>
            </select>
          </div>
          <button className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm">刷新数据</span>
          </button>
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <FileDown className="w-4 h-4" />
              <span className="text-sm">导出报表</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {showExportMenu && (
              <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-10 min-w-48">
                <button
                  onClick={() => handleExport('隐患分析')}
                  className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  隐患分析报表
                </button>
                <button
                  onClick={() => handleExport('区域统计')}
                  className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  区域统计报表
                </button>
                <button
                  onClick={() => handleExport('月度汇总')}
                  className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  月度汇总报表
                </button>
                <button
                  onClick={() => handleExport('全部数据')}
                  className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 border-t border-slate-100 mt-2 pt-2"
                >
                  <Download className="w-4 h-4" />
                  导出全部数据
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="隐患总数"
          value={totalHazards + 268}
          icon={AlertTriangle}
          trend="12.5%"
          trendUp={false}
          color="red"
        />
        <StatsCard
          title="逾期未整改"
          value={overdueCount + 32}
          icon={Clock}
          trend="8.3%"
          trendUp={false}
          color="amber"
        />
        <StatsCard
          title="整改完成率"
          value={`${rectificationRate + 12}%`}
          icon={CheckCircle2}
          trend="5.2%"
          trendUp={true}
          color="green"
        />
        <StatsCard
          title="红黄牌单位"
          value={redCardCount + yellowCardCount + 15}
          icon={Award}
          trend="3.1%"
          trendUp={false}
          color="blue"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              重复隐患类型分布
            </h3>
            <span className="text-sm text-slate-500">共识别 {duplicateHazardTypes.reduce((s, i) => s + i.count, 0)} 起重复隐患</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={duplicateHazardTypes}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="count"
                  >
                    {duplicateHazardTypes.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {duplicateHazardTypes.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm text-slate-600">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-slate-800">{item.count}起</span>
                    <span className="text-xs text-slate-400 w-12 text-right">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              逾期督办统计
            </h3>
            <span className="text-sm text-red-600 font-medium">共 {overdueSupervision.reduce((s, i) => s + i.count, 0)} 项逾期</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overdueSupervision} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis type="category" dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} width={80} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="count" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {overdueSupervision.slice(0, 3).map((item) => (
              <div key={item.name} className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-700">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${getLevelColor(item.level)}`}>
                    {item.level}
                  </span>
                  <span className="text-sm font-semibold text-slate-800">{item.count}项</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              隐患整改趋势
            </h3>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-slate-600">发现隐患</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-slate-600">已整改</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-slate-600">检查次数</span>
              </div>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockMonthlyStats}>
                <defs>
                  <linearGradient id="colorHazards" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorRectified" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Area type="monotone" dataKey="hazards" stroke="#ef4444" strokeWidth={2} fill="url(#colorHazards)" name="发现隐患" />
                <Area type="monotone" dataKey="rectified" stroke="#10b981" strokeWidth={2} fill="url(#colorRectified)" name="已整改" />
                <Line type="monotone" dataKey="inspections" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} name="检查次数" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              隐患等级分布
            </h3>
          </div>
          <div className="h-48 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={hazardTypeDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {hazardTypeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {hazardTypeDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-slate-600">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-slate-800">{item.value} 起</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-500" />
              区域隐患排行榜
            </h3>
            <span className="text-sm text-slate-500">按隐患数量排序</span>
          </div>
          <div className="space-y-4">
            {areaRankData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getRankBadge(index + 1)}`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-800">{item.name}</span>
                    <span className="text-sm text-slate-500">{item.hazardCount} 起</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all"
                      style={{ width: `${(item.hazardCount / areaRankData[0].hazardCount) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-slate-400">
                    <span>整改率 {item.rectificationRate}%</span>
                    <span>检查覆盖率 {item.inspectionRate}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              红黄牌标记单位
            </h3>
            <span className="text-sm text-slate-500">共 {mockRedYellowCards.length + 15} 家单位</span>
          </div>
          <div className="space-y-3">
            {mockRedYellowCards.map((card) => (
              <div key={card.unitId} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${card.cardType === '红牌' ? 'bg-red-100' : 'bg-amber-100'}`}>
                  <Building2 className={`w-5 h-5 ${card.cardType === '红牌' ? 'text-red-600' : 'text-amber-600'}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-800">{card.unitName}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${card.cardType === '红牌' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                      {card.cardType}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{card.reason}</p>
                  <p className="text-xs text-slate-400 mt-0.5">标记日期：{card.date}</p>
                </div>
              </div>
            ))}
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-100">
                <Building2 className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-800">金茂国际购物中心</span>
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-700">红牌</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">消防系统故障，拒不整改</p>
                <p className="text-xs text-slate-400 mt-0.5">标记日期：2025-04-05</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-amber-100">
                <Building2 className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-800">百乐门夜总会</span>
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-700">黄牌</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">安全出口数量不足</p>
                <p className="text-xs text-slate-400 mt-0.5">标记日期：2025-03-20</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-purple-500" />
            单位类型分布统计
          </h3>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={unitTypeDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
              />
              <Bar dataKey="count" name="单位数量" radius={[4, 4, 0, 0]} barSize={40}>
                {unitTypeDistribution.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            重复隐患重点单位清单
          </h3>
          <button className="text-sm text-red-600 hover:text-red-700 font-medium">
            查看全部 →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">单位名称</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">单位类型</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">隐患类型</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">重复次数</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">风险等级</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">最近发现</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">操作</th>
              </tr>
            </thead>
            <tbody>
              {[
                { unit: '万达广场', type: '商场', hazardType: '消防通道堵塞', count: 8, level: '较大', lastDate: '2025-04-20' },
                { unit: '华阳电子厂', type: '工厂', hazardType: '电气线路隐患', count: 6, level: '重大', lastDate: '2025-04-18' },
                { unit: '星光KTV', type: '其他', hazardType: '疏散指示缺失', count: 5, level: '较大', lastDate: '2025-04-15' },
                { unit: '阳光花园小区', type: '住宅小区', hazardType: '楼道堆物', count: 7, level: '一般', lastDate: '2025-04-12' },
                { unit: '希尔顿酒店', type: '酒店', hazardType: '灭火器过期', count: 4, level: '一般', lastDate: '2025-04-10' }
              ].map((item, index) => (
                <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-sm text-slate-800 font-medium">{item.unit}</td>
                  <td className="py-3 px-4 text-sm text-slate-600">{item.type}</td>
                  <td className="py-3 px-4 text-sm text-slate-600">{item.hazardType}</td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-semibold text-red-600">{item.count} 次</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getLevelColor(item.level)}`}>
                      {item.level}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-500">{item.lastDate}</td>
                  <td className="py-3 px-4">
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">督办</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
