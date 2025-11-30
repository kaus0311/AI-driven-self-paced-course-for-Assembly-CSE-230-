//PROF VIEW COMPONENT

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../Teachconents/ui/card';
import { Button } from '../Teachconents/ui/button';
import { Badge } from '../Teachconents/ui/badge';
import { BookOpen, CheckCircle, Clock, PlayCircle, Award, TrendingUp, Target } from 'lucide-react';
import { QuizAttempt } from '../types/quiz';
import { moduleDescriptions } from '../data/questionBank';
import { Progress } from '../Teachconents/ui/progress';

interface ModuleSelectorProps {
  modules: string[];
  moduleAttempts: Map<string, QuizAttempt[]>;
  onSelectModule: (module: string) => void;
}

export function ModuleSelector({ modules, moduleAttempts, onSelectModule }: ModuleSelectorProps) {
  const getModuleStatus = (module: string) => {
    const attempts = moduleAttempts.get(module) || [];
    if (attempts.length === 0) return 'not-started';
    
    const lastAttempt = attempts[attempts.length - 1];
    if (!lastAttempt.completed) return 'in-progress';
    
    const score = lastAttempt.score || 0;
    const total = lastAttempt.questions.length;
    const percentage = (score / total) * 100;
    
    return percentage >= 70 ? 'passed' : 'failed';
  };

  const getModuleStats = (module: string) => {
    const attempts = moduleAttempts.get(module) || [];
    const status = getModuleStatus(module);
    const attemptCount = attempts.filter(a => a.completed).length;
    
    let bestScore = 0;
    if (attemptCount > 0) {
      bestScore = Math.max(...attempts.filter(a => a.completed).map(a => {
        const score = a.score || 0;
        const total = a.questions.length;
        return Math.round((score / total) * 100);
      }));
    }
    
    return { status, attemptCount, bestScore };
  };

  // Calculate overall mastery statistics
  const getMasteryStats = () => {
    const totalModules = modules.length;
    const passedModules = modules.filter(m => getModuleStatus(m) === 'passed').length;
    const failedModules = modules.filter(m => getModuleStatus(m) === 'failed').length;
    const notStartedModules = modules.filter(m => getModuleStatus(m) === 'not-started').length;
    const inProgressModules = modules.filter(m => getModuleStatus(m) === 'in-progress').length;
    
    let totalAttempts = 0;
    let totalScore = 0;
    let totalQuestions = 0;
    
    modules.forEach(module => {
      const attempts = moduleAttempts.get(module) || [];
      const completedAttempts = attempts.filter(a => a.completed);
      totalAttempts += completedAttempts.length;
      
      completedAttempts.forEach(attempt => {
        totalScore += attempt.score || 0;
        totalQuestions += attempt.questions.length;
      });
    });
    
    const overallPercentage = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;
    const completionRate = Math.round((passedModules / totalModules) * 100);
    
    return {
      totalModules,
      passedModules,
      failedModules,
      notStartedModules,
      inProgressModules,
      totalAttempts,
      overallPercentage,
      completionRate
    };
  };

  const masteryStats = getMasteryStats();

  return (
    <div className="space-y-6">
      <div className="border-l-4 border-yellow-600 pl-4">
        <h1 className="text-red-900">Adaptive Quiz Bank</h1>
        <p className="text-gray-600">Select a module to begin or continue your mastery check</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {modules.map(module => {
          const { status, attemptCount, bestScore } = getModuleStats(module);
          
          return (
            <Card key={module} className={
              status === 'passed' ? 'border-l-4 border-l-green-600 shadow-sm' :
              status === 'failed' ? 'border-l-4 border-l-yellow-600 shadow-sm' :
              status === 'in-progress' ? 'border-l-4 border-l-red-900 shadow-sm' :
              'shadow-sm'
            }>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-red-900">
                      <BookOpen className="w-5 h-5 text-red-900" />
                      {module}
                    </CardTitle>
                    <CardDescription>
                      {moduleDescriptions[module]}
                    </CardDescription>
                  </div>
                  {status === 'passed' && (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  )}
                  {status === 'in-progress' && (
                    <Clock className="w-6 h-6 text-yellow-600" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2 flex-wrap">
                  {status === 'passed' && (
                    <Badge className="bg-green-600">Passed</Badge>
                  )}
                  {status === 'failed' && (
                    <Badge className="bg-yellow-600">Needs Retry</Badge>
                  )}
                  {status === 'not-started' && (
                    <Badge variant="outline" className="border-red-900 text-red-900">Not Started</Badge>
                  )}
                  {attemptCount > 0 && (
                    <Badge variant="secondary" className="bg-amber-100 text-red-900">
                      {attemptCount} attempt{attemptCount !== 1 ? 's' : ''}
                    </Badge>
                  )}
                  {bestScore > 0 && (
                    <Badge variant="outline" className="border-yellow-600 text-yellow-700">
                      Best: {bestScore}%
                    </Badge>
                  )}
                </div>

                <Button 
                  onClick={() => onSelectModule(module)} 
                  className="w-full"
                  variant={status === 'failed' ? 'default' : status === 'passed' ? 'outline' : 'default'}
                >
                  <PlayCircle className="w-4 h-4 mr-2" />
                  {status === 'not-started' ? 'Start Quiz' :
                   status === 'in-progress' ? 'Continue Quiz' :
                   status === 'failed' ? 'Retake Quiz' :
                   'Review Quiz'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-2 border-yellow-600 bg-amber-50/30 shadow-sm">
        <CardHeader className="border-b border-yellow-600/20">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-red-900">
                <Award className="w-6 h-6 text-yellow-600" />
                Mastery Check Overview
              </CardTitle>
              <CardDescription>Track your overall progress and attempts</CardDescription>
            </div>
            {masteryStats.passedModules === masteryStats.totalModules && (
              <Badge className="bg-yellow-600 text-red-900">
                <Award className="w-4 h-4 mr-1" />
                Master
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Overall Progress */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2 text-red-900">
                <Target className="w-5 h-5 text-yellow-600" />
                <span>Overall Completion</span>
              </span>
              <span className="text-red-900">{masteryStats.completionRate}%</span>
            </div>
            <Progress value={masteryStats.completionRate} className="h-3" />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 border-2 border-green-600/30 shadow-sm">
              <div className="text-2xl text-green-600">{masteryStats.passedModules}</div>
              <div className="text-sm text-gray-600">Passed</div>
            </div>
            <div className="bg-white rounded-lg p-4 border-2 border-yellow-600/30 shadow-sm">
              <div className="text-2xl text-yellow-700">{masteryStats.failedModules}</div>
              <div className="text-sm text-gray-600">Need Retry</div>
            </div>
            <div className="bg-white rounded-lg p-4 border-2 border-gray-300 shadow-sm">
              <div className="text-2xl text-gray-600">{masteryStats.notStartedModules}</div>
              <div className="text-sm text-gray-600">Not Started</div>
            </div>
            <div className="bg-white rounded-lg p-4 border-2 border-red-900/30 shadow-sm">
              <div className="text-2xl text-red-900">{masteryStats.totalAttempts}</div>
              <div className="text-sm text-gray-600">Total Attempts</div>
            </div>
          </div>

          {/* Performance Summary */}
          {masteryStats.totalAttempts > 0 && (
            <div className="bg-white rounded-lg p-4 border-2 border-yellow-600/30 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-2 text-red-900">
                  <TrendingUp className="w-5 h-5 text-yellow-600" />
                  <span>Average Performance</span>
                </span>
                <Badge className={masteryStats.overallPercentage >= 70 ? 'bg-green-600' : 'bg-yellow-600'}>
                  {masteryStats.overallPercentage}%
                </Badge>
              </div>
              <Progress 
                value={masteryStats.overallPercentage} 
                className="h-2"
              />
            </div>
          )}

          {/* Module Status Summary */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-red-900">Module Status:</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {masteryStats.passedModules > 0 && (
                <Badge className="bg-green-600">
                  {masteryStats.passedModules} Passed
                </Badge>
              )}
              {masteryStats.failedModules > 0 && (
                <Badge className="bg-yellow-600">
                  {masteryStats.failedModules} Need Retry
                </Badge>
              )}
              {masteryStats.inProgressModules > 0 && (
                <Badge className="bg-red-900">
                  {masteryStats.inProgressModules} In Progress
                </Badge>
              )}
              {masteryStats.notStartedModules > 0 && (
                <Badge variant="outline" className="border-red-900 text-red-900">
                  {masteryStats.notStartedModules} Not Started
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
