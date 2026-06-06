import { create } from 'zustand';
import type { Unit, Facility, InspectionPlan, Hazard, Report, Training } from '@/types';
import {
  mockUnits,
  mockFacilities,
  mockInspectionPlans,
  mockHazards,
  mockReports,
  mockTrainings
} from '@/utils/mock';

interface AppState {
  units: Unit[];
  facilities: Facility[];
  inspectionPlans: InspectionPlan[];
  hazards: Hazard[];
  reports: Report[];
  trainings: Training[];
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
}

export const useAppStore = create<AppState>((set) => ({
  units: mockUnits,
  facilities: mockFacilities,
  inspectionPlans: mockInspectionPlans,
  hazards: mockHazards,
  reports: mockReports,
  trainings: mockTrainings,
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
    }))
}));
