import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout";
import RiskMapPage from "@/pages/RiskMap";
import Units from "@/pages/Units";
import InspectionsPage from "@/pages/Inspections";
import HazardsPage from "@/pages/Hazards";
import SelfCheckPage from "@/pages/SelfCheck";
import TrainingPage from "@/pages/Training";
import ReportsPage from "@/pages/Reports";
import AnalyticsPage from "@/pages/Analytics";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<RiskMapPage />} />
          <Route path="/units" element={<Units />} />
          <Route path="/inspections" element={<InspectionsPage />} />
          <Route path="/hazards" element={<HazardsPage />} />
          <Route path="/self-check" element={<SelfCheckPage />} />
          <Route path="/training" element={<TrainingPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}
