import { create } from 'zustand';
import type { Unit, Facility, InspectionPlan, Hazard, Report, Training, AttendeeRecord, ExamScore, DrillRecord, SelfCheckRecord, SupervisionRecord } from '@/types';
import {
  mockUnits,
  mockFacilities,
  mockInspectionPlans,
  mockHazards,
  mockReports,
  mockTrainings,
  mockAttendeeRecords,
  mockExamScores,
  mockDrillRecords,
  mockSelfCheckRecords
} from '@/utils/mock';

interface AppState {
  units: Unit[];
  facilities: Facility[];
  inspectionPlans: InspectionPlan[];
  hazards: Hazard[];
  reports: Report[];
  trainings: Training[];
  attendeeRecords: AttendeeRecord[];
  examScores: ExamScore[];
  drillRecords: DrillRecord[];
  selfCheckRecords: SelfCheckRecord[];
  supervisionRecords: SupervisionRecord[];
  currentUser: {
    id: string;
    name: string;
    role: string;
    department: string;
  };
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  addHazard: (hazard: Hazard) => void;
  updateHazard: (id: string, data: Partial<Hazard>) => void;
  addReport: (report: Report) => void;
  updateReport: (id: string, data: Partial<Report>) => void;
  addInspectionPlan: (plan: Omit<InspectionPlan, 'id' | 'createdAt' | 'status'>) => void;
  updateInspectionPlan: (id: string, data: Partial<InspectionPlan>) => void;
  deleteInspectionPlan: (id: string) => void;
  addTraining: (training: Omit<Training, 'id' | 'createdAt'>) => void;
  updateTraining: (id: string, data: Partial<Training>) => void;
  deleteTraining: (id: string) => void;
  addAttendeeRecord: (record: Omit<AttendeeRecord, 'id'>) => void;
  updateAttendeeRecord: (id: string, data: Partial<AttendeeRecord>) => void;
  deleteAttendeeRecord: (id: string) => void;
  addExamScore: (score: Omit<ExamScore, 'id'>) => void;
  updateExamScore: (id: string, data: Partial<ExamScore>) => void;
  deleteExamScore: (id: string) => void;
  addDrillRecord: (record: Omit<DrillRecord, 'id' | 'createdAt'>) => void;
  updateDrillRecord: (id: string, data: Partial<DrillRecord>) => void;
  deleteDrillRecord: (id: string) => void;
  addSelfCheckRecord: (record: Omit<SelfCheckRecord, 'id' | 'createdAt' | 'status'>) => void;
  updateSelfCheckRecord: (id: string, data: Partial<SelfCheckRecord>) => void;
  deleteSelfCheckRecord: (id: string) => void;
  addSupervisionRecord: (record: SupervisionRecord) => void;
  updateSupervisionRecord: (id: string, updates: Partial<SupervisionRecord>) => void;
  addHazardSupervision: (hazardId: string, record: SupervisionRecord) => void;
}

