import { useState, useMemo } from 'react';
import {
  Calendar,
  Table,
  Plus,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Clock,
  Building2,
  User,
  FileText,
  Settings,
  Edit2,
  Trash2,
  Eye,
  X,
  Check,
  GripVertical,
  AlertCircle,
  Save
} from 'lucide-react';
import { StatusTag } from '@/components/common/StatusTag';
import { StatsCard } from '@/components/common/StatsCard';
import { mockUnits, mockCheckLists } from '@/utils/mock';
import { useAppStore } from '@/store';
import type { InspectionPlan, CheckList, CheckItem, PlanType } from '@/types';
import { cn } from '@/lib/utils';

type ViewMode = 'calendar' | 'table';

interface CheckItemAnswer {
  itemId: string;
  answer: string | string[];
  remark?: string;
}

export default function InspectionsPage() {
  const {
    inspectionPlans,
    units,
    addInspectionPlan,
    updateInspectionPlan,
    deleteInspectionPlan
  } = useAppStore();

  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedPlan, setSelectedPlan] = useState<InspectionPlan | null>(null);
  const [showChecklistModal, setShowChecklistModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showInspectionForm, setShowInspectionForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<InspectionPlan | null>(null);
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('全部');

  const [formData, setFormData] = useState({
    name: '',
    type: '日常检查' as PlanType,
    startDate: '',
    endDate: '',
    unitIds: [] as string[],
    inspector: ''
  });

  const [answers, setAnswers] = useState<CheckItemAnswer[]>([]);

  const filteredPlans = useMemo(() => {
    return inspectionPlans.filter((plan) => {
      const matchesSearch = plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.type.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === '全部' || plan.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter, inspectionPlans]);

  const totalPlans = inspectionPlans.length;
  const pendingPlans = inspectionPlans.filter((p) => p.status === '未开始').length;
  const inProgressPlans = inspectionPlans.filter((p) => p.status === '进行中').length;
  const completedPlans = inspectionPlans.filter((p) => p.status === '已完成').length;

  const getUnitNames = (unitIds: string[]) => {
    return unitIds
      .map((id) => units.find((u) => u.id === id)?.name || mockUnits.find((u) => u.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const getPlansForDate = (date: Date) => {
    return filteredPlans.filter((plan) => {
      const startDate = new Date(plan.startDate);
      const endDate = new Date(plan.endDate);
      return date >= startDate && date <= endDate;
    });
  };

  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const handleOpenNewPlan = () => {
    setEditingPlan(null);
    setFormData({
      name: '',
      type: '日常检查',
      startDate: '',
      endDate: '',
      unitIds: [],
      inspector: ''
    });
    setShowPlanModal(true);
  };

  const handleOpenEditPlan = (plan: InspectionPlan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      type: plan.type,
      startDate: plan.startDate,
      endDate: plan.endDate,
      unitIds: plan.unitIds,
      inspector: plan.inspector || ''
    });
    setShowPlanModal(true);
  };

  const handleSavePlan = () => {
    if (!formData.name || !formData.startDate || !formData.endDate || formData.unitIds.length === 0) {
      return;
    }

    if (editingPlan) {
      updateInspectionPlan(editingPlan.id, formData);
    } else {
      addInspectionPlan(formData);
    }
    setShowPlanModal(false);
  };

  const handleDeleteClick = (planId: string) => {
    setPlanToDelete(planId);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (planToDelete) {
      deleteInspectionPlan(planToDelete);
    }
    setShowDeleteConfirm(false);
    setPlanToDelete(null);
    if (selectedPlan?.id === planToDelete) {
      setSelectedPlan(null);
    }
  };

  const handleStartInspection = (plan: InspectionPlan) => {
    setSelectedPlan(plan);
    setAnswers(mockCheckLists[0].items.map((item) => ({
      itemId: item.id,
      answer: item.type === 'multiple' ? [] : '',
      remark: ''
    })));
    setShowInspectionForm(true);
  };

  const handleSubmitInspection = () => {
    if (!selectedPlan) return;

    const allRequiredAnswered = mockCheckLists[0].items
      .filter((item) => item.required)
      .every((item) => {
        const answer = answers.find((a) => a.itemId === item.id);
        if (item.type === 'multiple') {
          return answer && Array.isArray(answer.answer) && answer.answer.length > 0;
        }
        return answer && answer.answer !== '';
      });

    if (!allRequiredAnswered) {
      alert('请填写所有必填项');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const isCompleted = today >= selectedPlan.endDate;

    updateInspectionPlan(selectedPlan.id, {
      status: isCompleted ? '已完成' : '进行中'
    });

    setShowInspectionForm(false);
    setSelectedPlan(null);
  };

  const handleAnswerChange = (itemId: string, value: string | string[], remark?: string) => {
    setAnswers((prev) =>
      prev.map((a) =>
        a.itemId === itemId
          ? { ...a, answer: value, remark: remark ?? a.remark }
          : a
      )
    );
  };

  const handleRemarkChange = (itemId: string, remark: string) => {
    setAnswers((prev) =>
      prev.map((a) =>
        a.itemId === itemId
          ? { ...a, remark }
          : a
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="检查计划总数"
          value={totalPlans}
          icon={FileText}
          color="blue"
          trend="本月 +2"
          trendUp
        />
        <StatsCard
          title="待开始计划"
          value={pendingPlans}
          icon={Clock}
          color="blue"
          trend="较上月 -1"
          trendUp
        />
        <StatsCard
          title="进行中计划"
          value={inProgressPlans}
          icon={Building2}
          color="amber"
          trend="较上月 +1"
          trendUp
        />
        <StatsCard
          title="已完成计划"
          value={completedPlans}
          icon={Check}
          color="green"
          trend="完成率 75%"
          trendUp
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">检查计划管理</h2>
              <p className="text-sm text-slate-500 mt-1">管理消防检查计划，配置检查表</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowChecklistModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span className="text-sm font-medium">检查表配置</span>
              </button>
              <button
                onClick={handleOpenNewPlan}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">新建计划</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="搜索计划名称、类型..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
                >
                  <option value="全部">全部状态</option>
                  <option value="未开始">未开始</option>
                  <option value="进行中">进行中</option>
                  <option value="已完成">已完成</option>
                  <option value="已逾期">已逾期</option>
                </select>
              </div>
            </div>

            <div className="flex bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('calendar')}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors',
                  viewMode === 'calendar'
                    ? 'bg-white text-red-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-800'
                )}
              >
                <Calendar className="w-4 h-4" />
                日历视图
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors',
                  viewMode === 'table'
                    ? 'bg-white text-red-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-800'
                )}
              >
                <Table className="w-4 h-4" />
                表格视图
              </button>
            </div>
          </div>
        </div>

        {viewMode === 'calendar' ? (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">
                {currentMonth.getFullYear()}年 {monthNames[currentMonth.getMonth()]}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={prevMonth}
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-slate-600" />
                </button>
                <button
                  onClick={() => setCurrentMonth(new Date())}
                  className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  今天
                </button>
                <button
                  onClick={nextMonth}
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="p-2 text-center text-sm font-medium text-slate-500 bg-slate-50"
                >
                  {day}
                </div>
              ))}
              {getDaysInMonth(currentMonth).map((date, index) => {
                const plans = date ? getPlansForDate(date) : [];
                return (
                  <div
                    key={index}
                    className={cn(
                      'min-h-[100px] p-2 border border-slate-100',
                      date ? 'bg-white hover:bg-slate-50' : 'bg-slate-50',
                      isToday(date) && 'ring-2 ring-red-500 ring-inset'
                    )}
                  >
                    {date && (
                      <>
                        <span
                          className={cn(
                            'text-sm font-medium',
                            isToday(date) ? 'text-red-600' : 'text-slate-700'
                          )}
                        >
                          {date.getDate()}
                        </span>
                        <div className="mt-1 space-y-1">
                          {plans.slice(0, 2).map((plan) => (
                            <div
                              key={plan.id}
                              onClick={() => setSelectedPlan(plan)}
                              className={cn(
                                'text-xs p-1.5 rounded cursor-pointer truncate',
                                plan.status === '已完成'
                                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                  : plan.status === '进行中'
                                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                  : plan.status === '已逾期'
                                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              )}
                              title={plan.name}
                            >
                              {plan.name}
                            </div>
                          ))}
                          {plans.length > 2 && (
                            <div className="text-xs text-slate-500 pl-1">
                              +{plans.length - 2} 更多
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    计划名称
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    类型
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    检查单位
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    时间范围
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    负责人
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredPlans.map((plan) => (
                  <tr
                    key={plan.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800">{plan.name}</p>
                          <p className="text-xs text-slate-500">创建于 {plan.createdAt}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                        {plan.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-700 max-w-[200px] truncate" title={getUnitNames(plan.unitIds)}>
                        {getUnitNames(plan.unitIds)}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {plan.unitIds.length} 个单位
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-700">
                        {plan.startDate} ~ {plan.endDate}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-slate-200 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-slate-500" />
                        </div>
                        <span className="text-sm text-slate-700">{plan.inspector || '-'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusTag status={plan.status} variant="plan" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedPlan(plan)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="查看详情"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEditPlan(plan)}
                          className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="编辑"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(plan.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="删除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedPlan && !showInspectionForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">计划详情</h3>
              <button
                onClick={() => setSelectedPlan(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div>
                <h4 className="text-sm font-medium text-slate-500 mb-2">计划名称</h4>
                <p className="text-lg font-semibold text-slate-800">{selectedPlan.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-slate-500 mb-2">计划类型</h4>
                  <p className="text-slate-800">{selectedPlan.type}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-500 mb-2">状态</h4>
                  <StatusTag status={selectedPlan.status} variant="plan" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-500 mb-2">开始日期</h4>
                  <p className="text-slate-800">{selectedPlan.startDate}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-500 mb-2">结束日期</h4>
                  <p className="text-slate-800">{selectedPlan.endDate}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-500 mb-2">负责人</h4>
                  <p className="text-slate-800">{selectedPlan.inspector || '-'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-500 mb-2">创建时间</h4>
                  <p className="text-slate-800">{selectedPlan.createdAt}</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-500 mb-3">检查单位 ({selectedPlan.unitIds.length})</h4>
                <div className="space-y-2">
                  {selectedPlan.unitIds.map((unitId) => {
                    const unit = units.find((u) => u.id === unitId) || mockUnits.find((u) => u.id === unitId);
                    return unit ? (
                      <div
                        key={unitId}
                        className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"
                      >
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                          <Building2 className="w-4 h-4 text-red-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800">{unit.name}</p>
                          <p className="text-xs text-slate-500">{unit.address}</p>
                        </div>
                        <div className="ml-auto">
                          <StatusTag status={unit.level} />
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setSelectedPlan(null)}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                关闭
              </button>
              <button
                onClick={() => handleStartInspection(selectedPlan)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                开始检查
              </button>
            </div>
          </div>
        </div>
      )}

      {showPlanModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">
                {editingPlan ? '编辑计划' : '新建计划'}
              </h3>
              <button
                onClick={() => setShowPlanModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  计划名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="请输入计划名称"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  计划类型 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as PlanType })}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
                >
                  <option value="日常检查">日常检查</option>
                  <option value="专项检查">专项检查</option>
                  <option value="季度检查">季度检查</option>
                  <option value="年度检查">年度检查</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    开始日期 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    结束日期 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  检查单位 <span className="text-red-500">*</span>
                </label>
                <div className="border border-slate-200 rounded-lg p-3 max-h-40 overflow-y-auto space-y-2">
                  {(units.length > 0 ? units : mockUnits).map((unit) => (
                    <label key={unit.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.unitIds.includes(unit.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({ ...formData, unitIds: [...formData.unitIds, unit.id] });
                          } else {
                            setFormData({ ...formData, unitIds: formData.unitIds.filter((id) => id !== unit.id) });
                          }
                        }}
                        className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500"
                      />
                      <span className="text-sm text-slate-700">{unit.name}</span>
                      <span className="text-xs text-slate-400">({unit.type})</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  负责人
                </label>
                <input
                  type="text"
                  value={formData.inspector}
                  onChange={(e) => setFormData({ ...formData, inspector: e.target.value })}
                  placeholder="请输入负责人姓名"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setShowPlanModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSavePlan}
                disabled={!formData.name || !formData.startDate || !formData.endDate || formData.unitIds.length === 0}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">确认删除</h3>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-slate-800 font-medium">确定要删除这个检查计划吗？</p>
                  <p className="text-sm text-slate-500 mt-1">此操作不可撤销</p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      {showInspectionForm && selectedPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">检查表填写</h3>
                <p className="text-sm text-slate-500 mt-1">{selectedPlan.name}</p>
              </div>
              <button
                onClick={() => {
                  setShowInspectionForm(false);
                  setSelectedPlan(null);
                }}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {mockCheckLists[0].items.map((item, index) => {
                const answer = answers.find((a) => a.itemId === item.id);
                return (
                  <div key={item.id} className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-start gap-3 mb-3">
                      <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-800">
                          {item.question}
                          {item.required && <span className="text-red-500 ml-1">*</span>}
                        </p>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-white text-slate-600 border border-slate-200 mt-2">
                          {item.type === 'single' ? '单选题' : item.type === 'multiple' ? '多选题' : '问答题'}
                        </span>
                      </div>
                    </div>

                    {item.type === 'single' && item.options && (
                      <div className="ml-9 space-y-2">
                        {item.options.map((option, optIndex) => (
                          <label key={optIndex} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={item.id}
                              value={option}
                              checked={answer?.answer === option}
                              onChange={(e) => handleAnswerChange(item.id, e.target.value)}
                              className="w-4 h-4 text-red-600 border-slate-300 focus:ring-red-500"
                            />
                            <span className="text-sm text-slate-700">
                              {String.fromCharCode(65 + optIndex)}. {option}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}

                    {item.type === 'multiple' && item.options && (
                      <div className="ml-9 space-y-2">
                        {item.options.map((option, optIndex) => (
                          <label key={optIndex} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={Array.isArray(answer?.answer) && answer.answer.includes(option)}
                              onChange={(e) => {
                                const currentAnswers = Array.isArray(answer?.answer) ? answer.answer : [];
                                if (e.target.checked) {
                                  handleAnswerChange(item.id, [...currentAnswers, option]);
                                } else {
                                  handleAnswerChange(item.id, currentAnswers.filter((a) => a !== option));
                                }
                              }}
                              className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500"
                            />
                            <span className="text-sm text-slate-700">
                              {String.fromCharCode(65 + optIndex)}. {option}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}

                    {item.type === 'text' && (
                      <div className="ml-9">
                        <textarea
                          value={(answer?.answer as string) || ''}
                          onChange={(e) => handleAnswerChange(item.id, e.target.value)}
                          placeholder="请输入您的回答..."
                          rows={3}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                        />
                      </div>
                    )}

                    <div className="ml-9 mt-3">
                      <label className="block text-xs font-medium text-slate-500 mb-1">
                        备注
                      </label>
                      <input
                        type="text"
                        value={answer?.remark || ''}
                        onChange={(e) => handleRemarkChange(item.id, e.target.value)}
                        placeholder="添加备注（可选）"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end gap-3 flex-shrink-0">
              <button
                onClick={() => {
                  setShowInspectionForm(false);
                  setSelectedPlan(null);
                }}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSubmitInspection}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                提交检查
              </button>
            </div>
          </div>
        </div>
      )}

      {showChecklistModal && (
        <ChecklistModal onClose={() => setShowChecklistModal(false)} />
      )}
    </div>
  );
}

function ChecklistModal({ onClose }: { onClose: () => void }) {
  const [checklists, setChecklists] = useState<CheckList[]>(mockCheckLists);
  const [selectedChecklist, setSelectedChecklist] = useState<CheckList | null>(mockCheckLists[0]);
  const [editingItem, setEditingItem] = useState<CheckItem | null>(null);
  const [showAddItem, setShowAddItem] = useState(false);

  const handleAddItem = (item: Omit<CheckItem, 'id'>) => {
    if (!selectedChecklist) return;
    const newItem: CheckItem = {
      ...item,
      id: `item-${Date.now()}`
    };
    const updatedChecklist = {
      ...selectedChecklist,
      items: [...selectedChecklist.items, newItem]
    };
    setSelectedChecklist(updatedChecklist);
    setChecklists(checklists.map((c) => (c.id === updatedChecklist.id ? updatedChecklist : c)));
    setShowAddItem(false);
  };

  const handleDeleteItem = (itemId: string) => {
    if (!selectedChecklist) return;
    const updatedChecklist = {
      ...selectedChecklist,
      items: selectedChecklist.items.filter((i) => i.id !== itemId)
    };
    setSelectedChecklist(updatedChecklist);
    setChecklists(checklists.map((c) => (c.id === updatedChecklist.id ? updatedChecklist : c)));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">检查表配置</h3>
            <p className="text-sm text-slate-500 mt-1">管理消防检查模板和检查项</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-72 border-r border-slate-200 bg-slate-50 flex flex-col flex-shrink-0">
            <div className="p-4 border-b border-slate-200">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                <Plus className="w-4 h-4" />
                新建检查表
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {checklists.map((checklist) => (
                <button
                  key={checklist.id}
                  onClick={() => setSelectedChecklist(checklist)}
                  className={cn(
                    'w-full text-left p-3 rounded-lg transition-colors',
                    selectedChecklist?.id === checklist.id
                      ? 'bg-white shadow-sm border border-red-200'
                      : 'hover:bg-white border border-transparent'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <FileText className={cn(
                      'w-4 h-4 flex-shrink-0',
                      selectedChecklist?.id === checklist.id ? 'text-red-600' : 'text-slate-400'
                    )} />
                    <span className={cn(
                      'text-sm font-medium truncate',
                      selectedChecklist?.id === checklist.id ? 'text-slate-800' : 'text-slate-600'
                    )}>
                      {checklist.name}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 ml-6">
                    {checklist.items.length} 个检查项
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            {selectedChecklist ? (
              <>
                <div className="p-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
                  <div>
                    <h4 className="text-base font-semibold text-slate-800">{selectedChecklist.name}</h4>
                    <p className="text-sm text-slate-500">共 {selectedChecklist.items.length} 个检查项</p>
                  </div>
                  <button
                    onClick={() => setShowAddItem(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    添加检查项
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  {selectedChecklist.items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <AlertCircle className="w-12 h-12 text-slate-300 mb-3" />
                      <p className="text-slate-500">暂无检查项</p>
                      <button
                        onClick={() => setShowAddItem(true)}
                        className="mt-3 text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        添加第一个检查项
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedChecklist.items.map((item, index) => (
                        <div
                          key={item.id}
                          className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors group"
                        >
                          <div className="flex items-center gap-2 mt-1">
                            <GripVertical className="w-4 h-4 text-slate-300 cursor-move" />
                            <span className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-xs font-medium text-slate-600">
                              {index + 1}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-800">{item.question}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-white text-slate-600 border border-slate-200">
                                {item.type === 'single' ? '单选题' : item.type === 'multiple' ? '多选题' : '问答题'}
                              </span>
                              {item.required && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-600">
                                  必填
                                </span>
                              )}
                              {item.options && (
                                <span className="text-xs text-slate-500">
                                  {item.options.length} 个选项
                                </span>
                              )}
                            </div>
                            {item.options && item.options.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {item.options.map((option, optIndex) => (
                                  <span
                                    key={optIndex}
                                    className="text-xs px-2 py-1 bg-white rounded border border-slate-200 text-slate-600"
                                  >
                                    {String.fromCharCode(65 + optIndex)}. {option}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => setEditingItem(item)}
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <FileText className="w-16 h-16 text-slate-200 mb-4" />
                <p className="text-slate-500">选择一个检查表进行编辑</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 flex justify-end gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            保存配置
          </button>
        </div>
      </div>

      {showAddItem && (
        <AddItemModal
          onClose={() => setShowAddItem(false)}
          onSave={handleAddItem}
        />
      )}

      {editingItem && (
        <AddItemModal
          initialData={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={(data) => {
            if (!selectedChecklist) return;
            const updatedItem = { ...data, id: editingItem.id };
            const updatedChecklist = {
              ...selectedChecklist,
              items: selectedChecklist.items.map((i) =>
                i.id === editingItem.id ? updatedItem : i
              )
            };
            setSelectedChecklist(updatedChecklist);
            setChecklists(checklists.map((c) => (c.id === updatedChecklist.id ? updatedChecklist : c)));
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
}

function AddItemModal({
  initialData,
  onClose,
  onSave
}: {
  initialData?: CheckItem;
  onClose: () => void;
  onSave: (item: Omit<CheckItem, 'id'>) => void;
}) {
  const [question, setQuestion] = useState(initialData?.question || '');
  const [type, setType] = useState<'single' | 'multiple' | 'text'>(initialData?.type || 'single');
  const [required, setRequired] = useState(initialData?.required ?? true);
  const [options, setOptions] = useState<string[]>(initialData?.options || ['是', '否']);

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSave = () => {
    if (!question.trim()) return;
    onSave({
      question: question.trim(),
      type,
      required,
      options: type !== 'text' ? options.filter((o) => o.trim()) : undefined
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <h4 className="text-base font-semibold text-slate-800">
            {initialData ? '编辑检查项' : '添加检查项'}
          </h4>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              检查问题 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="请输入检查问题..."
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              题目类型
            </label>
            <div className="flex gap-3">
              {[
                { value: 'single', label: '单选题' },
                { value: 'multiple', label: '多选题' },
                { value: 'text', label: '问答题' }
              ].map((t) => (
                <button
                  key={t.value}
                  onClick={() => setType(t.value as 'single' | 'multiple' | 'text')}
                  className={cn(
                    'flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors border',
                    type === t.value
                      ? 'bg-red-50 border-red-200 text-red-700'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {type !== 'text' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                选项设置
              </label>
              <div className="space-y-2">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-xs font-medium text-slate-500 flex-shrink-0">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`选项 ${index + 1}`}
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    {options.length > 2 && (
                      <button
                        onClick={() => handleRemoveOption(index)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={handleAddOption}
                className="mt-2 text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                添加选项
              </button>
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={() => setRequired(!required)}
              className={cn(
                'w-11 h-6 rounded-full transition-colors relative',
                required ? 'bg-red-600' : 'bg-slate-300'
              )}
            >
              <span
                className={cn(
                  'absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform',
                  required ? 'translate-x-5' : 'translate-x-0.5'
                )}
              />
            </button>
            <span className="text-sm text-slate-700">设为必填项</span>
          </div>
        </div>

        <div className="p-5 border-t border-slate-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            disabled={!question.trim()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}
