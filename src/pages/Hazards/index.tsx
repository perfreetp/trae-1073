import { useState } from 'react';
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  CheckSquare,
  XCircle,
  Camera,
  User,
  Phone,
  Calendar,
  MapPin,
  ChevronRight,
  FileText,
  Download
} from 'lucide-react';
import { StatsCard } from '@/components/common/StatsCard';
import { StatusTag } from '@/components/common/StatusTag';
import { useAppStore } from '@/store';
import type { Hazard } from '@/types';

export default function HazardsPage() {
  const { hazards, units, updateHazard } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [selectedHazard, setSelectedHazard] = useState<Hazard | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRectifyModal, setShowRectifyModal] = useState(false);
  const [showRecheckModal, setShowRecheckModal] = useState(false);
  const [rectifyDesc, setRectifyDesc] = useState('');
  const [recheckResult, setRecheckResult] = useState<'通过' | '不通过'>('通过');
  const [recheckComment, setRecheckComment] = useState('');

  const totalHazards = hazards.length;
  const pendingHazards = hazards.filter((h) => h.status === '待整改').length;
  const rectifyingHazards = hazards.filter((h) => h.status === '整改中').length;
  const completedHazards = hazards.filter((h) => h.status === '已完成').length;

  const filteredHazards = hazards.filter((h) => {
    const matchSearch =
      h.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || h.status === statusFilter;
    const matchLevel = levelFilter === 'all' || h.level === levelFilter;
    return matchSearch && matchStatus && matchLevel;
  });

  const getUnitName = (unitId: string) => {
    const unit = units.find((u) => u.id === unitId);
    return unit ? unit.name : '未知单位';
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case '重大':
        return 'bg-red-500';
      case '较大':
        return 'bg-orange-500';
      default:
        return 'bg-amber-500';
    }
  };

  const handleRectify = () => {
    if (selectedHazard && rectifyDesc) {
      updateHazard(selectedHazard.id, {
        status: '待复查',
        rectificationDescription: rectifyDesc,
        rectificationImages: ['/rectify1.jpg']
      });
      setShowRectifyModal(false);
      setRectifyDesc('');
      setSelectedHazard(null);
    }
  };

  const handleRecheck = () => {
    if (selectedHazard) {
      updateHazard(selectedHazard.id, {
        status: recheckResult === '通过' ? '已完成' : '整改中',
        recheckDate: new Date().toISOString().split('T')[0],
        recheckResult,
        rechecker: '李消防'
      });
      setShowRecheckModal(false);
      setRecheckResult('通过');
      setRecheckComment('');
      setSelectedHazard(null);
    }
  };

  const openDetail = (hazard: Hazard) => {
    setSelectedHazard(hazard);
    setShowDetailModal(true);
  };

  const getTimelineData = (hazard: Hazard) => {
    const timeline = [
      { status: '隐患登记', date: hazard.foundDate, completed: true, icon: AlertTriangle },
      { status: '分派整改', date: hazard.foundDate, completed: true, icon: User }
    ];

    if (hazard.rectificationDescription) {
      timeline.push({ status: '提交整改', date: hazard.deadline, completed: true, icon: CheckSquare });
    } else {
      timeline.push({ status: '提交整改', date: '', completed: false, icon: CheckSquare });
    }

    if (hazard.recheckDate) {
      timeline.push({
        status: `复查${hazard.recheckResult}`,
        date: hazard.recheckDate,
        completed: true,
        icon: hazard.recheckResult === '通过' ? CheckCircle2 : XCircle
      });
    } else if (hazard.rectificationDescription) {
      timeline.push({ status: '待复查', date: '', completed: false, icon: Clock });
    } else {
      timeline.push({ status: '复查验证', date: '', completed: false, icon: Clock });
    }

    return timeline;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="隐患总数"
          value={totalHazards}
          icon={AlertTriangle}
          color="red"
          trend="较上月 +12"
          trendUp={false}
        />
        <StatsCard
          title="待整改"
          value={pendingHazards}
          icon={Clock}
          color="amber"
          trend="较上月 -3"
          trendUp
        />
        <StatsCard
          title="整改中"
          value={rectifyingHazards}
          icon={Edit}
          color="blue"
          trend="较上月 +2"
          trendUp={false}
        />
        <StatsCard
          title="已完成"
          value={completedHazards}
          icon={CheckCircle2}
          color="green"
          trend="较上月 +8"
          trendUp
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-4 border-b border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-slate-800">隐患清单</h2>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-sm font-medium hover:from-red-600 hover:to-red-700 transition-all shadow-md shadow-red-500/25">
                <Plus className="w-4 h-4" />
                新增隐患
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="搜索隐患描述或位置..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:bg-white transition-all"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                >
                  <option value="all">全部状态</option>
                  <option value="待整改">待整改</option>
                  <option value="整改中">整改中</option>
                  <option value="待复查">待复查</option>
                  <option value="已完成">已完成</option>
                  <option value="已逾期">已逾期</option>
                </select>

                <select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                >
                  <option value="all">全部等级</option>
                  <option value="一般">一般隐患</option>
                  <option value="较大">较大隐患</option>
                  <option value="重大">重大隐患</option>
                </select>
              </div>

              <button className="inline-flex items-center gap-2 px-3 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm hover:bg-slate-50 transition-colors">
                <Download className="w-4 h-4" />
                导出
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  隐患信息
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  所属单位
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  风险等级
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  整改期限
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  责任人
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredHazards.map((hazard) => (
                <tr
                  key={hazard.id}
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => openDetail(hazard)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getLevelColor(
                          hazard.level
                        )} bg-opacity-10`}
                      >
                        <AlertTriangle
                          className={`w-5 h-5 ${
                            hazard.level === '重大'
                              ? 'text-red-500'
                              : hazard.level === '较大'
                              ? 'text-orange-500'
                              : 'text-amber-500'
                          }`}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800 line-clamp-1">{hazard.description}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {hazard.location}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-700">{getUnitName(hazard.unitId)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <StatusTag status={`${hazard.level}隐患`} />
                  </td>
                  <td className="px-6 py-4">
                    <p
                      className={`text-sm ${
                        hazard.status === '已逾期' ? 'text-red-600 font-medium' : 'text-slate-700'
                      }`}
                    >
                      {hazard.deadline}
                    </p>
                    <p className="text-xs text-slate-500">发现于 {hazard.foundDate}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-slate-700">{hazard.responsiblePerson}</p>
                      <p className="text-xs text-slate-500">{hazard.responsiblePhone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusTag status={hazard.status} variant="hazard" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => openDetail(hazard)}
                        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {hazard.status === '待整改' && (
                        <button
                          onClick={() => {
                            setSelectedHazard(hazard);
                            setShowRectifyModal(true);
                          }}
                          className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      {hazard.status === '待复查' && (
                        <button
                          onClick={() => {
                            setSelectedHazard(hazard);
                            setShowRecheckModal(true);
                          }}
                          className="p-2 text-slate-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <CheckSquare className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredHazards.length === 0 && (
          <div className="py-12 text-center">
            <AlertTriangle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">暂无符合条件的隐患记录</p>
          </div>
        )}
      </div>

      {showDetailModal && selectedHazard && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">隐患详情</h3>
                <p className="text-red-100 text-sm">编号: {selectedHazard.id.toUpperCase()}</p>
              </div>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedHazard(null);
                }}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-500">隐患描述</label>
                    <p className="mt-1 text-slate-800">{selectedHazard.description}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-500">隐患位置</label>
                    <p className="mt-1 text-slate-800 flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      {selectedHazard.location}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-500">所属单位</label>
                    <p className="mt-1 text-slate-800">{getUnitName(selectedHazard.unitId)}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-500">风险等级</label>
                      <div className="mt-1">
                        <StatusTag status={`${selectedHazard.level}隐患`} />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-500">当前状态</label>
                      <div className="mt-1">
                        <StatusTag status={selectedHazard.status} variant="hazard" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-500">整改责任人</label>
                    <p className="mt-1 text-slate-800 flex items-center gap-1">
                      <User className="w-4 h-4 text-slate-400" />
                      {selectedHazard.responsiblePerson}
                      <span className="text-slate-500 ml-2 flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {selectedHazard.responsiblePhone}
                      </span>
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-500">发现日期</label>
                      <p className="mt-1 text-slate-800 flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {selectedHazard.foundDate}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-500">整改期限</label>
                      <p className="mt-1 text-slate-800 flex items-center gap-1">
                        <Clock className="w-4 h-4 text-slate-400" />
                        {selectedHazard.deadline}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="text-sm font-medium text-slate-500">现场照片</label>
                <div className="mt-2 flex gap-3">
                  {selectedHazard.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="w-24 h-24 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200"
                    >
                      <Camera className="w-8 h-8 text-slate-400" />
                    </div>
                  ))}
                </div>
              </div>

              {selectedHazard.rectificationDescription && (
                <div className="mt-6">
                  <label className="text-sm font-medium text-slate-500">整改说明</label>
                  <p className="mt-1 text-slate-800 bg-green-50 p-3 rounded-lg border border-green-200">
                    {selectedHazard.rectificationDescription}
                  </p>
                  {selectedHazard.rectificationImages && (
                    <div className="mt-3 flex gap-3">
                      {selectedHazard.rectificationImages.map((img, idx) => (
                        <div
                          key={idx}
                          className="w-24 h-24 bg-green-50 rounded-lg flex items-center justify-center border border-green-200"
                        >
                          <Camera className="w-8 h-8 text-green-500" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="mt-8">
                <h4 className="text-sm font-semibold text-slate-700 mb-4">处理进度</h4>
                <div className="relative">
                  {getTimelineData(selectedHazard).map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4 pb-6 last:pb-0">
                      <div className="relative flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                            item.completed
                              ? 'bg-green-500 text-white'
                              : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          <item.icon className="w-5 h-5" />
                        </div>
                        {idx < getTimelineData(selectedHazard).length - 1 && (
                          <div
                            className={`absolute top-10 w-0.5 h-full ${
                              item.completed ? 'bg-green-500' : 'bg-slate-200'
                            }`}
                          ></div>
                        )}
                      </div>
                      <div className="pt-2">
                        <p
                          className={`text-sm font-medium ${
                            item.completed ? 'text-slate-800' : 'text-slate-500'
                          }`}
                        >
                          {item.status}
                        </p>
                        {item.date && (
                          <p className="text-xs text-slate-500 mt-0.5">{item.date}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedHazard(null);
                  }}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm hover:bg-slate-50 transition-colors"
                >
                  关闭
                </button>
                {selectedHazard.status === '待整改' && (
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      setShowRectifyModal(true);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg text-sm hover:from-amber-600 hover:to-amber-700 transition-all"
                  >
                    提交整改
                  </button>
                )}
                {selectedHazard.status === '待复查' && (
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      setShowRecheckModal(true);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg text-sm hover:from-green-600 hover:to-green-700 transition-all"
                  >
                    复查验证
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showRectifyModal && selectedHazard && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800">提交整改报告</h3>
              <p className="text-sm text-slate-500 mt-0.5">{selectedHazard.description}</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">整改说明</label>
                <textarea
                  value={rectifyDesc}
                  onChange={(e) => setRectifyDesc(e.target.value)}
                  rows={4}
                  placeholder="请详细描述整改措施和完成情况..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">整改后照片</label>
                <div className="flex gap-3">
                  <div className="w-20 h-20 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-red-400 hover:bg-red-50 transition-colors">
                    <Camera className="w-6 h-6 text-slate-400" />
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 rounded-b-2xl flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowRectifyModal(false);
                  setSelectedHazard(null);
                  setRectifyDesc('');
                }}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm hover:bg-slate-100 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleRectify}
                disabled={!rectifyDesc}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg text-sm hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                提交整改
              </button>
            </div>
          </div>
        </div>
      )}

      {showRecheckModal && selectedHazard && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800">复查验证</h3>
              <p className="text-sm text-slate-500 mt-0.5">{selectedHazard.description}</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">复查结果</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setRecheckResult('通过')}
                    className={`flex-1 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                      recheckResult === '通过'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5 mx-auto mb-1" />
                    整改通过
                  </button>
                  <button
                    onClick={() => setRecheckResult('不通过')}
                    className={`flex-1 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                      recheckResult === '不通过'
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <XCircle className="w-5 h-5 mx-auto mb-1" />
                    需重新整改
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">复查意见</label>
                <textarea
                  value={recheckComment}
                  onChange={(e) => setRecheckComment(e.target.value)}
                  rows={3}
                  placeholder="请填写复查意见..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-none"
                />
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 rounded-b-2xl flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowRecheckModal(false);
                  setSelectedHazard(null);
                  setRecheckResult('通过');
                  setRecheckComment('');
                }}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm hover:bg-slate-100 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleRecheck}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-sm hover:from-blue-600 hover:to-blue-700 transition-all"
              >
                确认复查
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
