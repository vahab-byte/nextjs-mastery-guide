import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { CheckCircle2, XCircle, Award, RotateCcw, Clock, Trophy, Target, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { courseService } from '@/services/courseService';
import { useUserProgress } from '@/hooks/useUserProgress';
import { useAuth } from '@/contexts/AuthContext';

interface ExamSectionProps {
  moduleId: number;
  moduleTitle: string;
}

const ExamSection = ({ moduleId, moduleTitle }: ExamSectionProps) => {
  const { user } = useAuth();
  const { passExam } = useUserProgress(user?.id);

  const { data: questions = [], isLoading, error } = useQuery({
    queryKey: ['questions', moduleId],
    queryFn: () => courseService.getQuestions(moduleId),
  });

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [examStarted, setExamStarted] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswers({ ...selectedAnswers, [currentQuestion]: answerIndex });
    setShowExplanation(true);
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correct_answer) {
        correct++;
      }
    });
    return correct;
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
    } else {
      // Exam finished
      // We need to make sure the last answer is included in score calculation.
      // selectedAnswers state is updated in handleAnswerSelect, so it should be up to date here?
      // Yes, handleAnswerSelect runs when user clicks option.
      // NextQuestion runs when user clicks 'Next' or 'View Results'.

      const correctCount = calculateScore();

      if (user) {
        passExam(moduleId, correctCount);
      }

      setShowResults(true);
      toast.success("Exam completed!");
    }
  };

  const resetExam = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
    setShowExplanation(false);
    setExamStarted(false);
  };

  if (isLoading) {
    return (
      <Card className="border-primary/20 flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading exam questions...</span>
      </Card>
    );
  }

  if (error || questions.length === 0) {
    if (error) {
      return (
        <Card className="border-destructive/20 p-6 text-center">
          <p className="text-destructive">Failed to load exam questions.</p>
        </Card>
      );
    }
    if (questions.length === 0) {
      return (
        <Card className="border-muted/20 p-6 text-center">
          <p className="text-muted-foreground">No questions available for this module yet.</p>
        </Card>
      )
    }
  }

  const score = calculateScore();
  const percentage = Math.round((score / questions.length) * 100);
  const passed = percentage >= 70;

  if (!examStarted) {
    return (
      <Card className="border-accent/30 bg-gradient-to-br from-accent/5 to-primary/5">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4">
            <Target className="h-8 w-8 text-accent" />
          </div>
          <CardTitle className="text-2xl">Module Exam</CardTitle>
          <CardDescription className="text-base">
            Test your knowledge of {moduleTitle}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="p-4 rounded-lg bg-card/50 border border-border">
              <div className="text-2xl font-bold text-primary">{questions.length}</div>
              <div className="text-xs text-muted-foreground">Questions</div>
            </div>
            <div className="p-4 rounded-lg bg-card/50 border border-border">
              <div className="text-2xl font-bold text-secondary">70%</div>
              <div className="text-xs text-muted-foreground">Pass Score</div>
            </div>
            <div className="p-4 rounded-lg bg-card/50 border border-border">
              <div className="text-2xl font-bold text-accent">∞</div>
              <div className="text-xs text-muted-foreground">Retakes</div>
            </div>
          </div>
          <Button variant="default" size="lg" onClick={() => setExamStarted(true)} className="px-8 bg-black text-white hover:bg-black/90">
            Start Exam
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (showResults) {
    return (
      <Card className={`border-2 ${passed ? 'border-secondary/50 bg-secondary/5' : 'border-destructive/50 bg-destructive/5'}`}>
        <CardHeader className="text-center">
          <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 ${passed ? 'bg-secondary/20' : 'bg-destructive/20'}`}>
            {passed ? (
              <Trophy className="h-10 w-10 text-secondary" />
            ) : (
              <RotateCcw className="h-10 w-10 text-destructive" />
            )}
          </div>
          <CardTitle className="text-3xl">
            {passed ? 'Congratulations!' : 'Keep Learning!'}
          </CardTitle>
          <CardDescription className="text-lg">
            {passed ? 'You passed the module exam!' : 'Review the material and try again.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-6xl font-bold mb-2" style={{ color: passed ? 'hsl(var(--secondary))' : 'hsl(var(--destructive))' }}>
              {percentage}%
            </div>
            <div className="text-muted-foreground">
              {score} of {questions.length} correct
            </div>
          </div>

          <Progress value={percentage} className="h-3" />

          {passed && (
            <div className="flex justify-center">
              <Badge className="bg-secondary text-secondary-foreground px-4 py-2 text-sm">
                <Award className="h-4 w-4 mr-2" />
                Certificate Earned
              </Badge>
            </div>
          )}

          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={resetExam}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Retake Exam
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const question = questions[currentQuestion];
  const selectedAnswer = selectedAnswers[currentQuestion];
  const isCorrect = selectedAnswer === question.correct_answer;

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
            Question {currentQuestion + 1} of {questions.length}
          </Badge>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>No time limit</span>
          </div>
        </div>
        <Progress value={((currentQuestion + 1) / questions.length) * 100} className="h-2 mb-4" />
        <CardTitle className="text-xl leading-relaxed">{question.question}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {question.options.map((option, index) => {
            let buttonClass = "w-full justify-start text-left h-auto py-4 px-4 ";

            if (showExplanation) {
              if (index === question.correct_answer) {
                buttonClass += "border-secondary bg-secondary/10 text-secondary hover:bg-secondary/20";
              } else if (index === selectedAnswer && !isCorrect) {
                buttonClass += "border-destructive bg-destructive/10 text-destructive hover:bg-destructive/20";
              }
            } else if (selectedAnswer === index) {
              buttonClass += "border-primary bg-primary/10";
            }

            return (
              <Button
                key={index}
                variant="outline"
                className={buttonClass}
                onClick={() => !showExplanation && handleAnswerSelect(index)}
                disabled={showExplanation}
              >
                <span className="w-8 h-8 rounded-full border-2 flex items-center justify-center mr-3 flex-shrink-0">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1">{option}</span>
                {showExplanation && index === question.correct_answer && (
                  <CheckCircle2 className="h-5 w-5 text-secondary ml-2" />
                )}
                {showExplanation && index === selectedAnswer && !isCorrect && (
                  <XCircle className="h-5 w-5 text-destructive ml-2" />
                )}
              </Button>
            );
          })}
        </div>

        {showExplanation && (
          <div className={`p-4 rounded-lg border ${isCorrect ? 'bg-secondary/10 border-secondary/30' : 'bg-muted/50 border-border'}`}>
            <div className="font-semibold mb-2 flex items-center gap-2">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-secondary" />
                  <span className="text-secondary">Correct!</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-destructive" />
                  <span className="text-destructive">Incorrect</span>
                </>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{question.explanation}</p>
          </div>
        )}

        {showExplanation && (
          <div className="flex justify-end">
            <Button variant="default" onClick={nextQuestion} className="bg-black text-white hover:bg-black/90">
              {currentQuestion < questions.length - 1 ? 'Next Question' : 'View Results'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExamSection;
