import { useState } from 'react';
import { TeacherDashboard, QuestionAnalytics as QuestionAnalyticsType } from './types/teacher';
import { Question } from './types/quiz';
import { getTeacherDashboardData } from './data/teacherMockData';
import { TeacherModuleSelector } from './components/TeacherModuleSelector';
import { QuestionAnalytics } from './components/QuestionAnalytics';
import { MasteryTestView } from './components/MasteryTestView';
import { Toaster } from './components/ui/sonner';

type AppState = 'module-overview' | 'question-analytics' | 'mastery-test';

export default function App() {
  const [appState, setAppState] = useState<AppState>('module-overview');
  const [selectedModuleName, setSelectedModuleName] = useState<string | null>(null);
  const [masteryTestQuestions, setMasteryTestQuestions] = useState<Question[]>([]);
  const [masteryTestModule, setMasteryTestModule] = useState<string>('');
  const [dashboardData] = useState<TeacherDashboard>(() => getTeacherDashboardData());

  const handleSelectModule = (moduleName: string) => {
    setSelectedModuleName(moduleName);
    setAppState('question-analytics');
  };

  const handleBackToModules = () => {
    setSelectedModuleName(null);
    setAppState('module-overview');
  };

  const handleCreateMasteryTest = (questions: QuestionAnalyticsType[], moduleName: string) => {
    // Convert QuestionAnalytics to Question format
    const convertedQuestions: Question[] = questions.map((q, index) => ({
      id: q.questionId,
      question: q.question,
      options: ['Option A', 'Option B', 'Option C', 'Option D'], // Mock options
      correctAnswer: 0, // Mock correct answer
      topic: q.topic,
      subTopic: q.subTopic,
      module: moduleName
    }));
    
    setMasteryTestQuestions(convertedQuestions);
    setMasteryTestModule(moduleName);
    setAppState('mastery-test');
  };

  const selectedModule = dashboardData.modules.find(m => m.moduleName === selectedModuleName);

  return (
    <div className="min-h-screen bg-white">
      <div className="border-t-8 border-red-900"></div>
      <div className="max-w-7xl mx-auto p-6">
        {appState === 'module-overview' && (
          <TeacherModuleSelector
            modules={dashboardData.modules}
            totalStudents={dashboardData.totalStudents}
            onSelectModule={handleSelectModule}
            onCreateMasteryTest={handleCreateMasteryTest}
          />
        )}

        {appState === 'question-analytics' && selectedModule && (
          <QuestionAnalytics
            module={selectedModule}
            onBack={handleBackToModules}
          />
        )}

        {appState === 'mastery-test' && masteryTestQuestions.length > 0 && (
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
