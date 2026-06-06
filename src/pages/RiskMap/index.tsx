import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  Layers,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  ChevronRight,
  Calendar,
  User,
  ClipboardList,
  FileCheck,
  X
} from 'lucide-react';
import { StatsCard } from '@/components/common/StatsCard';
import { StatusTag } from '@/components/common/StatusTag';
import { useAppStore } from '@/store';
import { mockHazardStats, mockMonthlyStats } from '@/utils/mock';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import type { Hazard, InspectionPlan, SelfCheckRecord } from '@/types';

const COLORS = ['#22c55e', '#f59e0b', '#ef4444'];

export default function RiskMapPage() {
  const navigate = useNavigate();
  const { units, hazards, inspectionPlans, selfCheckRecords } = useAppStore();
  const [selectedLayer, setSelectedLayer] = useState<'heatmap' | 'units' | 'hazards'>('heatmap');
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);

  const totalUnits = units.length;
  const totalHazards = hazards.length;
  const pendingHazards = hazards.filter((h) => h.status !== '已完成').length;
  const completedRate = Math.round(
    (hazards.filter((h) => h.status === '已完成').length / totalHazards) * 100
  );

  const unitHazards = (unitId: string) => hazards.filter((h) => h.unitId === unitId);

  const currentUnit = selectedUnit ? units.find((u) => u.id === selectedUnit) : null;

  const unitPendingHazards = selectedUnit
    ? hazards.filter((h) => h.unitId === selectedUnit && h.status !== '已完成').slice(0, 3)
    : [];

  const unitPendingPlans = selectedUnit
    ? inspectionPlans.filter((p) => p.unitIds.includes(selectedUnit) && p.status === '未开始').slice(0, 2)
    : [];

  const unitPendingSelfChecks = selectedUnit
    ? selfCheckRecords.filter((r) => r.unitId === selectedUnit && r.status === '待审核').slice(0, 2)
    : [];

  const handleHazardClick = (hazardId: string) => {
    navigate(`/hazards?highlightId=${hazardId}`);
  };

  const handlePlanClick = (planId: string) => {
    navigate(`/inspections?highlightId=${planId}`);
  };

  const handleSelfCheckClick = (recordId: string) => {
    navigate(`/self-check?highlightId=${recordId}`);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="监管单位总数"
          value={totalUnits}
          icon={Building2}
          color="blue"
          trend="较上月 +3"
          trendUp
        />
        <StatsCard
          title="隐患总数"
          value={totalHazards}
          icon={AlertTriangle}
          color="red"
          trend="较上月 +12"
          trendUp={false}
        />
        <StatsCard
          title="待整改隐患"
          value={pendingHazards}
          icon={Clock}
          color="amber"
          trend="较上月 -5"
          trendUp
        />
        <StatsCard
          title="隐患整改率"
          value={`${completedRate}%`}
          icon={CheckCircle2}
          color="green"
          trend="较上月 +8%"
          trendUp
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">区域风险分布</h2>
            <div className="flex items-center gap-2">
              <div className="flex bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setSelectedLayer('heatmap')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    selectedLayer === 'heatmap'
                      ? 'bg-white text-red-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  热力图
                </button>
                <button
                  onClick={() => setSelectedLayer('units')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    selectedLayer === 'units'
                      ? 'bg-white text-red-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  重点单位
                </button>
                <button
                  onClick={() => setSelectedLayer('hazards')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    selectedLayer === 'hazards'
                      ? 'bg-white text-red-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  隐患点
                </button>
              </div>
            </div>
          </div>

          <div className="relative h-[500px] bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="absolute inset-0 p-8">
              <div className="w-full h-full relative rounded-lg overflow-hidden border border-slate-200 bg-white">
                <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-yellow-50 to-red-100 opacity-60"></div>
                
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    <radialGradient id="risk1" cx="30%" cy="30%" r="25%">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="risk2" cx="70%" cy="60%" r="30%">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="risk3" cx="50%" cy="80%" r="20%">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <circle cx="30" cy="30" r="25" fill="url(#risk1)" />
                  <circle cx="70" cy="60" r="30" fill="url(#risk2)" />
                  <circle cx="50" cy="80" r="20" fill="url(#risk3)" />
                </svg>

                {units.map((unit, idx) => {
                  const x = 20 + (idx * 10) % 70;
                  const y = 20 + Math.floor(idx / 3) * 25;
                  const unitHazardCount = unitHazards(unit.id).length;
                  
                  return (
                    <button
                      key={unit.id}
                      onClick={() => setSelectedUnit(selectedUnit === unit.id ? null : unit.id)}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 group transition-all duration-200 ${
                        selectedUnit === unit.id ? 'z-20 scale-125' : 'z-10 hover:scale-110'
                      }`}
                      style={{ left: `${x}%`, top: `${y}%` }}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white ${
                          unitHazardCount > 3
                            ? 'bg-red-500'
                            : unitHazardCount > 0
                            ? 'bg-amber-500'
                            : 'bg-green-500'
                        }`}
                      >
                        <MapPin className="w-4 h-4 text-white" />
                      </div>
                      
                      <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-xs rounded-lg whitespace-nowrap pointer-events-none transition-opacity ${
                        selectedUnit === unit.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}>
                        <p className="font-medium">{unit.name}</p>
                        <p className="text-slate-300">{unit.address}</p>
                        <p className="text-amber-400 mt-1">隐患: {unitHazardCount} 项</p>
                        <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800"></div>
                      </div>
                    </button>
                  );
                })}

                <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                  <button className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors">
                    <ZoomIn className="w-5 h-5" />
                  </button>
                  <button className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors">
                    <ZoomOut className="w-5 h-5" />
                  </button>
                  <button className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors">
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>

                <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3">
                  <p className="text-xs font-medium text-slate-700 mb-2">风险等级</p>
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full bg-red-500"></span>
                      <span className="text-slate-600">高风险</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                      <span className="text-slate-600">中风险</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full bg-green-500"></span>
                      <span className="text-slate-600">低风险</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <h3 className="text-base font-semibold text-slate-800 mb-4">隐患等级分布</h3>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockHazardStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="level"
                  >
                    {mockHazardStats.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {currentUnit ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-800">{currentUnit.name}</h3>
                    <p className="text-xs text-slate-500">单位详情</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedUnit(null)}
                  className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-500" />
                    基本信息
                  </h4>
                  <div className="bg-slate-50 rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">单位类型</span>
                      <span className="text-xs font-medium text-slate-700">{currentUnit.type}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">单位地址</span>
                      <span className="text-xs font-medium text-slate-700">{currentUnit.address}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">风险等级</span>
                      <StatusTag status={currentUnit.level} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">联系人</span>
                      <span className="text-xs font-medium text-slate-700">{currentUnit.contact}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">联系电话</span>
                      <span className="text-xs font-medium text-slate-700">{currentUnit.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    当前未完成隐患
                    <span className="text-xs font-normal text-slate-500">({unitPendingHazards.length})</span>
                  </h4>
                  <div className="space-y-2">
                    {unitPendingHazards.length > 0 ? (
                      unitPendingHazards.map((hazard: Hazard) => (
                        <div
                          key={hazard.id}
                          onClick={() => handleHazardClick(hazard.id)}
                          className="p-3 bg-slate-50 rounded-lg hover:bg-amber-50 transition-colors cursor-pointer group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-slate-700 line-clamp-2 group-hover:text-amber-700">
                                {hazard.description}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <StatusTag status={hazard.status} variant="hazard" />
                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {hazard.deadline}
                                </span>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-500 flex-shrink-0 mt-0.5" />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-xs text-slate-500 bg-slate-50 rounded-lg">
                        暂无
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-blue-500" />
                    最近待开始检查计划
                    <span className="text-xs font-normal text-slate-500">({unitPendingPlans.length})</span>
                  </h4>
                  <div className="space-y-2">
                    {unitPendingPlans.length > 0 ? (
                      unitPendingPlans.map((plan: InspectionPlan) => (
                        <div
                          key={plan.id}
                          onClick={() => handlePlanClick(plan.id)}
                          className="p-3 bg-slate-50 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-slate-700 line-clamp-1 group-hover:text-blue-700">
                                {plan.name}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <StatusTag status={plan.status} variant="plan" />
                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {plan.startDate}
                                </span>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 flex-shrink-0 mt-0.5" />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-xs text-slate-500 bg-slate-50 rounded-lg">
                        暂无
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-green-500" />
                    待审核自查记录
                    <span className="text-xs font-normal text-slate-500">({unitPendingSelfChecks.length})</span>
                  </h4>
                  <div className="space-y-2">
                    {unitPendingSelfChecks.length > 0 ? (
                      unitPendingSelfChecks.map((record: SelfCheckRecord) => (
                        <div
                          key={record.id}
                          onClick={() => handleSelfCheckClick(record.id)}
                          className="p-3 bg-slate-50 rounded-lg hover:bg-green-50 transition-colors cursor-pointer group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-slate-700 line-clamp-1 group-hover:text-green-700">
                                {record.checkDate} 自查记录
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <StatusTag status={record.status} />
                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                  <User className="w-3 h-3" />
                                  {record.checker}
                                </span>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-green-500 flex-shrink-0 mt-0.5" />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-xs text-slate-500 bg-slate-50 rounded-lg">
                        暂无
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h3 className="text-base font-semibold text-slate-800 mb-4">重点关注单位</h3>
              <div className="space-y-3">
                {units
                  .filter((u) => u.level === '重点')
                  .slice(0, 4)
                  .map((unit) => (
                    <div
                      key={unit.id}
                      onClick={() => setSelectedUnit(unit.id)}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800">{unit.name}</p>
                          <p className="text-xs text-slate-500">{unit.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <StatusTag status={unit.level} />
                        <p className="text-xs text-slate-500 mt-1">
                          {unitHazards(unit.id).length} 项隐患
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <h3 className="text-base font-semibold text-slate-800 mb-4">月度隐患趋势</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockMonthlyStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar dataKey="hazards" name="发现隐患" fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="rectified" name="已整改" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="inspections" name="检查次数" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
