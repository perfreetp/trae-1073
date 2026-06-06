import type { Unit, Facility, InspectionPlan, Hazard, Report, Training, AreaStats, HazardStats, MonthlyStats, CheckList, AttendeeRecord, ExamScore, DrillRecord, Exam, ExamQuestion } from '@/types';

export const mockUnits: Unit[] = [
  {
    id: 'u1',
    name: '万达广场',
    address: '中山路168号',
    type: '商场',
    level: '重点',
    contact: '张经理',
    phone: '138****1234',
    area: 50000,
    floorCount: 6,
    establishDate: '2018-05-20',
    createdAt: '2024-01-15',
    lat: 31.2304,
    lng: 121.4737,
    riskScore: 75
  },
  {
    id: 'u2',
    name: '希尔顿酒店',
    address: '人民路88号',
    type: '酒店',
    level: '重点',
    contact: '李总监',
    phone: '139****5678',
    area: 35000,
    floorCount: 22,
    establishDate: '2015-10-01',
    createdAt: '2024-01-20',
    lat: 31.2354,
    lng: 121.4687,
    riskScore: 62
  },
  {
    id: 'u3',
    name: '华阳电子厂',
    address: '工业园区创业路12号',
    type: '工厂',
    level: '重点',
    contact: '王厂长',
    phone: '137****9012',
    area: 20000,
    floorCount: 3,
    establishDate: '2012-03-15',
    createdAt: '2024-02-01',
    lat: 31.2254,
    lng: 121.4837,
    riskScore: 85
  },
  {
    id: 'u4',
    name: '实验小学',
    address: '学府路45号',
    type: '学校',
    level: '一般',
    contact: '赵校长',
    phone: '136****3456',
    area: 15000,
    floorCount: 5,
    establishDate: '2005-09-01',
    createdAt: '2024-02-10',
    lat: 31.2204,
    lng: 121.4787,
    riskScore: 35
  },
  {
    id: 'u5',
    name: '第一人民医院',
    address: '健康路100号',
    type: '医院',
    level: '重点',
    contact: '孙主任',
    phone: '135****7890',
    area: 45000,
    floorCount: 15,
    establishDate: '2010-06-18',
    createdAt: '2024-02-15',
    lat: 31.2404,
    lng: 121.4707,
    riskScore: 68
  },
  {
    id: 'u6',
    name: '阳光花园小区',
    address: '长江路200号',
    type: '住宅小区',
    level: '一般',
    contact: '陈物业',
    phone: '134****2345',
    area: 80000,
    floorCount: 18,
    establishDate: '2016-12-01',
    createdAt: '2024-03-01',
    lat: 31.2154,
    lng: 121.4657,
    riskScore: 42
  },
  {
    id: 'u7',
    name: '家乐福超市',
    address: '解放路66号',
    type: '商场',
    level: '关注',
    contact: '刘店长',
    phone: '133****6789',
    area: 8000,
    floorCount: 2,
    establishDate: '2019-08-10',
    createdAt: '2024-03-05',
    lat: 31.2324,
    lng: 121.4807,
    riskScore: 55
  },
  {
    id: 'u8',
    name: '星光KTV',
    address: '娱乐街33号',
    type: '其他',
    level: '关注',
    contact: '周老板',
    phone: '132****0123',
    area: 2000,
    floorCount: 3,
    establishDate: '2020-01-15',
    createdAt: '2024-03-10',
    lat: 31.2284,
    lng: 121.4757,
    riskScore: 70
  }
];

export const mockFacilities: Facility[] = [
  { id: 'f1', unitId: 'u1', name: '干粉灭火器', type: '灭火器', quantity: 120, expireDate: '2026-05-01', lastMaintenance: '2025-03-15', status: '正常' },
  { id: 'f2', unitId: 'u1', name: '室内消火栓', type: '消火栓', quantity: 45, expireDate: '2027-01-10', lastMaintenance: '2025-02-20', status: '正常' },
  { id: 'f3', unitId: 'u1', name: '烟感探测器', type: '烟感探测器', quantity: 200, expireDate: '2026-08-15', lastMaintenance: '2025-04-01', status: '正常' },
  { id: 'f4', unitId: 'u2', name: '自动喷淋系统', type: '喷淋系统', quantity: 500, expireDate: '2026-12-01', lastMaintenance: '2025-01-10', status: '正常' },
  { id: 'f5', unitId: 'u2', name: '应急照明灯', type: '应急照明', quantity: 80, expireDate: '2025-11-30', lastMaintenance: '2024-12-01', status: '过期' },
  { id: 'f6', unitId: 'u3', name: '二氧化碳灭火器', type: '灭火器', quantity: 60, expireDate: '2026-03-20', lastMaintenance: '2025-03-01', status: '正常' },
  { id: 'f7', unitId: 'u3', name: '消防栓', type: '消火栓', quantity: 30, expireDate: '2027-05-10', lastMaintenance: '2025-03-10', status: '正常' },
  { id: 'f8', unitId: 'u4', name: 'ABC干粉灭火器', type: '灭火器', quantity: 50, expireDate: '2025-10-15', lastMaintenance: '2024-10-15', status: '维修中' },
  { id: 'f9', unitId: 'u5', name: '疏散指示标志', type: '疏散指示标志', quantity: 120, expireDate: '2026-06-30', lastMaintenance: '2025-04-10', status: '正常' },
  { id: 'f10', unitId: 'u6', name: '楼道灭火器', type: '灭火器', quantity: 72, expireDate: '2025-09-01', lastMaintenance: '2024-09-01', status: '缺失' }
];

