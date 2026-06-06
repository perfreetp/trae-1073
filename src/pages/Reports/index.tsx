import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit2,
  X,
  Check,
  Clock,
  FileText,
  User,
  Phone,
  MapPin,
  Calendar,
  MessageSquare,
  Send,
  UserCheck,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Image
} from 'lucide-react';
import { StatusTag } from '@/components/common/StatusTag';
import { StatsCard } from '@/components/common/StatsCard';
import { useAppStore } from '@/store';
import type { Report, ReportStatus } from '@/types';
import { cn } from '@/lib/utils';

type FlowStep = {
  status: ReportStatus;
  title: string;
  description: string;
  time?: string;
  operator?: string;
};

const handleFlowSteps: FlowStep[] = [
  { status: '待受理', title: '举报登记', description: '群众举报信息已录入系统' },
  { status: '处理中', title: '分派处理', description: '已分派给相关负责人处理' },
  { status: '已处理', title: '处理反馈', description: '负责人已反馈处理结果' },
  { status: '已结案', title: '结案归档', description: '举报已处理完成并归档' }
];

const mockHandlers = ['王专干', '李消防', '赵监督员', '张科员'];

export default function ReportsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { reports, addReport, updateReport } = useAppStore();
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('全部');

  const [registerForm, setRegisterForm] = useState({
    title: '',
    reporterName: '',
    reporterPhone: '',
    location: '',
    description: ''
  });

  const [assignForm, setAssignForm] = useState({
    handler: ''
  });

  const [feedbackForm, setFeedbackForm] = useState({
    handleResult: ''
  });

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === '全部' || report.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [reports, searchQuery, statusFilter]);

  const totalReports = reports.length;
  const pendingReports = reports.filter((r) => r.status === '待受理').length;
  const processingReports = reports.filter((r) => r.status === '处理中').length;
  const closedReports = reports.filter((r) => r.status === '已结案').length;

  const handleViewDetail = (report: Report) => {
    setSelectedReport(report);
    setShowDetailModal(true);
  };

  useEffect(() => {
    const highlightId = searchParams.get('highlightId');
    if (highlightId) {
      const report = reports.find((r) => r.id === highlightId);
      if (report) {
        handleViewDetail(report);
        setSearchParams({}, { replace: true });
      }
    }
  }, [reports, searchParams, setSearchParams]);

  const handleRegister = () => {
    if (!registerForm.title || !registerForm.location || !registerForm.description) return;
    
    const newReport: Report = {
      id: `r${Date.now()}`,
      title: registerForm.title,
      reporterName: registerForm.reporterName || '匿名',
      reporterPhone: registerForm.reporterPhone,
      location: registerForm.location,
      description: registerForm.description,
      images: [],
      status: '待受理',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    
    addReport(newReport);
    setShowRegisterModal(false);
    setRegisterForm({ title: '', reporterName: '', reporterPhone: '', location: '', description: '' });
  };

  const handleAssign = () => {
    if (!selectedReport || !assignForm.handler) return;
    
    const updatedData = {
      status: '处理中' as ReportStatus,
      handler: assignForm.handler,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    
    updateReport(selectedReport.id, updatedData);
    setSelectedReport({ ...selectedReport, ...updatedData });
    setShowAssignModal(false);
    setAssignForm({ handler: '' });
  };

  const handleFeedback = () => {
    if (!selectedReport || !feedbackForm.handleResult) return;
    
    const updatedData = {
      status: '已处理' as ReportStatus,
      handleResult: feedbackForm.handleResult,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    
    updateReport(selectedReport.id, updatedData);
    setSelectedReport({ ...selectedReport, ...updatedData });
    setShowFeedbackModal(false);
    setFeedbackForm({ handleResult: '' });
  };

  const handleCloseCase = () => {
    if (!selectedReport) return;
    
    const updatedData = {
      status: '已结案' as ReportStatus,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    
    updateReport(selectedReport.id, updatedData);
    setSelectedReport({ ...selectedReport, ...updatedData });
  };

  const getCurrentStepIndex = (status: ReportStatus) => {
    return handleFlowSteps.findIndex((step) => step.status === status);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="举报总数"
          value={totalReports}
          icon={FileText}
          color="blue"
          trend="本月 +3"
          trendUp
        />
        <StatsCard
          title="待受理"
          value={pendingReports}
          icon={Clock}
          color="amber"
          trend="需及时处理"
          trendUp={false}
        />
        <StatsCard
          title="处理中"
          value={processingReports}
          icon={MessageSquare}
          color="amber"
          trend="正在跟进"
          trendUp
        />
        <StatsCard
          title="已结案"
          value={closedReports}
          icon={CheckCircle}
          color="green"
          trend="结案率 75%"
          trendUp
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">举报受理管理</h2>
              <p className="text-sm text-slate-500 mt-1">管理群众举报信息，跟踪处理进度</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowRegisterModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">举报登记</span>
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
                  placeholder="搜索举报标题、地点、描述..."
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
                  <option value="待受理">待受理</option>
                  <option value="处理中">处理中</option>
                  <option value="已处理">已处理</option>
                  <option value="已结案">已结案</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  举报信息
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  举报人
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  地点
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  处理人
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  状态
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  登记时间
                </th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredReports.map((report) => (
                <tr
                  key={report.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">{report.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5 max-w-xs truncate">
                          {report.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-700">
                      {report.reporterName || '匿名'}
                    </div>
                    {report.reporterPhone && (
                      <div className="text-xs text-slate-500 mt-0.5">
                        {report.reporterPhone}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-slate-700">
                      <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <span>{report.location}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-slate-200 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-slate-500" />
                      </div>
                      <span className="text-sm text-slate-700">{report.handler || '-'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusTag status={report.status} variant="report" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-slate-700">
                      <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <span>{report.createdAt}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleViewDetail(report)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="查看详情"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedReport(report);
                          setShowAssignModal(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        title="分派处理"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showDetailModal && selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">举报详情</h3>
                <p className="text-sm text-slate-500 mt-1">举报编号：{selectedReport.id}</p>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-semibold text-slate-800">处理进度</h4>
                <StatusTag status={selectedReport.status} variant="report" />
              </div>
              
              <div className="flex items-start justify-between relative">
                <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-200 -z-10" />
                {handleFlowSteps.map((step, index) => {
                  const currentIndex = getCurrentStepIndex(selectedReport.status);
                  const isCompleted = index <= currentIndex;
                  const isCurrent = index === currentIndex;
                  
                  return (
                    <div key={step.status} className="flex flex-col items-center z-10 w-1/4">
                      <div className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors',
                        isCompleted
                          ? isCurrent
                            ? 'bg-red-600 border-red-600 text-white'
                            : 'bg-green-600 border-green-600 text-white'
                          : 'bg-white border-slate-300 text-slate-400'
                      )}>
                        {isCompleted ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <span className="text-xs font-medium">{index + 1}</span>
                        )}
                      </div>
                      <div className="mt-3 text-center">
                        <p className={cn(
                          'text-sm font-medium',
                          isCompleted ? 'text-slate-800' : 'text-slate-400'
                        )}>
                          {step.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">{step.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-slate-500 mb-2">举报标题</h4>
                  <p className="text-slate-800">{selectedReport.title}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-500 mb-2">举报地点</h4>
                  <div className="flex items-center gap-2 text-slate-800">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>{selectedReport.location}</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-500 mb-2">举报人</h4>
                  <div className="flex items-center gap-2 text-slate-800">
                    <User className="w-4 h-4 text-slate-400" />
                    <span>{selectedReport.reporterName || '匿名'}</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-500 mb-2">联系电话</h4>
                  <div className="flex items-center gap-2 text-slate-800">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span>{selectedReport.reporterPhone || '-'}</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-500 mb-2">登记时间</h4>
                  <div className="flex items-center gap-2 text-slate-800">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>{selectedReport.createdAt}</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-500 mb-2">处理人</h4>
                  <div className="flex items-center gap-2 text-slate-800">
                    <UserCheck className="w-4 h-4 text-slate-400" />
                    <span>{selectedReport.handler || '-'}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-slate-500 mb-2">举报详情</h4>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-slate-700 whitespace-pre-wrap">{selectedReport.description}</p>
                </div>
              </div>

              {selectedReport.images.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-slate-500 mb-3">举报图片</h4>
                  <div className="flex gap-3 flex-wrap">
                    {selectedReport.images.map((img, index) => (
                      <div
                        key={index}
                        className="w-24 h-24 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200"
                      >
                        <Image className="w-8 h-8 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedReport.handleResult && (
                <div>
                  <h4 className="text-sm font-medium text-slate-500 mb-2">处理结果</h4>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-green-800 whitespace-pre-wrap">{selectedReport.handleResult}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                关闭
              </button>
              
              {selectedReport.status === '待受理' && (
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setShowAssignModal(true);
                  }}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  分派处理
                </button>
              )}
              
              {selectedReport.status === '处理中' && (
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setShowFeedbackModal(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  处理反馈
                </button>
              )}
              
              {selectedReport.status === '已处理' && (
                <button
                  onClick={handleCloseCase}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  结案归档
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">举报登记</h3>
                <p className="text-sm text-slate-500 mt-1">记录群众举报信息</p>
              </div>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  举报标题 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={registerForm.title}
                  onChange={(e) => setRegisterForm({ ...registerForm, title: e.target.value })}
                  placeholder="请输入举报标题..."
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    举报人姓名
                  </label>
                  <input
                    type="text"
                    value={registerForm.reporterName}
                    onChange={(e) => setRegisterForm({ ...registerForm, reporterName: e.target.value })}
                    placeholder="选填，默认匿名"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    联系电话
                  </label>
                  <input
                    type="text"
                    value={registerForm.reporterPhone}
                    onChange={(e) => setRegisterForm({ ...registerForm, reporterPhone: e.target.value })}
                    placeholder="选填"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  举报地点 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={registerForm.location}
                    onChange={(e) => setRegisterForm({ ...registerForm, location: e.target.value })}
                    placeholder="请输入举报地点..."
                    className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  举报详情 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={registerForm.description}
                  onChange={(e) => setRegisterForm({ ...registerForm, description: e.target.value })}
                  placeholder="请详细描述举报内容..."
                  rows={4}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setShowRegisterModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleRegister}
                disabled={!registerForm.title || !registerForm.location || !registerForm.description}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                提交登记
              </button>
            </div>
          </div>
        </div>
      )}

      {showAssignModal && selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">分派处理</h3>
                <p className="text-sm text-slate-500 mt-1">选择处理负责人</p>
              </div>
              <button
                onClick={() => setShowAssignModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm font-medium text-slate-800">{selectedReport.title}</p>
                <p className="text-xs text-slate-500 mt-1">{selectedReport.location}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  选择处理人 <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {mockHandlers.map((handler) => (
                    <button
                      key={handler}
                      onClick={() => setAssignForm({ handler })}
                      className={cn(
                        'w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left',
                        assignForm.handler === handler
                          ? 'border-red-500 bg-red-50'
                          : 'border-slate-200 hover:bg-slate-50'
                      )}
                    >
                      <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-slate-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">{handler}</p>
                        <p className="text-xs text-slate-500">消防监督员</p>
                      </div>
                      {assignForm.handler === handler && (
                        <Check className="w-5 h-5 text-red-600 ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setShowAssignModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleAssign}
                disabled={!assignForm.handler}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                确认分派
              </button>
            </div>
          </div>
        </div>
      )}

      {showFeedbackModal && selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">处理反馈</h3>
                <p className="text-sm text-slate-500 mt-1">填写处理结果</p>
              </div>
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm font-medium text-slate-800">{selectedReport.title}</p>
                <p className="text-xs text-slate-500 mt-1">处理人：{selectedReport.handler}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  处理结果 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={feedbackForm.handleResult}
                  onChange={(e) => setFeedbackForm({ handleResult: e.target.value })}
                  placeholder="请详细描述处理过程和结果..."
                  rows={5}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                />
              </div>
              
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  提交处理结果后，举报状态将变更为"已处理"，待审核确认后可结案归档。
                </p>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleFeedback}
                disabled={!feedbackForm.handleResult}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                提交反馈
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
