// frontend/app/login/components/TeacherDashboard.tsx
"use client";

import { useState } from "react";

// Types + data from the Figma project (now under teacher-dashboard/)
import {
  TeacherDashboard as TeacherDashboardData,
  QuestionAnalytics as QuestionAnalyticsType,
} from "./teacher-dashboard/types/teacher";
import { Question } from "./teacher-dashboard/types/quiz";
import { getTeacherDashboardData } from "./teacher-dashboard/data/teacherMockData";

// UI components from the Figma project
import { TeacherModuleSelector } from "./teacher-dashboard/TeacherModuleSelector";
import { QuestionAnalytics } from "./teacher-dashboard/QuestionAnalytics";
import { MasteryTestView } from "./teacher-dashboard/MasteryTestView";
import { Toaster } from "./teacher-dashboard/ui/sonner";

type AppState = "module-overview" | "question-analytics" | "mastery-test";

export function TeacherDashboard() {
  const [appState, setAppState] = useState<AppState>("module-overview");
  const [selectedModuleName, setSelectedModuleName] = useState<string | null>(
    null
  );
  const [masteryTestQuestions, setMasteryTestQuestions] = useState<Question[]>(
    []
  );
  const [masteryTestModule, setMasteryTestModule] = useState<string>("");
  const [dashboardData] = useState<TeacherDashboardData>(() =>
    getTeacherDashboardData()
  );

  // When a module card is clicked
  const handleSelectModule = (moduleName: string) => {
    setSelectedModuleName(moduleName);
    setAppState("question-analytics");
  };

  const handleBackToModules = () => {
    setSelectedModuleName(null);
    setAppState("module-overview");
  };

  const handleCreateMasteryTest = (
    questions: QuestionAnalyticsType[],
    moduleName: string
  ) => {
    // Convert QuestionAnalytics → Question format (simple mock)
    const convertedQuestions: Question[] = questions.map((q) => ({
      id: q.questionId,
      question: q.question,
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: 0,
      topic: q.topic,
      subTopic: q.subTopic,
      module: moduleName,
    }));

    setMasteryTestQuestions(convertedQuestions);
    setMasteryTestModule(moduleName);
    setAppState("mastery-test");
  };

  const selectedModule = dashboardData.modules.find(
    (m) => m.moduleName === selectedModuleName
  );

  return (
    <div className="min-h-screen bg-white">
      {/* top maroon strip */}
      <div className="border-t-8 border-red-900" />

      <div className="max-w-7xl mx-auto p-6">
        {appState === "module-overview" && (
          <TeacherModuleSelector
            modules={dashboardData.modules}
            totalStudents={dashboardData.totalStudents}
            onSelectModule={handleSelectModule}
            onCreateMasteryTest={handleCreateMasteryTest}
          />
        )}

        {appState === "question-analytics" && selectedModule && (
          <QuestionAnalytics module={selectedModule} onBack={handleBackToModules} />
        )}

        {appState === "mastery-test" && masteryTestQuestions.length > 0 && (
          <MasteryTestView
            questions={masteryTestQuestions}
            moduleName={masteryTestModule}
            onBack={handleBackToModules}
          />
        )}
      </div>

      <Toaster />
    </div>
  );
}
