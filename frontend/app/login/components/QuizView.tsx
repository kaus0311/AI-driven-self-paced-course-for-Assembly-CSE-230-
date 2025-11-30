//PROF VIEW COMPONENT

import { useState } from 'react';
import { QuizAttempt } from '../types/quiz';
import { QuizCard } from './QuizCard';
import { Button } from '../Teachconents/ui/button';
import { Progress } from '../Teachconents/ui/progress';
import { Card, CardContent } from '../Teachconents/ui/card';
import { ChevronLeft, ChevronRight, Send } from 'lucide-react';

interface QuizViewProps {
  attempt: QuizAttempt;
  onAnswerChange: (questionIndex: number, answer: number) => void;
  onSubmit: () => void;
}

export function QuizView({ attempt, onAnswerChange, onSubmit }: QuizViewProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  const currentQuestion = attempt.questions[currentQuestionIndex];
  const currentAnswer = attempt.answers[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / attempt.questions.length) * 100;
  
  const canGoNext = currentQuestionIndex < attempt.questions.length - 1;
  const canGoPrev = currentQuestionIndex > 0;
  const allAnswered = attempt.answers.every(a => a !== null);

  const handleNext = () => {
    if (canGoNext) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (canGoPrev) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-red-900">
                Progress: {attempt.answers.filter(a => a !== null).length} / {attempt.questions.length} answered
              </span>
              <span className="text-sm text-gray-600">
                Attempt #{attempt.attemptNumber}
              </span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
        </CardContent>
      </Card>

      <QuizCard
        question={currentQuestion}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={attempt.questions.length}
        selectedAnswer={currentAnswer}
        onAnswerSelect={(answer) => onAnswerChange(currentQuestionIndex, answer)}
      />

      <div className="flex justify-between items-center gap-4">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={!canGoPrev}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <div className="flex gap-2">
          {attempt.questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-8 h-8 rounded-full text-sm transition-colors ${
                index === currentQuestionIndex
                  ? 'bg-red-900 text-white shadow-md'
                  : attempt.answers[index] !== null
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {canGoNext ? (
          <Button onClick={handleNext}>
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button 
            onClick={onSubmit} 
            disabled={!allAnswered}
            className="bg-green-600 hover:bg-green-700"
          >
            <Send className="w-4 h-4 mr-2" />
            Submit Quiz
          </Button>
        )}
      </div>

      {!allAnswered && currentQuestionIndex === attempt.questions.length - 1 && (
        <Card className="border-l-4 border-l-yellow-600 bg-yellow-50/50">
          <CardContent className="py-3">
            <p className="text-sm text-red-900 text-center">
              Please answer all questions before submitting.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
