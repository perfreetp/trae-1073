import { useState } from 'react';
import {
  FileCheck,
  Plus,
  Search,
  Filter,
  Eye,
  Camera,
  X,
  Check,
  Clock,
  CheckCircle,
  XCircle,
  Building2,
  User,
  Phone,
  Calendar,
  Download
} from 'lucide-react';
import { StatsCard } from '@/components/common/StatsCard';
import { StatusTag } from '@/components/common/StatusTag';
import { useAppStore } from '@/store';
import type { SelfCheckItem } from '@/types';

const defaultCheckItems: Omit<SelfCheckItem, 'id'>[] = [
  { question: '消防通道、安全出口是否畅通无阻？', result: '合格' },
  { question: '灭火器是否在有效期内、压力正常？', result: '合格' },
  { question: '消火栓是否完好、无遮挡、配件齐全？', result: '合格' },
  { question: '应急照明和疏散指示标志是否完好有效？', result: '合格' },
  { question: '消防设施是否定期维护保养？', result: '合格' },
  { question: '是否存在违规用电、私拉乱接现象？', result: '合格' },
  { question: '易燃易爆物品是否规范存放？', result: '合格' },
  { question: '员工是否掌握基本消防知识和技能？', result: '合格' }
];

export default function SelfCheckPage() {
  const { selfCheckRecords, units, addSelfCheckRecord, updateSelfCheckRecord } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const [newRecord, setNewRecord] = useState({
    unitId: '',
    checkDate: new Date().toISOString().split('T')[0],
    checker: '',
    checkerPhone: '',
    items: defaultCheckItems.map((item, idx) => ({ ...item, id: `item_${idx}` })),
    problems: '',
    images: [] as string[]
  });

  const totalRecords = selfCheckRecords.length;
  const pendingRecords = selfCheckRecords.filter((r) => r.status === '待审核').length;
  const passedRecords = selfCheckRecords.filter((r) => r.status === '已通过').length;
  const rejectedRecords = selfCheckRecords.filter((r) => r.status === '已驳回').length;

  const filteredRecords = selfCheckRecords.filter((r) => {
    const matchSearch =
      r.unitName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.checker.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const addPhotoPlaceholder = () => {
    setNewRecord({
      ...newRecord,
      images: [...newRecord.images, `/selfcheck_${Date.now()}.jpg`]
    });
  };

  const removePhoto = (index: number) => {
    setNewRecord({
      ...newRecord,
      images: newRecord.images.filter((_, i) => i !== index)
    });
  };

  const updateCheckItemResult = (index: number, result: '合格' | '不合格' | '不适用') => {
    const updatedItems = [...newRecord.items];
    updatedItems[index] = { ...updatedItems[index], result };
    setNewRecord({ ...newRecord, items: updatedItems });
  };

  const updateCheckItemRemark = (index: number, remark: string) => {
    const updatedItems = [...newRecord.items];
    updatedItems[index] = { ...updatedItems[index], remark };
    setNewRecord({ ...newRecord, items: updatedItems });
  };

  const handleSubmit = () => {
    if (newRecord.unitId && newRecord.checker) {
      const unit = units.find((u) => u.id === newRecord.unitId);
      addSelfCheckRecord({
        unitId: newRecord.unitId,
        unitName: unit?.name || '',
        checkDate: newRecord.checkDate,
        checker: newRecord.checker,
        checkerPhone: newRecord.checkerPhone,
        items: newRecord.items,
        problems: newRecord.problems,
        images: newRecord.images
      });

      setShowAddModal(false);
      setNewRecord({
        unitId: '',
        checkDate: new Date().toISOString().split('T')[0],
        checker: '',
        checkerPhone: '',
        items: defaultCheckItems.map((item, idx) => ({ ...item, id: `item_${idx}` })),
        problems: '',
        images: []
      });
    }
  };

  const openDetail = (record: any) => {
    setSelectedRecord(record);
    setShowDetailModal(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case '待审核':
        return <Clock className="w-5 h-5 text-amber-500" />;
      case '已通过':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case '已驳回':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const exportRecord = (record: any) => {
    const content = `
========================================
      物业消防安全自查报告
========================================

一、基本信息
----------------------------------------
单位名称: ${record.unitName}
自查日期: ${record.checkDate}
检查人: ${record.checker}
联系电话: ${record.checkerPhone}
提交时间: ${record.createdAt}
审核状态: ${record.status}

二、自查项目
----------------------------------------
${record.items.map((item: any, idx: number) => 
  `${idx + 1}. ${item.question}: ${item.result}${item.remark ? ` (备注: ${item.remark})` : ''}`
).join('\n')}

三、发现问题
----------------------------------------
${record.problems || '无'}

四、审核意见
----------------------------------------
${record.reviewComment || '暂无审核意见'}

========================================
报告结束
========================================
    `.trim();

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${record.unitName}_消防安全自查报告_${record.checkDate}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">物业自查填报</h1>
          <p className="text-slate-500 mt-1">物业单位消防安全自查登记与审核管理</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="自查记录总数"
          value={totalRecords}
          icon={FileCheck}
          color="blue"
          trend="本月 +2"
          trendUp
        />
        <StatsCard
          title="待审核"
          value={pendingRecords}
          icon={Clock}
          color="amber"
        />
        <StatsCard
          title="审核通过"
          value={passedRecords}
          icon={CheckCircle}
          color="green"
        />
        <StatsCard
          title="已驳回"
          value={rejectedRecords}
          icon={XCircle}
          color="red"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-4 border-b border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-slate-800">自查记录</h2>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-sm font-medium hover:from-red-600 hover:to-red-700 transition-all shadow-md shadow-red-500/25"
              >
                <Plus className="w-4 h-4" />
                新增自查
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="搜索单位、检查人..."
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
                  <option value="待审核">待审核</option>
                  <option value="已通过">已通过</option>
                  <option value="已驳回">已驳回</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  单位信息
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  自查日期
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  检查人
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  检查项目
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
              {filteredRecords.map((record) => (
                <tr
                  key={record.id}
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => openDetail(record)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">{record.unitName}</p>
                        <p className="text-xs text-slate-500">{record.createdAt} 提交</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-700">{record.checkDate}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-slate-700">{record.checker}</p>
                      <p className="text-xs text-slate-500">{record.checkerPhone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-700">{record.items.length} 项</span>
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">
                        合格 {record.items.filter((i: any) => i.result === '合格').length}
                      </span>
                      {record.items.filter((i: any) => i.result === '不合格').length > 0 && (
                        <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded">
                          不合格 {record.items.filter((i: any) => i.result === '不合格').length}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(record.status)}
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          record.status === '待审核'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : record.status === '已通过'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}
                      >
                        {record.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className="flex items-center justify-end gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => openDetail(record)}
                        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="查看详情"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => exportRecord(record)}
                        className="p-2 text-slate-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="导出报告"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRecords.length === 0 && (
          <div className="py-12 text-center">
            <FileCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">暂无自查记录</p>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">物业消防安全自查</h3>
                <p className="text-blue-100 text-sm">请认真填写自查内容</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    自查单位 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newRecord.unitId}
                    onChange={(e) => setNewRecord({ ...newRecord, unitId: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="">请选择单位</option>
                    {units.map((unit) => (
                      <option key={unit.id} value={unit.id}>
                        {unit.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    自查日期 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={newRecord.checkDate}
                    onChange={(e) => setNewRecord({ ...newRecord, checkDate: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    检查人 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newRecord.checker}
                    onChange={(e) => setNewRecord({ ...newRecord, checker: e.target.value })}
                    placeholder="请输入检查人姓名"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    联系电话
                  </label>
                  <input
                    type="tel"
                    value={newRecord.checkerPhone}
                    onChange={(e) => setNewRecord({ ...newRecord, checkerPhone: e.target.value })}
                    placeholder="请输入联系电话"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-3">自查项目</h4>
                <div className="space-y-3">
                  {newRecord.items.map((item, index) => (
                    <div
                      key={item.id}
                      className="p-4 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-800">
                            {index + 1}. {item.question}
                          </p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          {(['合格', '不合格', '不适用'] as const).map((result) => (
                            <button
                              key={result}
                              onClick={() => updateCheckItemResult(index, result)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                item.result === result
                                  ? result === '合格'
                                    ? 'bg-green-500 text-white'
                                    : result === '不合格'
                                    ? 'bg-red-500 text-white'
                                    : 'bg-slate-500 text-white'
                                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {result}
                            </button>
                          ))}
                        </div>
                      </div>
                      {item.result === '不合格' && (
                        <input
                          type="text"
                          value={item.remark || ''}
                          onChange={(e) => updateCheckItemRemark(index, e.target.value)}
                          placeholder="请描述不合格情况..."
                          className="mt-3 w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  发现问题及整改措施
                </label>
                <textarea
                  value={newRecord.problems}
                  onChange={(e) => setNewRecord({ ...newRecord, problems: e.target.value })}
                  rows={3}
                  placeholder="请详细描述自查中发现的问题及拟采取的整改措施..."
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  现场照片
                </label>
                <div className="flex flex-wrap gap-3">
                  {newRecord.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative w-24 h-24 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200"
                    >
                      <Camera className="w-8 h-8 text-slate-400" />
                      <button
                        onClick={() => removePhoto(idx)}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addPhotoPlaceholder}
                    className="w-24 h-24 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                  >
                    <Plus className="w-6 h-6 text-slate-400" />
                    <span className="text-xs text-slate-500 mt-1">添加照片</span>
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-2">点击添加照片占位，支持多张上传</p>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-lg text-sm hover:bg-slate-100 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSubmit}
                disabled={!newRecord.unitId || !newRecord.checker}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-sm hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                提交自查
              </button>
            </div>
          </div>
        </div>
      )}

      {showDetailModal && selectedRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(selectedRecord.status)}
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">自查详情</h3>
                  <p className="text-sm text-slate-500">{selectedRecord.unitName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => exportRecord(selectedRecord)}
                  className="p-2 text-slate-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="导出报告"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedRecord(null);
                  }}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)] space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">自查单位</p>
                  <p className="text-sm font-medium text-slate-800">{selectedRecord.unitName}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">自查日期</p>
                  <p className="text-sm font-medium text-slate-800">{selectedRecord.checkDate}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">检查人</p>
                  <p className="text-sm font-medium text-slate-800">{selectedRecord.checker}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">联系电话</p>
                  <p className="text-sm font-medium text-slate-800">{selectedRecord.checkerPhone}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-3">自查项目明细</h4>
                <div className="space-y-2">
                  {selectedRecord.items.map((item: any, index: number) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-xs font-medium text-slate-600">
                          {index + 1}
                        </span>
                        <span className="text-sm text-slate-800">{item.question}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${
                            item.result === '合格'
                              ? 'bg-green-100 text-green-700'
                              : item.result === '不合格'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {item.result}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedRecord.problems && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">发现问题</h4>
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-800">{selectedRecord.problems}</p>
                  </div>
                </div>
              )}

              {selectedRecord.images && selectedRecord.images.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">现场照片</h4>
                  <div className="flex flex-wrap gap-3">
                    {selectedRecord.images.map((img: string, idx: number) => (
                      <div
                        key={idx}
                        className="w-24 h-24 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200"
                      >
                        <Camera className="w-8 h-8 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedRecord.reviewComment && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">审核意见</h4>
                  <div
                    className={`p-4 rounded-lg border ${
                      selectedRecord.status === '已通过'
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <p
                      className={`text-sm ${
                        selectedRecord.status === '已通过'
                          ? 'text-green-800'
                          : 'text-red-800'
                      }`}
                    >
                      {selectedRecord.reviewComment}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
