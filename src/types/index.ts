export type UnitType = '商场' | '酒店' | '工厂' | '学校' | '医院' | '住宅小区' | '其他';
export type UnitLevel = '重点' | '一般' | '关注';
export type FacilityType = '灭火器' | '消火栓' | '烟感探测器' | '喷淋系统' | '应急照明' | '疏散指示标志' | '其他';
export type FacilityStatus = '正常' | '过期' | '维修中' | '缺失';
export type PlanType = '日常检查' | '专项检查' | '季度检查' | '年度检查';
export type PlanStatus = '未开始' | '进行中' | '已完成' | '已逾期';
export type HazardLevel = '一般' | '较大' | '重大';
export type HazardStatus = '待整改' | '整改中' | '待复查' | '已完成' | '已逾期';
export type ReportStatus = '待受理' | '处理中' | '已处理' | '已结案';
export type TrainingType = '消防知识培训' | '应急演练' | '技能培训';
export type UserRole = 'fire_officer' | 'property_manager' | 'fire_supervisor';

export interface Unit {
  id: string;
  name: string;
  address: string;
  type: UnitType;
  level: UnitLevel;
  contact: string;
  phone: string;
  area: number;
  floorCount: number;
  establishDate: string;
  createdAt: string;
  lat?: number;
  lng?: number;
  riskScore?: number;
}

export interface Facility {
  id: string;
  unitId: string;
  name: string;
  type: FacilityType;
  quantity: number;
  expireDate: string;
  lastMaintenance: string;
  status: FacilityStatus;
}

export interface InspectionPlan {
  id: string;
  name: string;
  type: PlanType;
  startDate: string;
  endDate: string;
  unitIds: string[];
  status: PlanStatus;
  createdAt: string;
  inspector?: string;
}

export interface CheckItem {
  id: string;
  question: string;
  type: 'single' | 'multiple' | 'text';
  options?: string[];
  required: boolean;
}

export interface CheckList {
  id: string;
  name: string;
  items: CheckItem[];
  createdAt: string;
}

export interface Hazard {
  id: string;
  unitId: string;
  inspectionId?: string;
  description: string;
  location: string;
  level: HazardLevel;
  images: string[];
  status: HazardStatus;
  foundDate: string;
  deadline: string;
  responsiblePerson: string;
  responsiblePhone: string;
  rectificationDescription?: string;
  rectificationImages?: string[];
  recheckDate?: string;
  recheckResult?: '通过' | '不通过';
  rechecker?: string;
}

export interface Report {
  id: string;
  title: string;
  reporterName?: string;
  reporterPhone?: string;
  location: string;
  description: string;
  images: string[];
  status: ReportStatus;
  handler?: string;
  handleResult?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Training {
  id: string;
  title: string;
  type: TrainingType;
  date: string;
  location: string;
  participants: number;
  duration: number;
  materials?: string[];
  attendeeList: string[];
  createdAt: string;
  status?: '未开始' | '进行中' | '已结束';
  instructor?: string;
  description?: string;
}

export interface AttendeeRecord {
  id: string;
  trainingId: string;
  name: string;
  unit: string;
  signInTime?: string;
  signOutTime?: string;
  status: '已签到' | '未签到' | '已签退';
}

export interface ExamScore {
  id: string;
  examId: string;
  examTitle: string;
  trainingId?: string;
  userName: string;
  unit: string;
  score: number;
  totalScore: number;
  passScore: number;
  isPassed: boolean;
  submitTime: string;
  duration: number;
}

export interface DrillRecord {
  id: string;
  title: string;
  unitId: string;
  unitName: string;
  date: string;
  location: string;
  type: '消防疏散演练' | '灭火演练' | '综合应急演练';
  participants: number;
  duration: number;
  evaluator: string;
  result: '优秀' | '良好' | '合格' | '不合格';
  description: string;
  problems?: string;
  improvement?: string;
  images?: string[];
  createdAt: string;
}

export interface ExamQuestion {
  id: string;
  question: string;
  type: 'single' | 'multiple' | 'judge';
  options: string[];
  correctAnswer: string | string[];
  score: number;
}

export interface Exam {
  id: string;
  title: string;
  trainingId?: string;
  questions: ExamQuestion[];
  passScore: number;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  phone: string;
  department?: string;
  avatar?: string;
}

export interface AreaStats {
  name: string;
  unitCount: number;
  hazardCount: number;
  rectificationRate: number;
  inspectionRate: number;
}

export interface HazardStats {
  level: HazardLevel;
  count: number;
}

export interface MonthlyStats {
  month: string;
  hazards: number;
  rectified: number;
  inspections: number;
}

export interface SelfCheckItem {
  id: string;
  question: string;
  result: '合格' | '不合格' | '不适用';
  remark?: string;
}

export interface SelfCheckRecord {
  id: string;
  unitId: string;
  unitName: string;
  checkDate: string;
  checker: string;
  checkerPhone: string;
  items: SelfCheckItem[];
  problems: string;
  images: string[];
  status: '待审核' | '已通过' | '已驳回';
  reviewComment?: string;
  createdAt: string;
}
