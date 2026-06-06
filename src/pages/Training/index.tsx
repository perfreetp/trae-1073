import { useState, useMemo } from 'react';
import {
  GraduationCap,
  CalendarDays,
  MapPin,
  Users,
  Clock,
  FileText,
  User,
  Search,
  Filter,
  Eye,
  X,
  Check,
  ClipboardList,
  Award,
  Activity,
  ChevronDown,
  ChevronRight,
  Download,
  AlertCircle,
  CheckCircle,
  XCircle,
  Target,
  BookOpen,
  PlayCircle,
  Plus,
  Building2,
  LogIn,
  LogOut
} from 'lucide-react';
import { StatusTag } from '@/components/common/StatusTag';
import { StatsCard } from '@/components/common/StatsCard';
import { useAppStore } from '@/store';
import {
  mockExams,
  mockExamQuestions
} from '@/utils/mock';
import type { Training, AttendeeRecord, ExamScore, DrillRecord, ExamQuestion, TrainingType } from '@/types';
import { cn } from '@/lib/utils';

type TabType = 'trainings' | 'exams' | 'drills';

interface AttendeeFormItem {
  name: string;
  unit: string;
  phone: string;
}

export default function TrainingPage() {
  const [activeTab, setActiveTab] = useState<TabType>('trainings');
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showExamModal, setShowExamModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState<ExamScore | null>(null);
  const [showDrillModal, setShowDrillModal] = useState(false);
  const [selectedDrill, setSelectedDrill] = useState<DrillRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('全部');
  const [showAddTrainingModal, setShowAddTrainingModal] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showAddDrillModal, setShowAddDrillModal] = useState(false);
  const [showAddExamScoreModal, setShowAddExamScoreModal] = useState(false);

  const {
    trainings,
    attendeeRecords,
    examScores,
    drillRecords,
    addTraining,
    updateTraining,
    addAttendeeRecord,
    updateAttendeeRecord,
    addDrillRecord,
    addExamScore
  } = useAppStore();

  const totalTrainings = trainings.length;
  const totalParticipants = trainings.reduce((sum, t) => sum + t.participants, 0);
  const totalDrills = drillRecords.length;
  const avgExamScore = examScores.length > 0
    ? Math.round(examScores.reduce((sum, e) => sum + e.score, 0) / examScores.length)
    : 0;

  const filteredTrainings = useMemo(() => {
    return trainings.filter((training) => {
      const matchesSearch =
        training.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        training.type.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === '全部' || training.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter, trainings]);

  const getTrainingAttendees = (trainingId: string) => {
    return attendeeRecords.filter((a) => a.trainingId === trainingId);
  };

  const getTrainingExamScores = (trainingId: string) => {
    return examScores.filter((e) => e.trainingId === trainingId);
  };

  const openTrainingDetail = (training: Training) => {
    setSelectedTraining(training);
    setShowDetailModal(true);
  };

  const openExamDetail = (exam: ExamScore) => {
    setSelectedExam(exam);
    setShowExamModal(true);
  };

  const openDrillDetail = (drill: DrillRecord) => {
    setSelectedDrill(drill);
    setShowDrillModal(true);
  };

  const handleAddTraining = (data: {
    title: string;
    type: TrainingType;
    date: string;
    location: string;
    participants: number;
    duration: number;
    description?: string;
    attendees: AttendeeFormItem[];
  }) => {
    const { attendees, ...trainingData } = data;
    
    addTraining({
      ...trainingData,
      attendeeList: attendees.map((a) => a.name),
      materials: []
    });

    const state = useAppStore.getState();
    const newTraining = state.trainings[state.trainings.length - 1];
    
    attendees.forEach((attendee) => {
      if (attendee.name.trim()) {
        addAttendeeRecord({
          trainingId: newTraining.id,
          name: attendee.name,
          unit: attendee.unit,
          status: '未签到'
        });
      }
    });

    setShowAddTrainingModal(false);
  };

  const handleSignIn = (attendeeId: string, action: 'signin' | 'signout') => {
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    if (action === 'signin') {
      updateAttendeeRecord(attendeeId, {
        status: '已签到',
        signInTime: timeStr
      });
    } else {
      updateAttendeeRecord(attendeeId, {
        status: '已签退',
        signOutTime: timeStr
      });
    }
  };

  const handleAddDrill = (data: {
    title: string;
    unitName: string;
    date: string;
    location: string;
    participants: number;
    description: string;
    problems?: string;
    improvement?: string;
  }) => {
    addDrillRecord({
      ...data,
      unitId: 'u' + Date.now(),
      type: '消防疏散演练',
      duration: 60,
      evaluator: useAppStore.getState().currentUser.name,
      result: '合格'
    });
    setShowAddDrillModal(false);
  };

  const exportExamScores = () => {
    const headers = ['考生姓名', '单位', '考试名称', '分数', '总分', '是否通过'];
    const rows = examScores.map((e) => [
      e.userName,
      e.unit,
      e.examTitle,
      e.score.toString(),
      e.totalScore.toString(),
      e.isPassed ? '是' : '否'
    ]);
    
    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `考试成绩_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadTrainingMaterial = () => {
    const content = `消防安全培训资料

一、消防安全基础知识
1. 我国消防工作的方针：预防为主，防消结合
2. 消防安全"四个能力"：
   - 检查消除火灾隐患能力
   - 组织扑救初起火灾能力
   - 组织人员疏散逃生能力
   - 消防宣传教育培训能力

二、火灾预防措施
1. 定期检查电气线路，避免超负荷用电
2. 保持疏散通道畅通，严禁堵塞消防通道
3. 正确使用燃气设备，使用后关闭阀门
4. 定期维护消防设施，确保完好有效

三、初期火灾扑救
1. 发现火灾立即拨打119报警
2. 使用灭火器对准火焰根部喷射
3. 电器火灾先切断电源再扑救
4. 油类火灾严禁用水扑救

四、火场逃生自救
1. 保持冷静，辨明逃生方向
2. 用湿毛巾捂住口鼻，弯腰低姿前进
3. 不要乘坐普通电梯
4. 如无法逃生，关闭门窗等待救援

编制单位：XX街道消防办
编制日期：${new Date().toISOString().split('T')[0]}`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '消防安全培训资料.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportTrainingReport = (training: Training) => {
    const attendees = getTrainingAttendees(training.id);
    const scores = getTrainingExamScores(training.id);
    const signedInCount = attendees.filter((a) => a.status !== '未签到').length;
    const passCount = scores.filter((e) => e.isPassed).length;

    const content = `培训总结报告

培训基本信息
==================
培训名称：${training.title}
培训类型：${training.type}
培训日期：${training.date}
培训地点：${training.location}
培训时长：${training.duration} 分钟
参训人数：${training.participants} 人
主讲人：${training.instructor || '-'}
培训状态：${training.status || '-'}

培训内容简介：
${training.description || '无'}

签到情况统计
==================
应到人数：${attendees.length} 人
实到人数：${signedInCount} 人
签到率：${attendees.length > 0 ? Math.round((signedInCount / attendees.length) * 100) : 0}%

签到明细：
${attendees.map((a, idx) => `${idx + 1}. ${a.name} (${a.unit}) - ${a.status} - 签到: ${a.signInTime || '-'} - 签退: ${a.signOutTime || '-'}`).join('\n')}

考试成绩统计
==================
参考人数：${scores.length} 人
通过人数：${passCount} 人
通过率：${scores.length > 0 ? Math.round((passCount / scores.length) * 100) : 0}%
平均分：${scores.length > 0 ? Math.round(scores.reduce((sum, e) => sum + e.score, 0) / scores.length) : 0} 分

成绩明细：
${scores.map((s, idx) => `${idx + 1}. ${s.userName} (${s.unit}) - ${s.score}/${s.totalScore} 分 - ${s.isPassed ? '通过' : '未通过'}`).join('\n')}

培训总结
==================
本次培训圆满完成，参训人员整体表现良好。通过系统的理论学习和实操训练，有效提升了参训人员的消防安全意识和应急处置能力。后续将继续加强日常监督和定期培训，确保消防安全工作落到实处。

报告生成时间：${new Date().toLocaleString()}
编制单位：XX街道消防办`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${training.title}_总结报告.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: 'trainings', label: '培训列表', icon: BookOpen },
    { id: 'exams', label: '考试测评', icon: ClipboardList },
    { id: 'drills', label: '疏散演练记录', icon: Activity }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="培训总数"
          value={totalTrainings}
          icon={GraduationCap}
          color="red"
          trend="本月 +3"
          trendUp
        />
        <StatsCard
          title="参训总人数"
          value={totalParticipants}
          icon={Users}
          color="blue"
          trend="较上月 +120"
          trendUp
        />
        <StatsCard
          title="演练次数"
          value={totalDrills}
          icon={Activity}
          color="amber"
          trend="本季度 +5"
          trendUp
        />
        <StatsCard
          title="平均考试分数"
          value={avgExamScore}
          icon={Award}
          color="green"
          trend="通过率 80%"
          trendUp
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="border-b border-slate-200">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={cn(
                  'flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors',
                  activeTab === tab.id
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'trainings' && (
          <div>
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">培训计划管理</h2>
                  <p className="text-sm text-slate-500 mt-1">
                    管理消防安全培训计划，查看培训详情和签到记录
                  </p>
                </div>
                <button
                  onClick={() => setShowAddTrainingModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm font-medium">新建培训</span>
                </button>
              </div>
            </div>

            <div className="p-4 border-b border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="搜索培训名称、类型..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                    <option value="已结束">已结束</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="divide-y divide-slate-200">
              {filteredTrainings.map((training) => (
                <div
                  key={training.id}
                  className="p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => openTrainingDetail(training)}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-base font-semibold text-slate-800 truncate">
                            {training.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 mt-2">
                            <span className="inline-flex items-center gap-1.5 text-sm text-slate-600">
                              <CalendarDays className="w-4 h-4 text-slate-400" />
                              {training.date}
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-sm text-slate-600">
                              <MapPin className="w-4 h-4 text-slate-400" />
                              {training.location}
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-sm text-slate-600">
                              <Users className="w-4 h-4 text-slate-400" />
                              {training.participants} 人
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-sm text-slate-600">
                              <Clock className="w-4 h-4 text-slate-400" />
                              {training.duration} 分钟
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                            {training.type}
                          </span>
                          {training.status && (
                            <StatusTag status={training.status} variant="training" />
                          )}
                        </div>
                      </div>
                      {training.description && (
                        <p className="text-sm text-slate-500 mt-2 line-clamp-2">
                          {training.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex -space-x-2">
                          {training.attendeeList.slice(0, 5).map((_, idx) => (
                            <div
                              key={idx}
                              className="w-7 h-7 bg-slate-200 rounded-full border-2 border-white flex items-center justify-center"
                            >
                              <User className="w-3.5 h-3.5 text-slate-500" />
                            </div>
                          ))}
                          {training.attendeeList.length > 5 && (
                            <div className="w-7 h-7 bg-slate-100 rounded-full border-2 border-white flex items-center justify-center">
                              <span className="text-xs font-medium text-slate-600">
                                +{training.attendeeList.length - 5}
                              </span>
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-slate-500">
                          已签到{' '}
                          {
                            getTrainingAttendees(training.id).filter(
                              (a) => a.status !== '未签到'
                            ).length
                          }{' '}
                          / {training.participants}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'exams' && (
          <div>
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">考试成绩管理</h2>
                  <p className="text-sm text-slate-500 mt-1">
                    查看培训考试成绩，统计分析培训效果
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAddExamScoreModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm font-medium">补录成绩</span>
                  </button>
                  <button
                    onClick={exportExamScores}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span className="text-sm font-medium">导出成绩</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      考生信息
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      考试名称
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      分数
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      状态
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      提交时间
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      用时
                    </th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {examScores.map((exam) => (
                    <tr
                      key={exam.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-slate-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-800">
                              {exam.userName}
                            </p>
                            <p className="text-xs text-slate-500">{exam.unit}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-800">{exam.examTitle}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              'text-lg font-bold',
                              exam.isPassed ? 'text-green-600' : 'text-red-600'
                            )}
                          >
                            {exam.score}
                          </span>
                          <span className="text-sm text-slate-500">/ {exam.totalScore}</span>
                        </div>
                        <div className="w-24 h-1.5 bg-slate-200 rounded-full mt-1 overflow-hidden">
                          <div
                            className={cn(
                              'h-full rounded-full',
                              exam.isPassed ? 'bg-green-500' : 'bg-red-500'
                            )}
                            style={{
                              width: `${(exam.score / exam.totalScore) * 100}%`
                            }}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusTag
                          status={exam.isPassed ? '已通过' : '未通过'}
                          variant="exam"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-700">{exam.submitTime}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-700">{exam.duration} 分钟</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end">
                          <button
                            onClick={() => openExamDetail(exam)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="查看详情"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'drills' && (
          <div>
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">疏散演练记录</h2>
                  <p className="text-sm text-slate-500 mt-1">
                    记录和管理各单位消防应急疏散演练情况
                  </p>
                </div>
                <button
                  onClick={() => setShowAddDrillModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm font-medium">新增记录</span>
                </button>
              </div>
            </div>

            <div className="divide-y divide-slate-200">
              {drillRecords.map((drill) => (
                <div
                  key={drill.id}
                  className="p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => openDrillDetail(drill)}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Activity className="w-6 h-6 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-base font-semibold text-slate-800 truncate">
                            {drill.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 mt-2">
                            <span className="inline-flex items-center gap-1.5 text-sm text-slate-600">
                              <Building2 className="w-4 h-4 text-slate-400" />
                              {drill.unitName}
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-sm text-slate-600">
                              <CalendarDays className="w-4 h-4 text-slate-400" />
                              {drill.date}
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-sm text-slate-600">
                              <MapPin className="w-4 h-4 text-slate-400" />
                              {drill.location}
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-sm text-slate-600">
                              <Users className="w-4 h-4 text-slate-400" />
                              {drill.participants} 人
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                            {drill.type}
                          </span>
                          <StatusTag status={drill.result} variant="drill" />
                        </div>
                      </div>
                      <p className="text-sm text-slate-500 mt-2 line-clamp-2">
                        {drill.description}
                      </p>
                      <div className="flex items-center gap-4 mt-3">
                        <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                          <User className="w-3.5 h-3.5" />
                          评估人：{drill.evaluator}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                          <Clock className="w-3.5 h-3.5" />
                          用时：{drill.duration} 分钟
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showDetailModal && selectedTraining && (
        <TrainingDetailModal
          training={selectedTraining}
          attendees={getTrainingAttendees(selectedTraining.id)}
          examScores={getTrainingExamScores(selectedTraining.id)}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedTraining(null);
          }}
          onOpenSignIn={() => {
            setShowDetailModal(false);
            setShowSignInModal(true);
          }}
          onDownloadMaterial={downloadTrainingMaterial}
          onExportReport={() => exportTrainingReport(selectedTraining)}
        />
      )}

      {showExamModal && selectedExam && (
        <ExamDetailModal
          exam={selectedExam}
          onClose={() => {
            setShowExamModal(false);
            setSelectedExam(null);
          }}
        />
      )}

      {showDrillModal && selectedDrill && (
        <DrillDetailModal
          drill={selectedDrill}
          onClose={() => {
            setShowDrillModal(false);
            setSelectedDrill(null);
          }}
        />
      )}

      {showAddTrainingModal && (
        <AddTrainingModal
          onClose={() => setShowAddTrainingModal(false)}
          onSubmit={handleAddTraining}
        />
      )}

      {showSignInModal && selectedTraining && (
        <SignInModal
          training={selectedTraining}
          attendees={getTrainingAttendees(selectedTraining.id)}
          onClose={() => {
            setShowSignInModal(false);
            setSelectedTraining(null);
          }}
          onSignIn={handleSignIn}
        />
      )}

      {showAddDrillModal && (
        <AddDrillModal
          onClose={() => setShowAddDrillModal(false)}
          onSubmit={handleAddDrill}
        />
      )}

      {showAddExamScoreModal && (
        <AddExamScoreModal
          trainings={trainings}
          onClose={() => setShowAddExamScoreModal(false)}
          onSubmit={(data) => {
            addExamScore({
              ...data,
              examId: 'e' + Date.now(),
              isPassed: data.score >= data.passScore,
              submitTime: new Date().toLocaleString(),
              duration: 0
            });
            setShowAddExamScoreModal(false);
          }}
        />
      )}
    </div>
  );
}

function TrainingDetailModal({
  training,
  attendees,
  examScores,
  onClose,
  onOpenSignIn,
  onDownloadMaterial,
  onExportReport
}: {
  training: Training;
  attendees: AttendeeRecord[];
  examScores: ExamScore[];
  onClose: () => void;
  onOpenSignIn: () => void;
  onDownloadMaterial: () => void;
  onExportReport: () => void;
}) {
  const [activeSubTab, setActiveSubTab] = useState<'info' | 'attendees' | 'exams'>('info');

  const signedInCount = attendees.filter((a) => a.status !== '未签到').length;
  const passCount = examScores.filter((e) => e.isPassed).length;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">{training.title}</h3>
            <p className="text-sm text-slate-500 mt-1">培训详情</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="border-b border-slate-200">
          <div className="flex">
            {[
              { id: 'info', label: '基本信息', icon: FileText },
              { id: 'attendees', label: '签到记录', icon: Users },
              { id: 'exams', label: '考试成绩', icon: ClipboardList }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as typeof activeSubTab)}
                className={cn(
                  'flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors',
                  activeSubTab === tab.id
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-slate-600 hover:text-slate-800'
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {activeSubTab === 'info' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500">培训类型</p>
                  <p className="text-lg font-semibold text-slate-800 mt-1">{training.type}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500">培训状态</p>
                  <div className="mt-1">
                    {training.status && (
                      <StatusTag status={training.status} variant="training" />
                    )}
                  </div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500">参训人数</p>
                  <p className="text-lg font-semibold text-slate-800 mt-1">
                    {training.participants} 人
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500">培训时长</p>
                  <p className="text-lg font-semibold text-slate-800 mt-1">
                    {training.duration} 分钟
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-slate-500 mb-2">培训时间</h4>
                  <p className="text-slate-800">{training.date}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-500 mb-2">培训地点</h4>
                  <p className="text-slate-800">{training.location}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-500 mb-2">主讲人</h4>
                  <p className="text-slate-800">{training.instructor || '-'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-500 mb-2">培训简介</h4>
                  <p className="text-slate-800 leading-relaxed">{training.description}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-500 mb-2">培训资料</h4>
                  <div className="space-y-2">
                    <div
                      className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={onDownloadMaterial}
                    >
                      <FileText className="w-5 h-5 text-slate-400" />
                      <span className="text-sm text-slate-700 flex-1">消防安全培训资料.txt</span>
                      <button className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        下载
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'attendees' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-slate-600">
                    已签到：<span className="font-semibold text-green-600">{signedInCount}</span> /{' '}
                    {attendees.length}
                  </span>
                  <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${attendees.length > 0 ? (signedInCount / attendees.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                <button
                  onClick={onOpenSignIn}
                  className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                >
                  <PlayCircle className="w-4 h-4" />
                  开始签到
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase">
                        姓名
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase">
                        单位
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase">
                        签到时间
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase">
                        签退时间
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase">
                        状态
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {attendees.map((attendee) => (
                      <tr key={attendee.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-slate-500" />
                            </div>
                            <span className="text-sm font-medium text-slate-800">
                              {attendee.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-slate-700">{attendee.unit}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-slate-700">
                            {attendee.signInTime || '-'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-slate-700">
                            {attendee.signOutTime || '-'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <StatusTag status={attendee.status} variant="attendee" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSubTab === 'exams' && (
            <div className="space-y-4">
              {examScores.length > 0 ? (
                <>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-600">
                      通过人数：
                      <span className="font-semibold text-green-600">{passCount}</span> /{' '}
                      {examScores.length}
                    </span>
                    <span className="text-sm text-slate-600">
                      平均分：
                      <span className="font-semibold text-slate-800">
                        {examScores.length > 0
                          ? Math.round(
                              examScores.reduce((sum, e) => sum + e.score, 0) / examScores.length
                            )
                          : 0}
                      </span>
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase">
                            姓名
                          </th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase">
                            单位
                          </th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase">
                            分数
                          </th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase">
                            状态
                          </th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase">
                            提交时间
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {examScores.map((score) => (
                          <tr key={score.id} className="hover:bg-slate-50">
                            <td className="px-4 py-3">
                              <span className="text-sm font-medium text-slate-800">
                                {score.userName}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm text-slate-700">{score.unit}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={cn(
                                  'text-sm font-semibold',
                                  score.isPassed ? 'text-green-600' : 'text-red-600'
                                )}
                              >
                                {score.score} / {score.totalScore}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <StatusTag
                                status={score.isPassed ? '已通过' : '未通过'}
                                variant="exam"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm text-slate-700">{score.submitTime}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <AlertCircle className="w-12 h-12 text-slate-300 mb-3" />
                  <p className="text-slate-500">暂无考试成绩</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            关闭
          </button>
          <button
            onClick={onExportReport}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            导出报告
          </button>
          {training.status === '进行中' && (
            <button
              onClick={onOpenSignIn}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              开始签到
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ExamDetailModal({
  exam,
  onClose
}: {
  exam: ExamScore;
  onClose: () => void;
}) {
  const questions = mockExamQuestions;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">{exam.examTitle}</h3>
            <p className="text-sm text-slate-500 mt-1">
              {exam.userName} 的考试详情
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 border-b border-slate-200 bg-slate-50">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-slate-500">得分</p>
              <p
                className={cn(
                  'text-3xl font-bold mt-1',
                  exam.isPassed ? 'text-green-600' : 'text-red-600'
                )}
              >
                {exam.score}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-500">总分</p>
              <p className="text-3xl font-bold mt-1 text-slate-800">{exam.totalScore}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-500">及格线</p>
              <p className="text-3xl font-bold mt-1 text-amber-600">{exam.passScore}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-500">状态</p>
              <div className="mt-2 flex justify-center">
                <StatusTag
                  status={exam.isPassed ? '已通过' : '未通过'}
                  variant="exam"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-300px)] space-y-6">
          {questions.map((q, idx) => (
            <div key={q.id} className="border border-slate-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center text-sm font-medium text-slate-600 flex-shrink-0">
                  {idx + 1}
                </span>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <p className="text-sm font-medium text-slate-800">{q.question}</p>
                    <span className="text-xs text-slate-500 flex-shrink-0 ml-2">
                      {q.score} 分
                    </span>
                  </div>
                  <span className="inline-block mt-2 px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded">
                    {q.type === 'single'
                      ? '单选题'
                      : q.type === 'multiple'
                      ? '多选题'
                      : '判断题'}
                  </span>
                  <div className="mt-3 space-y-2">
                    {q.options.map((opt, optIdx) => (
                      <div
                        key={optIdx}
                        className={cn(
                          'flex items-center gap-2 p-2 rounded-lg text-sm',
                          Array.isArray(q.correctAnswer)
                            ? q.correctAnswer.includes(opt)
                              ? 'bg-green-50 text-green-700'
                              : 'text-slate-700'
                            : q.correctAnswer === opt
                            ? 'bg-green-50 text-green-700'
                            : 'text-slate-700'
                        )}
                      >
                        {Array.isArray(q.correctAnswer)
                          ? q.correctAnswer.includes(opt) && (
                              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                            )
                          : q.correctAnswer === opt && (
                              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                            )}
                        <span>
                          {String.fromCharCode(65 + optIdx)}. {opt}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}

function DrillDetailModal({
  drill,
  onClose
}: {
  drill: DrillRecord;
  onClose: () => void;
}) {
  const exportDrillReport = () => {
    const content = `消防应急疏散演练报告

演练基本信息
==================
演练标题：${drill.title}
演练类型：${drill.type}
演练单位：${drill.unitName}
演练时间：${drill.date}
演练地点：${drill.location}
参演人数：${drill.participants} 人
演练时长：${drill.duration} 分钟
评估人：${drill.evaluator}
评估结果：${drill.result}

演练概况
==================
${drill.description}

存在问题
==================
${drill.problems || '无'}

改进措施
==================
${drill.improvement || '无'}

评估结论
==================
经评估，本次演练整体${drill.result === '优秀' ? '表现优秀，达到预期效果' : 
  drill.result === '良好' ? '表现良好，基本达到预期效果' :
  drill.result === '合格' ? '表现合格，基本满足要求' : '未达到合格标准，需重新组织演练'}。
针对演练中发现的问题，已提出相应改进措施，要求相关单位限期落实整改，确保消防安全。

报告生成时间：${new Date().toLocaleString()}
编制单位：XX街道消防办`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeTitle = drill.title.replace(/[<>:"/\\|?*]/g, '_');
    link.download = `${drill.date}_${safeTitle}_演练报告.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">{drill.title}</h3>
            <p className="text-sm text-slate-500 mt-1">演练详情</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-sm text-slate-500">演练类型</p>
              <p className="text-base font-semibold text-slate-800 mt-1">{drill.type}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-sm text-slate-500">演练结果</p>
              <div className="mt-1">
                <StatusTag status={drill.result} variant="drill" />
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-sm text-slate-500">参演人数</p>
              <p className="text-base font-semibold text-slate-800 mt-1">
                {drill.participants} 人
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-sm text-slate-500">演练时长</p>
              <p className="text-base font-semibold text-slate-800 mt-1">
                {drill.duration} 分钟
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-slate-500 mb-2">演练单位</h4>
              <p className="text-slate-800">{drill.unitName}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-slate-500 mb-2">演练时间</h4>
              <p className="text-slate-800">{drill.date}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-slate-500 mb-2">演练地点</h4>
              <p className="text-slate-800">{drill.location}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-slate-500 mb-2">评估人</h4>
              <p className="text-slate-800">{drill.evaluator}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-slate-500 mb-2">演练概况</h4>
              <p className="text-slate-800 leading-relaxed">{drill.description}</p>
            </div>
            {drill.problems && (
              <div className="bg-red-50 rounded-xl p-4">
                <h4 className="text-sm font-medium text-red-700 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  存在问题
                </h4>
                <p className="text-red-800 leading-relaxed">{drill.problems}</p>
              </div>
            )}
            {drill.improvement && (
              <div className="bg-blue-50 rounded-xl p-4">
                <h4 className="text-sm font-medium text-blue-700 mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  改进措施
                </h4>
                <p className="text-blue-800 leading-relaxed">{drill.improvement}</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            关闭
          </button>
          <button
            onClick={exportDrillReport}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            导出报告
          </button>
        </div>
      </div>
    </div>
  );
}

function AddTrainingModal({
  onClose,
  onSubmit
}: {
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    type: TrainingType;
    date: string;
    location: string;
    participants: number;
    duration: number;
    description?: string;
    attendees: AttendeeFormItem[];
  }) => void;
}) {
  const [formData, setFormData] = useState({
    title: '',
    type: '消防知识培训' as TrainingType,
    date: new Date().toISOString().split('T')[0],
    location: '',
    participants: 0,
    duration: 0,
    description: ''
  });

  const [attendees, setAttendees] = useState<AttendeeFormItem[]>([]);

  const addAttendee = () => {
    setAttendees([...attendees, { name: '', unit: '', phone: '' }]);
  };

  const removeAttendee = (index: number) => {
    setAttendees(attendees.filter((_, i) => i !== index));
  };

  const updateAttendee = (index: number, field: keyof AttendeeFormItem, value: string) => {
    const newAttendees = [...attendees];
    newAttendees[index][field] = value;
    setAttendees(newAttendees);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      attendees
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">新建培训</h3>
            <p className="text-sm text-slate-500 mt-1">创建新的消防安全培训计划</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              培训名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="请输入培训名称"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              培训类型 <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as TrainingType })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
            >
              <option value="消防知识培训">消防知识培训</option>
              <option value="应急演练">应急演练</option>
              <option value="技能培训">技能培训</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                培训日期 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                培训时长(分钟) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.duration || ''}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="请输入时长"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              培训地点 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="请输入培训地点"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              参与人数 <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              min="1"
              value={formData.participants || ''}
              onChange={(e) => setFormData({ ...formData, participants: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="请输入参与人数"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              培训简介
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              placeholder="请输入培训简介"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700">
                参训人员
              </label>
              <button
                type="button"
                onClick={addAttendee}
                className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 font-medium"
              >
                <Plus className="w-4 h-4" />
                添加人员
              </button>
            </div>
            <div className="space-y-3">
              {attendees.map((attendee, index) => (
                <div key={index} className="p-3 bg-slate-50 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">人员 {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeAttendee(index)}
                      className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <input
                        type="text"
                        value={attendee.name}
                        onChange={(e) => updateAttendee(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
                        placeholder="姓名"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={attendee.unit}
                        onChange={(e) => updateAttendee(index, 'unit', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
                        placeholder="单位"
                      />
                    </div>
                  </div>
                  <div>
                    <input
                      type="text"
                      value={attendee.phone}
                      onChange={(e) => updateAttendee(index, 'phone', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
                      placeholder="联系电话"
                    />
                  </div>
                </div>
              ))}
              {attendees.length === 0 && (
                <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-lg">
                  <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">点击上方"添加人员"按钮添加参训人员</p>
                </div>
              )}
            </div>
          </div>
        </form>

        <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            取消
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            创建培训
          </button>
        </div>
      </div>
    </div>
  );
}

function SignInModal({
  training,
  attendees,
  onClose,
  onSignIn
}: {
  training: Training;
  attendees: AttendeeRecord[];
  onClose: () => void;
  onSignIn: (attendeeId: string, action: 'signin' | 'signout') => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">签到管理</h3>
            <p className="text-sm text-slate-500 mt-1">{training.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-3">
            {attendees.map((attendee) => (
              <div
                key={attendee.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <User className="w-5 h-5 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{attendee.name}</p>
                    <p className="text-xs text-slate-500">{attendee.unit}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusTag status={attendee.status} variant="attendee" />
                  {attendee.status === '未签到' && (
                    <button
                      onClick={() => onSignIn(attendee.id, 'signin')}
                      className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      签到
                    </button>
                  )}
                  {attendee.status === '已签到' && (
                    <button
                      onClick={() => onSignIn(attendee.id, 'signout')}
                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      签退
                    </button>
                  )}
                </div>
              </div>
            ))}
            {attendees.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="w-12 h-12 text-slate-300 mb-3" />
                <p className="text-slate-500">暂无参训人员</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}

function AddDrillModal({
  onClose,
  onSubmit
}: {
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    unitName: string;
    date: string;
    location: string;
    participants: number;
    description: string;
    problems?: string;
    improvement?: string;
  }) => void;
}) {
  const [formData, setFormData] = useState({
    title: '',
    unitName: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    participants: 0,
    description: '',
    problems: '',
    improvement: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">新增演练记录</h3>
            <p className="text-sm text-slate-500 mt-1">记录消防应急疏散演练情况</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              演练标题 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="请输入演练标题"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              参演单位 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.unitName}
              onChange={(e) => setFormData({ ...formData, unitName: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="请输入参演单位名称"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                演练时间 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                参演人数 <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.participants || ''}
                onChange={(e) => setFormData({ ...formData, participants: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="请输入人数"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              演练地点 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="请输入演练地点"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              演练概况 <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              placeholder="请简要描述演练过程"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              存在问题
            </label>
            <textarea
              rows={2}
              value={formData.problems}
              onChange={(e) => setFormData({ ...formData, problems: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              placeholder="请描述演练中发现的问题"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              改进措施
            </label>
            <textarea
              rows={2}
              value={formData.improvement}
              onChange={(e) => setFormData({ ...formData, improvement: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              placeholder="请提出改进措施和建议"
            />
          </div>
        </form>

        <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            取消
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            保存记录
          </button>
        </div>
      </div>
    </div>
  );
}

function AddExamScoreModal({
  trainings,
  onClose,
  onSubmit
}: {
  trainings: Training[];
  onClose: () => void;
  onSubmit: (data: {
    trainingId?: string;
    examTitle: string;
    userName: string;
    unit: string;
    score: number;
    totalScore: number;
    passScore: number;
  }) => void;
}) {
  const [formData, setFormData] = useState({
    trainingId: '',
    examTitle: '',
    userName: '',
    unit: '',
    score: 0,
    totalScore: 100,
    passScore: 60
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      trainingId: formData.trainingId || undefined
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">补录成绩</h3>
            <p className="text-sm text-slate-500 mt-1">手动录入考试成绩记录</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              所属培训
            </label>
            <select
              value={formData.trainingId}
              onChange={(e) => setFormData({ ...formData, trainingId: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
            >
              <option value="">请选择培训（可选）</option>
              {trainings.map((training) => (
                <option key={training.id} value={training.id}>
                  {training.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              考试名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.examTitle}
              onChange={(e) => setFormData({ ...formData, examTitle: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="请输入考试名称"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                人员姓名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.userName}
                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="请输入姓名"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                单位 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="请输入单位"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                分数 <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.score || ''}
                onChange={(e) => setFormData({ ...formData, score: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="分数"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                总分 <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.totalScore || ''}
                onChange={(e) => setFormData({ ...formData, totalScore: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="总分"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                及格线 <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.passScore || ''}
                onChange={(e) => setFormData({ ...formData, passScore: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="及格线"
              />
            </div>
          </div>
        </form>

        <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            取消
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            保存成绩
          </button>
        </div>
      </div>
    </div>
  );
}