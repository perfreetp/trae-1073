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
  PlayCircle
} from 'lucide-react';
import { StatusTag } from '@/components/common/StatusTag';
import { StatsCard } from '@/components/common/StatsCard';
import {
  mockTrainings,
  mockAttendeeRecords,
  mockExamScores,
  mockDrillRecords,
  mockExams,
  mockExamQuestions
} from '@/utils/mock';
import type { Training, AttendeeRecord, ExamScore, DrillRecord, ExamQuestion } from '@/types';
import { cn } from '@/lib/utils';

type TabType = 'trainings' | 'exams' | 'drills';

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

  const totalTrainings = mockTrainings.length;
  const totalParticipants = mockTrainings.reduce((sum, t) => sum + t.participants, 0);
  const totalDrills = mockDrillRecords.length;
  const avgExamScore = Math.round(
    mockExamScores.reduce((sum, e) => sum + e.score, 0) / mockExamScores.length
  );

  const filteredTrainings = useMemo(() => {
    return mockTrainings.filter((training) => {
      const matchesSearch =
        training.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        training.type.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === '全部' || training.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  const getTrainingAttendees = (trainingId: string) => {
    return mockAttendeeRecords.filter((a) => a.trainingId === trainingId);
  };

  const getTrainingExamScores = (trainingId: string) => {
    return mockExamScores.filter((e) => e.trainingId === trainingId);
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
                <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm">
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
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
                  <Download className="w-4 h-4" />
                  <span className="text-sm font-medium">导出成绩</span>
                </button>
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
                  {mockExamScores.map((exam) => (
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
                <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm">
                  <Plus className="w-4 h-4" />
                  <span className="text-sm font-medium">新增记录</span>
                </button>
              </div>
            </div>

            <div className="divide-y divide-slate-200">
              {mockDrillRecords.map((drill) => (
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
    </div>
  );
}

function TrainingDetailModal({
  training,
  attendees,
  examScores,
  onClose
}: {
  training: Training;
  attendees: AttendeeRecord[];
  examScores: ExamScore[];
  onClose: () => void;
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
                {training.materials && training.materials.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 mb-2">培训资料</h4>
                    <div className="space-y-2">
                      {training.materials.map((material, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"
                        >
                          <FileText className="w-5 h-5 text-slate-400" />
                          <span className="text-sm text-slate-700 flex-1">{material}</span>
                          <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                            下载
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
                      style={{ width: `${(signedInCount / attendees.length) * 100}%` }}
                    />
                  </div>
                </div>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors">
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
                        {Math.round(
                          examScores.reduce((sum, e) => sum + e.score, 0) / examScores.length
                        )}
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
          {training.status === '进行中' && (
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              管理培训
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
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            导出报告
          </button>
        </div>
      </div>
    </div>
  );
}

function Plus({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function Building2({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </svg>
  );
}
