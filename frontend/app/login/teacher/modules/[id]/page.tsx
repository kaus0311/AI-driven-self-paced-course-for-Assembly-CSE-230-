// frontend/app/login/teacher/modules/[id]/page.tsx
import { getAllModuleIds } from "../../data/professorModules";
import ModuleAnalyticsClient from "./ModuleAnalyticsClient";

export async function generateStaticParams() {
  return getAllModuleIds().map((id) => ({ id }));
}

export default function ModuleAnalyticsPage() {
  return <ModuleAnalyticsClient />;
}
