import { useNavigate } from 'react-router-dom';
import {
  Bell,
  AlertTriangle,
  ClipboardList,
  FileCheck,
  MessageSquare,
  ChevronRight,
  MapPin,
  Building2,
  Calendar,
  User,
  Megaphone
} from 'lucide-react';
import { StatsCard } from '@/components/common/StatsCard';
import { StatusTag } from '@/components/common/StatusTag';
import { useAppStore } from '@/store';
import type { Hazard, InspectionPlan, SelfCheckRecord, Report, SupervisionRecord } from '@/types';

export default function TodoPage() {
  const navigate = useNavigate();
  const { hazards, inspectionPlans, selfCheckRecords, reports, units, supervisionRecords } = useAppStore();

  const pendingHazards = hazards.filter((h) => h.status === '待整改');
  const pendingPlans = inspectionPlans.filter((p) => p.status === '未开始');
  const pendingSelfChecks = selfCheckRecords.filter((r) => r.status === '待审核');
  const pendingReports = reports.filter((r) => r.status === '待受理');
  const pendingSupervisions = supervisionRecords.filter((r) => r.status === '待处理');

  const getUnitName = (unitId: string) => {
    const unit = units.find((u) => u.id === unitId);
    return unit ? unit.name : '未知单位';
  };

  const handleHazardClick = (hazardId?: string) => {
    if (hazardId) {
      navigate(`/hazards?highlightId=${hazardId}`);
    } else {
      navigate('/hazards');
    }
  };

  const handlePlanClick = (planId?: string) => {
    if (planId) {
      navigate(`/inspections?highlightId=${planId}`);
    } else {
      navigate('/inspections');
    }
  };

  const handleSelfCheckClick = (recordId?: string) => {
    if (recordId) {
      navigate(`/self-check?highlightId=${recordId}`);
    } else {
      navigate('/self-check');
    }
  };

  const handleReportClick = (reportId?: string) => {
    if (reportId) {
      navigate(`/reports?highlightId=${reportId}`);
    } else {
      navigate('/reports');
    }
  };

  const handleSupervisionClick = (hazardId?: string) => {
    if (hazardId) {
      navigate(`/hazards?highlightId=${hazardId}`);
    } else {
      navigate('/hazards');
    }
  };

  const getHazardDescription = (hazardId: string) => {
    const hazard = hazards.find((h) => h.id === hazardId);
    return hazard ? hazard.description : '未知隐患';
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard
          title="待整改隐患"
          value={pendingHazards.length}
          icon={AlertTriangle}
          color="red"
        />
        <StatsCard
          title="待开始计划"
          value={pendingPlans.length}
          icon={ClipboardList}
          color="amber"
        />
        <StatsCard
          title="待审核自查"
          value={pendingSelfChecks.length}
          icon={FileCheck}
          color="blue"
        />
        <StatsCard
          title="待受理举报"
          value={pendingReports.length}
          icon={MessageSquare}
          color="green"
        />
        <StatsCard
          title="待处理督办"
          value={pendingSupervisions.length}
          icon={Megaphone}
          color="blue"
        />
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">隐患待整改</h3>
                <p className="text-sm text-slate-500">共 {pendingHazards.length} 项待处理</p>
              </div>
            </div>
            <button
              onClick={() => handleHazardClick()}
              className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-700 font-medium"
            >
              查看全部
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="divide-y divide-slate-200">
            {pendingHazards.length > 0 ? (
              pendingHazards.slice(0, 5).map((hazard: Hazard) => (
                <div
                  key={hazard.id}
                  onClick={() => handleHazardClick(hazard.id)}
                  className="p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800 line-clamp-1">{hazard.description}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {hazard.location}
                        </p>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <Building2 className="w-3 h-3" />
                          {getUnitName(hazard.unitId)}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <StatusTag status={hazard.status} variant="hazard" />
                      <p className="text-xs text-slate-500">截止: {hazard.deadline}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center">
                <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">暂无待整改隐患</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">计划待开始</h3>
                <p className="text-sm text-slate-500">共 {pendingPlans.length} 项待开始</p>
              </div>
            </div>
            <button
              onClick={() => handlePlanClick()}
              className="inline-flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700 font-medium"
            >
              查看全部
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="divide-y divide-slate-200">
            {pendingPlans.length > 0 ? (
              pendingPlans.slice(0, 5).map((plan: InspectionPlan) => (
                <div
                  key={plan.id}
                  onClick={() => handlePlanClick(plan.id)}
                  className="p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <ClipboardList className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">{plan.name}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <Calendar className="w-3 h-3" />
                          {plan.startDate} ~ {plan.endDate}
                        </p>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <Building2 className="w-3 h-3" />
                          {plan.unitIds.length} 个单位
                        </p>
                      </div>
                    </div>
                    <StatusTag status={plan.status} variant="plan" />
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center">
                <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">暂无待开始计划</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <FileCheck className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">自查待审核</h3>
                <p className="text-sm text-slate-500">共 {pendingSelfChecks.length} 项待审核</p>
              </div>
            </div>
            <button
              onClick={() => handleSelfCheckClick()}
              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              查看全部
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="divide-y divide-slate-200">
            {pendingSelfChecks.length > 0 ? (
              pendingSelfChecks.slice(0, 5).map((record: SelfCheckRecord) => (
                <div
                  key={record.id}
                  onClick={() => handleSelfCheckClick(record.id)}
                  className="p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                        <FileCheck className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">{record.unitName} 自查记录</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <User className="w-3 h-3" />
                          {record.checker}
                        </p>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <Calendar className="w-3 h-3" />
                          {record.checkDate}
                        </p>
                      </div>
                    </div>
                    <StatusTag status={record.status} />
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center">
                <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">暂无待审核自查记录</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">举报待受理</h3>
                <p className="text-sm text-slate-500">共 {pendingReports.length} 项待受理</p>
              </div>
            </div>
            <button
              onClick={() => handleReportClick()}
              className="inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-700 font-medium"
            >
              查看全部
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="divide-y divide-slate-200">
            {pendingReports.length > 0 ? (
              pendingReports.slice(0, 5).map((report: Report) => (
                <div
                  key={report.id}
                  onClick={() => handleReportClick(report.id)}
                  className="p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="w-4 h-4 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800 line-clamp-1">{report.title}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {report.location}
                        </p>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <Calendar className="w-3 h-3" />
                          {report.createdAt}
                        </p>
                      </div>
                    </div>
                    <StatusTag status={report.status} variant="report" />
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center">
                <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">暂无待受理举报</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Megaphone className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">督办待处理</h3>
                <p className="text-sm text-slate-500">共 {pendingSupervisions.length} 项待处理</p>
              </div>
            </div>
            <button
              onClick={() => handleSupervisionClick()}
              className="inline-flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              查看全部
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="divide-y divide-slate-200">
            {pendingSupervisions.length > 0 ? (
              pendingSupervisions.slice(0, 5).map((record: SupervisionRecord) => (
                <div
                  key={record.id}
                  onClick={() => handleSupervisionClick(record.hazardId)}
                  className="p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <Megaphone className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800 line-clamp-1">{record.type} - {getHazardDescription(record.hazardId)}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <FileCheck className="w-3 h-3" />
                          {record.content}
                        </p>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <User className="w-3 h-3" />
                          接收人：{record.receiver}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <StatusTag status={record.status} variant="plan" />
                      <p className="text-xs text-slate-500">截止: {record.deadline}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center">
                <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">暂无待处理督办</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