export const useAppStore = create<AppState>((set) => ({
  units: mockUnits,
  facilities: mockFacilities,
  inspectionPlans: mockInspectionPlans,
  hazards: mockHazards,
  reports: mockReports,
  trainings: mockTrainings,
  attendeeRecords: mockAttendeeRecords,
  examScores: mockExamScores,
  drillRecords: mockDrillRecords,
  selfCheckRecords: mockSelfCheckRecords,
  supervisionRecords: [],
  currentUser: {
    id: 'user1',
    name: '李消防',
    role: 'fire_officer',
    department: 'XX街道消防办'
  },
  sidebarCollapsed: false,
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  addHazard: (hazard) => set((state) => ({ hazards: [...state.hazards, hazard] })),
  updateHazard: (id, data) =>
    set((state) => ({
      hazards: state.hazards.map((h) => (h.id === id ? { ...h, ...data } : h))
    })),
  addReport: (report) => set((state) => ({ reports: [...state.reports, report] })),
  updateReport: (id, data) =>
    set((state) => ({
      reports: state.reports.map((r) => (r.id === id ? { ...r, ...data } : r))
    })),
  addInspectionPlan: (plan) =>
    set((state) => ({
      inspectionPlans: [
        ...state.inspectionPlans,
        {
          ...plan,
          id: `p${Date.now()}`,
          createdAt: new Date().toISOString().split('T')[0],
          status: '未开始'
        }
      ]
    })),
  updateInspectionPlan: (id, data) =>
    set((state) => ({
      inspectionPlans: state.inspectionPlans.map((p) =>
        p.id === id ? { ...p, ...data } : p
      )
    })),
  deleteInspectionPlan: (id) =>
    set((state) => ({
      inspectionPlans: state.inspectionPlans.filter((p) => p.id !== id)
    })),
  addTraining: (training) =>
    set((state) => ({
      trainings: [
        ...state.trainings,
        {
          ...training,
          id: `t${Date.now()}`,
          createdAt: new Date().toISOString().split('T')[0],
          status: training.status || '未开始'
        }
      ]
    })),
  updateTraining: (id, data) =>
    set((state) => ({
      trainings: state.trainings.map((t) =>
        t.id === id ? { ...t, ...data } : t
      )
    })),
  deleteTraining: (id) =>
    set((state) => ({
      trainings: state.trainings.filter((t) => t.id !== id)
    })),
  addAttendeeRecord: (record) =>
    set((state) => ({
      attendeeRecords: [
        ...state.attendeeRecords,
        {
          ...record,
          id: `a${Date.now()}`
        }
      ]
    })),
  updateAttendeeRecord: (id, data) =>
    set((state) => ({
      attendeeRecords: state.attendeeRecords.map((a) =>
        a.id === id ? { ...a, ...data } : a
      )
    })),
  deleteAttendeeRecord: (id) =>
    set((state) => ({
      attendeeRecords: state.attendeeRecords.filter((a) => a.id !== id)
    })),
  addExamScore: (score) =>
    set((state) => ({
      examScores: [
        ...state.examScores,
        {
          ...score,
          id: `es${Date.now()}`
        }
      ]
    })),
  updateExamScore: (id, data) =>
    set((state) => ({
      examScores: state.examScores.map((e) =>
        e.id === id ? { ...e, ...data } : e
      )
    })),
  deleteExamScore: (id) =>
    set((state) => ({
      examScores: state.examScores.filter((e) => e.id !== id)
    })),
  addDrillRecord: (record) =>
    set((state) => ({
      drillRecords: [
        ...state.drillRecords,
        {
          ...record,
          id: `d${Date.now()}`,
          createdAt: new Date().toISOString().split('T')[0]
        }
      ]
    })),
  updateDrillRecord: (id, data) =>
    set((state) => ({
      drillRecords: state.drillRecords.map((d) =>
        d.id === id ? { ...d, ...data } : d
      )
    })),
  deleteDrillRecord: (id) =>
    set((state) => ({
      drillRecords: state.drillRecords.filter((d) => d.id !== id)
    })),
  addSelfCheckRecord: (record) =>
    set((state) => ({
      selfCheckRecords: [
        ...state.selfCheckRecords,
        {
          ...record,
          id: `sc${Date.now()}`,
          createdAt: new Date().toISOString().split('T')[0],
          status: '待审核'
        }
      ]
    })),
  updateSelfCheckRecord: (id, data) =>
    set((state) => ({
      selfCheckRecords: state.selfCheckRecords.map((r) =>
        r.id === id ? { ...r, ...data } : r
      )
    })),
  deleteSelfCheckRecord: (id) =>
    set((state) => ({
      selfCheckRecords: state.selfCheckRecords.filter((r) => r.id !== id)
    })),
  addSupervisionRecord: (record) =>
    set((state) => ({
      supervisionRecords: [...state.supervisionRecords, record]
    })),
  updateSupervisionRecord: (id, updates) =>
    set((state) => ({
      supervisionRecords: state.supervisionRecords.map((r) =>
        r.id === id ? { ...r, ...updates } : r
      )
    })),
  addHazardSupervision: (hazardId, record) =>
    set((state) => ({
      supervisionRecords: [...state.supervisionRecords, record],
      hazards: state.hazards.map((h) =>
        h.id === hazardId
          ? { ...h, supervisionRecords: [...(h.supervisionRecords || []), record] }
          : h
      )
    }))
}));
