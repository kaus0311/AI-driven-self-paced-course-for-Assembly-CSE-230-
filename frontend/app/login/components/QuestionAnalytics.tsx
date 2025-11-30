//PROF VIEW COMPONENT

import { ModuleAnalytics, QuestionAnalytics as QAnalytics } from '../types/teacher';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../Teachconents/ui/card';
import { Button } from '../Teachconents/ui/button';
import { Badge } from '../Teachconents/ui/badge';
import { Progress } from '../Teachconents/ui/progress';
import { ArrowLeft, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface QuestionAnalyticsProps {
  module: ModuleAnalytics;
  onBack: () => void;
}

export function QuestionAnalytics({ module, onBack }: QuestionAnalyticsProps) {
  // Sort questions by accuracy (ascending) to show problem areas first
  const sortedQuestions = [...module.questions].sort((a, b) => a.accuracy - b.accuracy);
  
  // Calculate statistics
  const avgAccuracy = Math.round(module.questions.reduce((sum, q) => sum + q.accuracy, 0) / module.questions.length);
  const highPerformanceQuestions = module.questions.filter(q => q.accuracy >= 70).length;
  const lowPerformanceQuestions = module.questions.filter(q => q.accuracy < 60).length;
  const totalAttempts = module.questions.reduce((sum, q) => sum + q.totalAttempts, 0);

  // Get topic performance
  const topicStats = module.questions.reduce((acc, q) => {
    const key = q.topic;
    if (!acc[key]) {
      acc[key] = { correct: 0, total: 0 };
    }
    acc[key].correct += q.correctAnswers;
    acc[key].total += q.totalAttempts;
    return acc;
  }, {} as Record<string, { correct: number; total: number }>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          Back to Modules
        </Button>
        <div className="border-l-4 border-yellow-600 pl-4 flex-1">
          <h1 className="text-red-900">{module.moduleName}</h1>
          <p className="text-gray-600">Question-level performance analytics</p>
        </div>
      </div>

      {/* Module Summary */}
      <Card className="border-2 border-yellow-600 bg-amber-50/30 shadow-sm">
        <CardHeader className="border-b border-yellow-600/20">
          <CardTitle className="text-red-900">Module Summary</CardTitle>
          <CardDescription>Overall performance across all questions</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 border-2 border-red-900/30 shadow-sm">
              <div className="text-2xl text-red-900">{module.questions.length}</div>
              <div className="text-sm text-gray-600">Total Questions</div>
            </div>
            <div className="bg-white rounded-lg p-4 border-2 border-yellow-600/30 shadow-sm">
              <div className="text-2xl text-yellow-700">{avgAccuracy}%</div>
              <div className="text-sm text-gray-600">Avg Accuracy</div>
            </div>
            <div className="bg-white rounded-lg p-4 border-2 border-green-600/30 shadow-sm">
              <div className="text-2xl text-green-600">{highPerformanceQuestions}</div>
              <div className="text-sm text-gray-600">Strong (≥70%)</div>
            </div>
            <div className="bg-white rounded-lg p-4 border-2 border-red-600/30 shadow-sm">
              <div className="text-2xl text-red-600">{lowPerformanceQuestions}</div>
              <div className="text-sm text-gray-600">Weak {"(<"}60%)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Topic Performance */}
      <Card className="shadow-sm">
        <CardHeader className="border-b">
          <CardTitle className="text-red-900">Performance by Topic</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {Object.entries(topicStats).map(([topic, stats]) => {
              const accuracy = Math.round((stats.correct / stats.total) * 100);
              const status = accuracy >= 70 ? 'high' : accuracy >= 60 ? 'medium' : 'low';
              
              return (
                <div key={topic} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-red-900">{topic}</span>
                    <Badge 
                      className={
                        status === 'high' ? 'bg-green-600' :
                        status === 'medium' ? 'bg-yellow-600' :
                        'bg-red-600'
                      }
                    >
                      {accuracy}%
                    </Badge>
                  </div>
                  <Progress value={accuracy} />
                  <div className="text-xs text-gray-500">
                    {stats.correct} correct out of {stats.total} attempts
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {lowPerformanceQuestions > 0 && (
        <Card className="border-l-4 border-l-red-600 bg-red-50/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-red-900">
              Areas Needing Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 mb-3">
              {lowPerformanceQuestions} question{lowPerformanceQuestions !== 1 ? 's' : ''} have an accuracy below 60%. 
              Consider reviewing these topics with students or providing additional practice materials.
            </p>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(
                sortedQuestions
                  .filter(q => q.accuracy < 60)
                  .map(q => q.topic)
              )).map(topic => (
                <Badge key={topic} className="bg-red-600">
                  {topic}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}