export const mockInspectionPlans: InspectionPlan[] = [
  {
    id: 'p1',
    name: '2025年第二季度重点单位检查',
    type: '季度检查',
    startDate: '2025-04-01',
    endDate: '2025-06-30',
    unitIds: ['u1', 'u2', 'u3', 'u5'],
    status: '进行中',
    createdAt: '2025-03-20',
    inspector: '李消防'
  },
  {
    id: 'p2',
    name: '五一节前消防安全专项检查',
    type: '专项检查',
    startDate: '2025-04-20',
    endDate: '2025-04-30',
    unitIds: ['u1', 'u7', 'u8'],
    status: '已完成',
    createdAt: '2025-04-10',
    inspector: '王专干'
  },
  {
    id: 'p3',
    name: '月度日常巡查计划',
    type: '日常检查',
    startDate: '2025-05-01',
    endDate: '2025-05-31',
    unitIds: ['u4', 'u6'],
    status: '未开始',
    createdAt: '2025-04-25',
    inspector: '张消防'
  },
  {
    id: 'p4',
    name: '2025年度消防设施检测计划',
    type: '年度检查',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    unitIds: ['u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'u7', 'u8'],
    status: '进行中',
    createdAt: '2024-12-15',
    inspector: '赵监督员'
  }
];

export const mockHazards: Hazard[] = [
  {
    id: 'h1',
    unitId: 'u1',
    description: '3层西侧疏散通道堆放货物，影响疏散',
    location: '万达广场3层西侧',
    level: '较大',
    images: ['/img1.jpg', '/img2.jpg'],
    status: '整改中',
    foundDate: '2025-04-15',
    deadline: '2025-04-25',
    responsiblePerson: '张经理',
    responsiblePhone: '138****1234'
  },
  {
    id: 'h2',
    unitId: 'u3',
    description: '生产车间消防通道被设备占用，宽度不足1.5米',
    location: '华阳电子厂生产车间A区',
    level: '重大',
    images: ['/img3.jpg'],
    status: '待整改',
    foundDate: '2025-04-18',
    deadline: '2025-04-28',
    responsiblePerson: '王厂长',
    responsiblePhone: '137****9012'
  },
  {
    id: 'h3',
    unitId: 'u5',
    description: '住院部部分应急照明灯损坏',
    location: '第一人民医院住院部2-5层',
    level: '一般',
    images: ['/img4.jpg', '/img5.jpg'],
    status: '待复查',
    foundDate: '2025-04-10',
    deadline: '2025-04-20',
    responsiblePerson: '孙主任',
    responsiblePhone: '135****7890',
    rectificationDescription: '已更换全部损坏的应急照明灯',
    rectificationImages: ['/img6.jpg', '/img7.jpg']
  },
  {
    id: 'h4',
    unitId: 'u8',
    description: 'KTV包间内未设置疏散指示标志',
    location: '星光KTV2-3层包间',
    level: '较大',
    images: ['/img8.jpg'],
    status: '已逾期',
    foundDate: '2025-03-20',
    deadline: '2025-04-05',
    responsiblePerson: '周老板',
    responsiblePhone: '132****0123'
  },
  {
    id: 'h5',
    unitId: 'u2',
    description: '消防控制室值班人员无证上岗',
    location: '希尔顿酒店消防控制室',
    level: '重大',
    images: ['/img9.jpg'],
    status: '已完成',
    foundDate: '2025-03-15',
    deadline: '2025-03-25',
    responsiblePerson: '李总监',
    responsiblePhone: '139****5678',
    rectificationDescription: '已安排两名值班人员参加消防培训并取得证书',
    rectificationImages: ['/img10.jpg'],
    recheckDate: '2025-03-28',
    recheckResult: '通过',
    rechecker: '王专干'
  },
  {
    id: 'h6',
    unitId: 'u7',
    description: '超市安全出口锁闭',
    location: '家乐福超市东侧安全出口',
    level: '较大',
    images: ['/img11.jpg'],
    status: '整改中',
    foundDate: '2025-04-20',
    deadline: '2025-04-23',
    responsiblePerson: '刘店长',
    responsiblePhone: '133****6789'
  },
  {
    id: 'h7',
    unitId: 'u6',
    description: '小区楼道堆放杂物',
    location: '阳光花园3号楼2单元',
    level: '一般',
    images: ['/img12.jpg'],
    status: '已完成',
    foundDate: '2025-04-05',
    deadline: '2025-04-12',
    responsiblePerson: '陈物业',
    responsiblePhone: '134****2345',
    rectificationDescription: '已清理楼道杂物，并对业主进行消防安全宣传',
    rectificationImages: ['/img13.jpg'],
    recheckDate: '2025-04-14',
    recheckResult: '通过',
    rechecker: '李消防'
  }
];

export const mockReports: Report[] = [
  {
    id: 'r1',
    title: '某小区楼道消防通道被占用',
    reporterName: '匿名',
    location: '阳光花园小区5号楼',
    description: '5号楼3单元楼道内长期停放电动车，堵塞消防通道',
    images: ['/rep1.jpg'],
    status: '处理中',
    handler: '王专干',
    createdAt: '2025-04-18',
    updatedAt: '2025-04-19'
  },
  {
    id: 'r2',
    title: '网吧消防设施缺失',
    reporterName: '张先生',
    reporterPhone: '138****8888',
    location: '人民路123号极速网吧',
    description: '网吧内未见灭火器，疏散通道不明确',
    images: ['/rep2.jpg', '/rep3.jpg'],
    status: '已处理',
    handler: '李消防',
    handleResult: '已责令网吧限期整改，配备消防设施',
    createdAt: '2025-04-10',
    updatedAt: '2025-04-15'
  },
  {
    id: 'r3',
    title: '饭店后厨燃气使用不规范',
    reporterName: '李女士',
    reporterPhone: '139****9999',
    location: '美食街8号老厨房饭店',
    description: '后厨燃气管道老化，未安装燃气报警器',
    images: ['/rep4.jpg'],
    status: '待受理',
    createdAt: '2025-04-22',
    updatedAt: '2025-04-22'
  },
  {
    id: 'r4',
    title: '商场消防通道被商铺占用',
    reporterName: '匿名',
    location: '万达广场1层',
    description: '部分商铺将货物堆放在消防通道上，影响通行',
    images: ['/rep5.jpg'],
    status: '已结案',
    handler: '赵监督员',
    handleResult: '已督促商场管理方清理通道，对相关商户进行处罚',
    createdAt: '2025-04-01',
    updatedAt: '2025-04-10'
  }
];

export const mockTrainings: Training[] = [
  {
    id: 't1',
    title: '2025年春季消防安全知识培训',
    type: '消防知识培训',
    date: '2025-03-15',
    location: '街道办事处会议室',
    participants: 85,
    duration: 180,
    materials: ['消防安全手册.pdf', '火灾案例视频.mp4'],
    attendeeList: ['张经理', '李总监', '王厂长', '赵校长', '孙主任', '陈物业', '刘店长', '周老板'],
    createdAt: '2025-03-01',
    status: '已结束',
    instructor: '李消防',
    description: '本次培训主要讲解消防安全基础知识、火灾预防措施、初期火灾扑救方法以及火场逃生自救技能，通过典型火灾案例分析，提高参训人员的消防安全意识和应急处置能力。'
  },
  {
    id: 't2',
    title: '万达广场消防应急演练',
    type: '应急演练',
    date: '2025-04-10',
    location: '万达广场',
    participants: 200,
    duration: 120,
    attendeeList: ['万达广场全体员工', '街道消防专干', '物业安保人员'],
    createdAt: '2025-03-25',
    status: '已结束',
    instructor: '王专干',
    description: '通过模拟火灾场景，检验商场工作人员的应急疏散能力和消防设施操作熟练度，完善应急预案，提高协同作战能力。'
  },
  {
    id: 't3',
    title: '消防设施操作技能培训',
    type: '技能培训',
    date: '2025-04-20',
    location: '消防培训基地',
    participants: 40,
    duration: 240,
    materials: ['灭火器使用指南.pdf', '消火栓操作手册.pdf'],
    attendeeList: ['各单位消防安全员'],
    createdAt: '2025-04-05',
    status: '进行中',
    instructor: '赵监督员',
    description: '针对各单位消防安全员开展的实操培训，包括灭火器、消火栓、喷淋系统等常用消防设施的正确使用方法和日常维护保养知识。'
  },
  {
    id: 't4',
    title: '住宅小区物业消防培训',
    type: '消防知识培训',
    date: '2025-04-25',
    location: '阳光花园小区活动室',
    participants: 30,
    duration: 150,
    attendeeList: ['各小区物业负责人', '保安队长'],
    createdAt: '2025-04-15',
    status: '未开始',
    instructor: '张消防',
    description: '针对住宅小区物业管理人员的专项培训，重点讲解小区消防通道管理、电动车充电安全、消防设施巡检等内容。'
  },
  {
    id: 't5',
    title: '公众聚集场所消防安全专项培训',
    type: '消防知识培训',
    date: '2025-05-08',
    location: '区消防大队会议室',
    participants: 60,
    duration: 200,
    materials: ['公众聚集场所消防规范.pdf'],
    attendeeList: ['各商场、酒店、娱乐场所负责人'],
    createdAt: '2025-04-20',
    status: '未开始',
    instructor: '李消防',
    description: '针对公众聚集场所的特点，讲解消防安全管理要点、应急疏散预案制定、员工消防培训要求等内容。'
  }
];

export const mockAttendeeRecords: AttendeeRecord[] = [
  { id: 'a1', trainingId: 't1', name: '张经理', unit: '万达广场', signInTime: '2025-03-15 08:55', signOutTime: '2025-03-15 11:50', status: '已签退' },
  { id: 'a2', trainingId: 't1', name: '李总监', unit: '希尔顿酒店', signInTime: '2025-03-15 08:58', signOutTime: '2025-03-15 11:52', status: '已签退' },
  { id: 'a3', trainingId: 't1', name: '王厂长', unit: '华阳电子厂', signInTime: '2025-03-15 09:02', signOutTime: '2025-03-15 11:48', status: '已签退' },
  { id: 'a4', trainingId: 't1', name: '赵校长', unit: '实验小学', signInTime: '2025-03-15 08:56', status: '已签到' },
  { id: 'a5', trainingId: 't1', name: '孙主任', unit: '第一人民医院', signInTime: '2025-03-15 09:00', signOutTime: '2025-03-15 11:55', status: '已签退' },
  { id: 'a6', trainingId: 't1', name: '陈物业', unit: '阳光花园小区', signInTime: '2025-03-15 09:05', status: '已签到' },
  { id: 'a7', trainingId: 't1', name: '刘店长', unit: '家乐福超市', signInTime: '2025-03-15 08:59', signOutTime: '2025-03-15 11:51', status: '已签退' },
  { id: 'a8', trainingId: 't1', name: '周老板', unit: '星光KTV', status: '未签到' },
  { id: 'a9', trainingId: 't3', name: '张安全', unit: '万达广场', signInTime: '2025-04-20 13:30', status: '已签到' },
  { id: 'a10', trainingId: 't3', name: '李安保', unit: '希尔顿酒店', signInTime: '2025-04-20 13:32', status: '已签到' },
  { id: 'a11', trainingId: 't3', name: '王消防', unit: '华阳电子厂', status: '未签到' },
  { id: 'a12', trainingId: 't3', name: '赵保安', unit: '实验小学', signInTime: '2025-04-20 13:28', status: '已签到' }
];

export const mockExamQuestions: ExamQuestion[] = [
  { id: 'q1', question: '我国消防工作的方针是？', type: 'single', options: ['以防为主，以消为辅', '预防为主，防消结合', '安全第一，预防为主', '谁主管，谁负责'], correctAnswer: '预防为主，防消结合', score: 10 },
  { id: 'q2', question: '使用灭火器扑救火灾时要对准火焰哪个部位喷射？', type: 'single', options: ['上部', '中部', '根部', '任意部位'], correctAnswer: '根部', score: 10 },
  { id: 'q3', question: '下列哪些属于常见的火灾隐患？', type: 'multiple', options: ['疏散通道堵塞', '消防设施损坏', '违规用电', '灭火器过期'], correctAnswer: ['疏散通道堵塞', '消防设施损坏', '违规用电', '灭火器过期'], score: 15 },
  { id: 'q4', question: '发生火灾时，可以乘坐普通电梯逃生。', type: 'judge', options: ['正确', '错误'], correctAnswer: '错误', score: 5 },
  { id: 'q5', question: '消防工作贯彻谁主管、谁负责的原则。', type: 'judge', options: ['正确', '错误'], correctAnswer: '正确', score: 5 },
  { id: 'q6', question: '下列哪些物质发生火灾不能用水扑救？', type: 'multiple', options: ['电器设备', '油类', '木材', '贵重仪器'], correctAnswer: ['电器设备', '油类', '贵重仪器'], score: 15 },
  { id: 'q7', question: '灭火器压力表指针在绿色区域表示？', type: 'single', options: ['压力过高', '压力正常', '压力不足', '需要维修'], correctAnswer: '压力正常', score: 10 },
  { id: 'q8', question: '室内消火栓的出水方向应该与墙面成多少度角？', type: 'single', options: ['30度', '45度', '60度', '90度'], correctAnswer: '90度', score: 10 },
  { id: 'q9', question: '火场逃生时，应该弯腰行走或匍匐前进，并用湿毛巾捂住口鼻。', type: 'judge', options: ['正确', '错误'], correctAnswer: '正确', score: 5 },
  { id: 'q10', question: '消防安全“四个能力”包括哪些？', type: 'multiple', options: ['检查消除火灾隐患能力', '组织扑救初起火灾能力', '组织人员疏散逃生能力', '消防宣传教育培训能力'], correctAnswer: ['检查消除火灾隐患能力', '组织扑救初起火灾能力', '组织人员疏散逃生能力', '消防宣传教育培训能力'], score: 20 }
];

export const mockExams: Exam[] = [
  {
    id: 'e1',
    title: '2025年春季消防安全知识考试',
    trainingId: 't1',
    questions: mockExamQuestions,
    passScore: 60,
    createdAt: '2025-03-10'
  },
  {
    id: 'e2',
    title: '消防设施操作技能考核',
    trainingId: 't3',
    questions: mockExamQuestions.slice(0, 5),
    passScore: 40,
    createdAt: '2025-04-15'
  }
];

export const mockExamScores: ExamScore[] = [
  { id: 'es1', examId: 'e1', examTitle: '2025年春季消防安全知识考试', trainingId: 't1', userName: '张经理', unit: '万达广场', score: 95, totalScore: 100, passScore: 60, isPassed: true, submitTime: '2025-03-15 11:30', duration: 25 },
  { id: 'es2', examId: 'e1', examTitle: '2025年春季消防安全知识考试', trainingId: 't1', userName: '李总监', unit: '希尔顿酒店', score: 88, totalScore: 100, passScore: 60, isPassed: true, submitTime: '2025-03-15 11:35', duration: 30 },
  { id: 'es3', examId: 'e1', examTitle: '2025年春季消防安全知识考试', trainingId: 't1', userName: '王厂长', unit: '华阳电子厂', score: 72, totalScore: 100, passScore: 60, isPassed: true, submitTime: '2025-03-15 11:28', duration: 35 },
  { id: 'es4', examId: 'e1', examTitle: '2025年春季消防安全知识考试', trainingId: 't1', userName: '赵校长', unit: '实验小学', score: 92, totalScore: 100, passScore: 60, isPassed: true, submitTime: '2025-03-15 11:32', duration: 28 },
  { id: 'es5', examId: 'e1', examTitle: '2025年春季消防安全知识考试', trainingId: 't1', userName: '孙主任', unit: '第一人民医院', score: 85, totalScore: 100, passScore: 60, isPassed: true, submitTime: '2025-03-15 11:38', duration: 32 },
  { id: 'es6', examId: 'e1', examTitle: '2025年春季消防安全知识考试', trainingId: 't1', userName: '陈物业', unit: '阳光花园小区', score: 55, totalScore: 100, passScore: 60, isPassed: false, submitTime: '2025-03-15 11:40', duration: 40 },
  { id: 'es7', examId: 'e1', examTitle: '2025年春季消防安全知识考试', trainingId: 't1', userName: '刘店长', unit: '家乐福超市', score: 78, totalScore: 100, passScore: 60, isPassed: true, submitTime: '2025-03-15 11:33', duration: 27 },
  { id: 'es8', examId: 'e2', examTitle: '消防设施操作技能考核', trainingId: 't3', userName: '张安全', unit: '万达广场', score: 45, totalScore: 50, passScore: 40, isPassed: true, submitTime: '2025-04-20 16:30', duration: 45 },
  { id: 'es9', examId: 'e2', examTitle: '消防设施操作技能考核', trainingId: 't3', userName: '李安保', unit: '希尔顿酒店', score: 38, totalScore: 50, passScore: 40, isPassed: false, submitTime: '2025-04-20 16:35', duration: 50 },
  { id: 'es10', examId: 'e2', examTitle: '消防设施操作技能考核', trainingId: 't3', userName: '赵保安', unit: '实验小学', score: 48, totalScore: 50, passScore: 40, isPassed: true, submitTime: '2025-04-20 16:25', duration: 40 }
];

export const mockDrillRecords: DrillRecord[] = [
  {
    id: 'd1',
    title: '万达广场2025年上半年消防疏散演练',
    unitId: 'u1',
    unitName: '万达广场',
    date: '2025-04-10',
    location: '万达广场',
    type: '消防疏散演练',
    participants: 200,
    duration: 120,
    evaluator: '王专干',
    result: '良好',
    description: '模拟商场3层发生火灾，启动应急预案，组织人员疏散，使用灭火器和消火栓进行初期火灾扑救。整个演练过程组织有序，人员疏散迅速，消防设施操作规范。',
    problems: '部分商户员工对疏散路线不够熟悉，疏散过程中存在观望现象；个别应急照明指示灯亮度不足。',
    improvement: '加强商户员工的消防培训，确保人人熟悉疏散路线；对应急照明设施进行全面检查和维护。',
    images: ['/drill1.jpg', '/drill2.jpg', '/drill3.jpg'],
    createdAt: '2025-04-10'
  },
  {
    id: 'd2',
    title: '华阳电子厂灭火应急演练',
    unitId: 'u3',
    unitName: '华阳电子厂',
    date: '2025-03-28',
    location: '华阳电子厂生产车间A区',
    type: '灭火演练',
    participants: 80,
    duration: 90,
    evaluator: '李消防',
    result: '优秀',
    description: '模拟生产车间电气火灾，演练员工报警、初期火灾扑救、人员疏散等内容。演练准备充分，指挥得当，参演人员反应迅速，操作规范。',
    problems: '部分新员工灭火器使用动作不够标准。',
    improvement: '组织新员工进行专项灭火器操作训练，确保人人熟练掌握。',
    images: ['/drill4.jpg', '/drill5.jpg'],
    createdAt: '2025-03-28'
  },
  {
    id: 'd3',
    title: '第一人民医院综合应急演练',
    unitId: 'u5',
    unitName: '第一人民医院',
    date: '2025-04-05',
    location: '第一人民医院住院部',
    type: '综合应急演练',
    participants: 150,
    duration: 150,
    evaluator: '赵监督员',
    result: '良好',
    description: '结合医院人员密集、病患行动不便的特点，演练火灾报警、病患转移、人员疏散、医疗救护等多科目综合应急处置。',
    problems: '病患转移过程中部分担架配合不够默契，影响疏散速度。',
    improvement: '加强医护人员与安保人员的协同训练，优化病患转移流程。',
    images: ['/drill6.jpg', '/drill7.jpg', '/drill8.jpg'],
    createdAt: '2025-04-05'
  },
  {
    id: 'd4',
    title: '实验小学消防疏散演练',
    unitId: 'u4',
    unitName: '实验小学',
    date: '2025-04-18',
    location: '实验小学教学楼',
    type: '消防疏散演练',
    participants: 500,
    duration: 60,
    evaluator: '张消防',
    result: '合格',
    description: '针对小学生特点，组织全校师生进行消防疏散演练，教授基本的火场逃生知识和技能。',
    problems: '低年级学生疏散速度较慢，部分学生在疏散过程中嬉笑打闹。',
    improvement: '加强对学生的消防安全教育，定期组织疏散演练，提高学生的应急意识。',
    images: ['/drill9.jpg', '/drill10.jpg'],
    createdAt: '2025-04-18'
  },
  {
    id: 'd5',
    title: '希尔顿酒店消防疏散演练',
    unitId: 'u2',
    unitName: '希尔顿酒店',
    date: '2025-04-22',
    location: '希尔顿酒店',
    type: '消防疏散演练',
    participants: 120,
    duration: 100,
    evaluator: '王专干',
    result: '优秀',
    description: '模拟酒店客房发生火灾，演练报警、疏散、搜救、灭火等科目。演练组织严密，各岗位人员职责明确，处置得当。',
    problems: '无明显问题',
    improvement: '继续保持定期演练，不断完善应急预案。',
    images: ['/drill11.jpg'],
    createdAt: '2025-04-22'
  }
];

export const mockAreaStats: AreaStats[] = [
  { name: '中山路街道', unitCount: 45, hazardCount: 128, rectificationRate: 92.5, inspectionRate: 95.2 },
  { name: '人民路街道', unitCount: 38, hazardCount: 96, rectificationRate: 88.3, inspectionRate: 92.1 },
  { name: '解放路街道', unitCount: 52, hazardCount: 156, rectificationRate: 85.6, inspectionRate: 88.7 },
  { name: '长江路街道', unitCount: 41, hazardCount: 89, rectificationRate: 94.2, inspectionRate: 96.8 },
  { name: '学府路街道', unitCount: 35, hazardCount: 68, rectificationRate: 96.1, inspectionRate: 98.3 }
];

export const mockHazardStats: HazardStats[] = [
  { level: '一般', count: 156 },
  { level: '较大', count: 89 },
  { level: '重大', count: 23 }
];

export const mockMonthlyStats: MonthlyStats[] = [
  { month: '1月', hazards: 42, rectified: 38, inspections: 28 },
  { month: '2月', hazards: 38, rectified: 35, inspections: 25 },
  { month: '3月', hazards: 56, rectified: 52, inspections: 35 },
  { month: '4月', hazards: 68, rectified: 45, inspections: 42 },
  { month: '5月', hazards: 45, rectified: 42, inspections: 38 },
  { month: '6月', hazards: 52, rectified: 48, inspections: 40 }
];

export const mockCheckLists: CheckList[] = [
  {
    id: 'cl1',
    name: '商场消防安全检查表',
    items: [
      { id: 'i1', question: '消防通道是否畅通无堵塞？', type: 'single', options: ['合格', '不合格'], required: true },
      { id: 'i2', question: '灭火器是否在有效期内？', type: 'single', options: ['合格', '不合格'], required: true },
      { id: 'i3', question: '消火栓是否完好可用？', type: 'single', options: ['合格', '不合格'], required: true },
      { id: 'i4', question: '应急照明是否正常工作？', type: 'single', options: ['合格', '不合格'], required: true },
      { id: 'i5', question: '疏散指示标志是否清晰可见？', type: 'single', options: ['合格', '不合格'], required: true },
      { id: 'i6', question: '烟感探测器是否正常运行？', type: 'single', options: ['合格', '不合格'], required: true },
      { id: 'i7', question: '喷淋系统是否处于正常状态？', type: 'single', options: ['合格', '不合格'], required: true },
      { id: 'i8', question: '消防控制室是否有人值班？', type: 'single', options: ['合格', '不合格'], required: true },
      { id: 'i9', question: '值班人员是否持证上岗？', type: 'single', options: ['合格', '不合格'], required: true },
      { id: 'i10', question: '请说明存在的主要问题', type: 'text', required: false }
    ],
    createdAt: '2024-12-01'
  },
  {
    id: 'cl2',
    name: '酒店消防安全检查表',
    items: [
      { id: 'i11', question: '客房疏散通道是否畅通？', type: 'single', options: ['合格', '不合格'], required: true },
      { id: 'i12', question: '客房内是否配备防毒面具？', type: 'single', options: ['合格', '不合格'], required: true },
      { id: 'i13', question: '厨房燃气管道是否有泄漏？', type: 'single', options: ['合格', '不合格'], required: true },
      { id: 'i14', question: '厨房是否安装燃气报警器？', type: 'single', options: ['合格', '不合格'], required: true },
      { id: 'i15', question: '消防电梯是否正常运行？', type: 'single', options: ['合格', '不合格'], required: true },
      { id: 'i16', question: '员工是否掌握灭火器使用方法？', type: 'single', options: ['是', '部分是', '否'], required: true },
      { id: 'i17', question: '请备注其他发现的问题', type: 'text', required: false }
    ],
    createdAt: '2024-12-15'
  },
  {
    id: 'cl3',
    name: '工厂消防安全检查表',
    items: [
      { id: 'i18', question: '生产车间消防通道宽度是否达标？', type: 'single', options: ['合格', '不合格'], required: true },
      { id: 'i19', question: '易燃易爆物品是否规范存放？', type: 'single', options: ['合格', '不合格'], required: true },
      { id: 'i20', question: '电气线路是否存在老化破损？', type: 'single', options: ['合格', '不合格'], required: true },
      { id: 'i21', question: '消防水泵是否正常运行？', type: 'single', options: ['合格', '不合格'], required: true },
      { id: 'i22', question: '是否有违规动火作业？', type: 'single', options: ['合格', '不合格'], required: true },
      { id: 'i23', question: '员工是否经过消防安全培训？', type: 'single', options: ['全部是', '部分是', '否'], required: true },
      { id: 'i24', question: '请描述发现的隐患细节', type: 'text', required: false }
    ],
    createdAt: '2025-01-05'
  },
  {
    id: 'cl4',
    name: '学校消防安全检查表',
    items: [
      { id: 'i25', question: '教学楼疏散通道是否畅通？', type: 'single', options: ['合格', '不合格'], required: true },
      { id: 'i26', question: '实验室化学品是否规范存放？', type: 'single', options: ['合格', '不合格'], required: true },
      { id: 'i27', question: '宿舍是否有违规用电现象？', type: 'single', options: ['合格', '不合格'], required: true },
      { id: 'i28', question: '消防演练是否定期开展？', type: 'single', options: ['合格', '不合格'], required: true },
      { id: 'i29', question: '师生是否掌握基本逃生技能？', type: 'single', options: ['全部是', '部分是', '否'], required: true },
      { id: 'i30', question: '其他需要说明的情况', type: 'text', required: false }
    ],
    createdAt: '2025-01-20'
  }
];

export const mockRedYellowCards = [
  { unitId: 'u3', unitName: '华阳电子厂', cardType: '红牌', reason: '存在重大火灾隐患，逾期未整改', date: '2025-04-15' },
  { unitId: 'u8', unitName: '星光KTV', cardType: '黄牌', reason: '多次发现同类隐患，整改不及时', date: '2025-04-10' },
  { unitId: 'u6', unitName: '阳光花园小区', cardType: '黄牌', reason: '消防设施维护不到位', date: '2025-03-28' }
];

export const mockSelfCheckRecords = [
  {
    id: 'sc1',
    unitId: 'u6',
    unitName: '阳光花园小区',
    checkDate: '2025-04-20',
    checker: '陈物业',
    checkerPhone: '134****2345',
    items: [
      { id: 'sci1', question: '消防通道是否畅通？', result: '合格' as const },
      { id: 'sci2', question: '楼道灭火器是否完好有效？', result: '合格' as const },
      { id: 'sci3', question: '消火栓是否有遮挡？', result: '不合格' as const, remark: '3号楼2单元消火栓被杂物遮挡' },
      { id: 'sci4', question: '应急照明是否正常？', result: '合格' as const },
      { id: 'sci5', question: '疏散指示标志是否完好？', result: '合格' as const }
    ],
    problems: '3号楼2单元消火栓被杂物遮挡，已通知业主清理；部分电动车在楼道内充电。',
    images: ['/selfcheck1.jpg', '/selfcheck2.jpg'],
    status: '已通过' as const,
    reviewComment: '自查认真，问题描述清晰，请尽快整改完成。',
    createdAt: '2025-04-20'
  },
  {
    id: 'sc2',
    unitId: 'u1',
    unitName: '万达广场',
    checkDate: '2025-04-18',
    checker: '张安全',
    checkerPhone: '138****1111',
    items: [
      { id: 'sci6', question: '消防通道是否畅通？', result: '合格' as const },
      { id: 'sci7', question: '灭火器是否在有效期内？', result: '合格' as const },
      { id: 'sci8', question: '消火栓是否完好可用？', result: '合格' as const },
      { id: 'sci9', question: '喷淋系统是否正常？', result: '合格' as const },
      { id: 'sci10', question: '消防控制室值班是否规范？', result: '合格' as const }
    ],
    problems: '未发现重大隐患，个别商铺货物摆放靠近通道，已现场整改。',
    images: ['/selfcheck3.jpg'],
    status: '已通过' as const,
    reviewComment: '自查情况良好，继续保持。',
    createdAt: '2025-04-18'
  },
  {
    id: 'sc3',
    unitId: 'u7',
    unitName: '家乐福超市',
    checkDate: '2025-04-22',
    checker: '刘店长',
    checkerPhone: '133****6789',
    items: [
      { id: 'sci11', question: '安全出口是否畅通？', result: '不合格' as const, remark: '东侧安全出口被购物车堵塞' },
      { id: 'sci12', question: '灭火器是否充足有效？', result: '合格' as const },
      { id: 'sci13', question: '应急照明是否正常？', result: '合格' as const },
      { id: 'sci14', question: '疏散指示是否清晰？', result: '合格' as const }
    ],
    problems: '东侧安全出口被购物车堵塞，需要立即清理；仓库部分货物堆放过高，影响烟感探测。',
    images: ['/selfcheck4.jpg', '/selfcheck5.jpg'],
    status: '待审核' as const,
    createdAt: '2025-04-22'
  },
  {
    id: 'sc4',
    unitId: 'u2',
    unitName: '希尔顿酒店',
    checkDate: '2025-04-15',
    checker: '李安保',
    checkerPhone: '139****2222',
    items: [
      { id: 'sci15', question: '客房疏散通道是否畅通？', result: '合格' as const },
      { id: 'sci16', question: '厨房燃气管道是否正常？', result: '合格' as const },
      { id: 'sci17', question: '消防电梯是否正常？', result: '合格' as const },
      { id: 'sci18', question: '防毒面具是否配备齐全？', result: '合格' as const }
    ],
    problems: '未发现明显隐患，各项设施运行正常。',
    images: [],
    status: '已驳回' as const,
    reviewComment: '请补充现场照片，检查项目不够全面，请增加对消防水泵、防排烟系统的检查。',
    createdAt: '2025-04-15'
  }
];
