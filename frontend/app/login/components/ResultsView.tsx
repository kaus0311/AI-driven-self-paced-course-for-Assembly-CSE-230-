//PROF VIEW COMPONENT

import { useState } from 'react';
import { QuizAttempt } from '../types/quiz';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../Teachconents/ui/card';
import { Button } from '../Teachconents/ui/button';
import { Progress } from '../Teachconents/ui/progress';
import { QuizCard } from './QuizCard';
import { CheckCircle, XCircle, RotateCcw, Trophy, AlertCircle } from 'lucide-react';
import { Badge } from '../Teachconents/ui/badge';

interface ResultsViewProps {
  attempt: QuizAttempt;
  onRetake: () => void;
  onBackToModules: () => void;
}

export function ResultsView({ attempt, onRetake, onBackToModules }: ResultsViewProps) {
  const [reviewMode, setReviewMode] = useState(false);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  
  const score = attempt.score || 0;
  const total = attempt.questions.length;
  const percentage = Math.round((score / total) * 100);
  const passed = percentage >= 70;

  const incorrectQuestions = attempt.questions.filter((q, idx) => 
    attempt.answers[idx] !== q.correctAnswer
  );

  const topicPerformance = attempt.questions.reduce((acc, q, idx) => {
    const key = `${q.topic} - ${q.subTopic}`;
    if (!acc[key]) {
      acc[key] = { correct: 0, total: 0 };
    }
    acc[key].total++;
    if (attempt.answers[idx] === q.correctAnswer) {
      acc[key].correct++;
    }
    return acc;
  }, {} as Record<string, { correct: number; total: number }>);

  if (reviewMode) {
    const currentQuestion = attempt.questions[currentReviewIndex];
    const currentAnswer = attempt.answers[currentReviewIndex];
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center border-l-4 border-yellow-600 pl-4">
          <h2 className="text-red-900">Review Your Answers</h2>
          <Button variant="outline" onClick={() => setReviewMode(false)}>
            Back to Results
          </Button>
        </div>

        <QuizCard
          question={currentQuestion}
          questionNumber={currentReviewIndex + 1}
          totalQuestions={total}
          selectedAnswer={currentAnswer}
          onAnswerSelect={() => {}}
          showResult={true}
        />

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentReviewIndex(Math.max(0, currentReviewIndex - 1))}
            disabled={currentReviewIndex === 0}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentReviewIndex(Math.min(total - 1, currentReviewIndex + 1))}
            disabled={currentReviewIndex === total - 1}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className={passed ? 'border-l-4 border-l-green-600 shadow-lg' : 'border-l-4 border-l-yellow-600 shadow-lg'}>
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-red-900">
                {passed ? (
                  <>
                    <Trophy className="w-6 h-6 text-green-600" />
                    Congratulations! You Passed!
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-6 h-6 text-yellow-600" />
                    Keep Trying!
                  </>
                )}
              </CardTitle>
              <CardDescription>
                Attempt #{attempt.attemptNumber}
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-4xl text-red-900">{percentage}%</div>
              <div className="text-sm text-gray-600">{score} / {total} correct</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Progress value={percentage} className="h-3" />
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="border-b">
          <CardTitle className="text-red-900">Performance by Topic</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {Object.entries(topicPerformance).map(([topic, stats]) => {
              const topicPercentage = Math.round((stats.correct / stats.total) * 100);
              const topicPassed = topicPercentage >= 70;
              
              return (
                <div key={topic} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-red-900">{topic}</span>
                      {topicPassed ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-yellow-600" />
                      )}
                    </div>
                    <Badge className={topicPassed ? 'bg-green-600' : 'bg-yellow-600'}>
                      {stats.correct} / {stats.total}
                    </Badge>
                  </div>
                  <Progress value={topicPercentage} />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {!passed && incorrectQuestions.length > 0 && (
        <Card className="border-l-4 border-l-yellow-600 bg-yellow-50/50 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-900">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-3 text-gray-700">
              You missed {incorrectQuestions.length} question{incorrectQuestions.length !== 1 ? 's' : ''}. 
              When you retake this quiz, you'll see different questions with a focus on these topics.
            </p>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(attempt.incorrectTopics)).map(topic => (
                <Badge key={topic} className="bg-yellow-600">
                  {topic}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-4 justify-between">
        <Button variant="outline" onClick={onBackToModules}>
          Back to Modules
        </Button>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setReviewMode(true)}>
            Review Answers
          </Button>
          
          {!passed && (
            <Button onClick={onRetake}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Retake Quiz
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
