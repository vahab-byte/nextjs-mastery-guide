import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, ArrowRight, Brain, RotateCcw } from "lucide-react";

const quizQuestions = [
  {
    question: "What is the default rendering strategy in Next.js 15 App Router?",
    options: ["Client-Side Rendering", "Server Components", "Static Generation", "Incremental Regeneration"],
    correct: 1,
  },
  {
    question: "Which directive marks a component as a Client Component?",
    options: ["'use server'", "'use client'", "'use effect'", "'use state'"],
    correct: 1,
  },
  {
    question: "What function revalidates cached data in Server Actions?",
    options: ["refreshPath()", "revalidatePath()", "clearCache()", "updateData()"],
    correct: 1,
  },
];

const QuizWidget = () => {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);

  const handleSelect = (index: number) => {
    if (answered) return;
    setSelected(index);
    setAnswered(true);
    if (index === quizQuestions[currentQ].correct) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQ < quizQuestions.length - 1) {
      setCurrentQ((q) => q + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentQ(0);
    setSelected(null);
    setScore(0);
    setAnswered(false);
    setFinished(false);
  };

  return (
    <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-card/20 to-background">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-10">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider flex items-center justify-center gap-2">
            <Brain className="h-4 w-4" /> Quick Quiz
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-2">How Well Do You Know Next.js?</h2>
          <p className="text-muted-foreground">Test your knowledge with a quick 3-question quiz</p>
        </div>

        <Card className="border-border/50 overflow-hidden">
          {finished ? (
            <CardContent className="p-8 text-center">
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                <div className="text-6xl mb-4">{score === 3 ? "🏆" : score >= 2 ? "🎉" : "💪"}</div>
                <h3 className="text-2xl font-bold mb-2">
                  {score === 3 ? "Perfect Score!" : score >= 2 ? "Great Job!" : "Keep Learning!"}
                </h3>
                <p className="text-muted-foreground mb-2">
                  You got <span className="font-bold text-primary">{score}/{quizQuestions.length}</span> correct
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  {score < 3 ? "Enroll in our course to master these concepts!" : "You're ready for advanced topics!"}
                </p>
                <div className="flex gap-3 justify-center">
                  <Button variant="outline" onClick={handleRestart}>
                    <RotateCcw className="mr-2 h-4 w-4" /> Try Again
                  </Button>
                  <Button>Start Learning <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </div>
              </motion.div>
            </CardContent>
          ) : (
            <CardContent className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm text-muted-foreground">Question {currentQ + 1} of {quizQuestions.length}</span>
                <div className="flex gap-1">
                  {quizQuestions.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 w-8 rounded-full transition-colors ${
                        i < currentQ ? "bg-primary" : i === currentQ ? "bg-primary/50" : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-6 text-foreground">{quizQuestions[currentQ].question}</h3>
              <div className="space-y-3 mb-6">
                {quizQuestions[currentQ].options.map((option, i) => {
                  const isCorrect = i === quizQuestions[currentQ].correct;
                  const isSelected = i === selected;
                  return (
                    <motion.button
                      key={i}
                      whileHover={!answered ? { scale: 1.01 } : {}}
                      whileTap={!answered ? { scale: 0.99 } : {}}
                      onClick={() => handleSelect(i)}
                      disabled={answered}
                      className={`w-full text-left p-4 rounded-lg border transition-all flex items-center justify-between ${
                        answered
                          ? isCorrect
                            ? "border-green-500 bg-green-500/10"
                            : isSelected
                            ? "border-red-500 bg-red-500/10"
                            : "border-border/50 opacity-50"
                          : "border-border/50 hover:border-primary/40 hover:bg-muted/30 cursor-pointer"
                      }`}
                    >
                      <span className="text-sm font-medium">{option}</span>
                      {answered && isCorrect && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {answered && isSelected && !isCorrect && <XCircle className="h-4 w-4 text-red-500" />}
                    </motion.button>
                  );
                })}
              </div>
              {answered && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <Button onClick={handleNext} className="w-full">
                    {currentQ < quizQuestions.length - 1 ? "Next Question" : "See Results"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              )}
            </CardContent>
          )}
        </Card>
      </div>
    </section>
  );
};

export default QuizWidget;
