"use client";

import { useState } from 'react';
import { Shield, ArrowLeft, Trophy, ListChecks, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

const SAMPLE_QUIZ: QuizQuestion[] = [
  {
    question: "What should be the first thing you do when you receive a wildfire alert?",
    options: [
      "Check social media",
      "Start packing important documents and emergency supplies",
      "Wait for further instructions",
      "Call all your neighbors"
    ],
    correctAnswer: 1
  },
  {
    question: "Which of these should NOT be in your emergency kit?",
    options: [
      "Perishable food",
      "Flashlight",
      "First aid supplies",
      "Battery-powered radio"
    ],
    correctAnswer: 0
  },
  {
    question: "How can you make your home more fire-resistant?",
    options: [
      "Keep vegetation close to your house for shade",
      "Store firewood next to your house",
      "Create a 30-foot defensible space around your home",
      "Plant tall trees near your roof"
    ],
    correctAnswer: 2
  }
];

export default function PreparednessPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [checklist, setChecklist] = useState<{ [key: string]: boolean }>({});

  const handleAnswer = (selectedOption: number) => {
    setSelectedAnswer(selectedOption);
    
    setTimeout(() => {
      if (selectedOption === SAMPLE_QUIZ[currentQuestion].correctAnswer) {
        setScore(score + 1);
      }
      
      if (currentQuestion < SAMPLE_QUIZ.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setShowResults(true);
      }
    }, 1000);
  };

  const toggleChecklistItem = (key: string) => {
    setChecklist(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="hover:text-orange-600 transition-colors">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <h1 className="text-2xl font-semibold">Emergency Preparedness</h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quiz Section */}
          <div className="bg-white rounded-xl shadow-lg">
            <div className="p-6 border-b">
              <div className="flex items-center gap-3">
                <Trophy className="h-6 w-6 text-orange-600" />
                <h2 className="text-xl font-semibold">Safety Quiz</h2>
              </div>
            </div>
            
            <div className="p-6">
              {!showResults ? (
                <>
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-medium text-gray-600">
                        Question {currentQuestion + 1} of {SAMPLE_QUIZ.length}
                      </span>
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                        Score: {score}
                      </span>
                    </div>
                    <h3 className="text-lg font-medium mb-4">
                      {SAMPLE_QUIZ[currentQuestion].question}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {SAMPLE_QUIZ[currentQuestion].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswer(index)}
                        disabled={selectedAnswer !== null}
                        className={`w-full p-4 text-left rounded-lg transition-all ${
                          selectedAnswer === null 
                            ? 'hover:bg-orange-50 bg-gray-50' 
                            : selectedAnswer === index
                              ? index === SAMPLE_QUIZ[currentQuestion].correctAnswer
                                ? 'bg-green-100 border-green-500'
                                : 'bg-red-100 border-red-500'
                              : index === SAMPLE_QUIZ[currentQuestion].correctAnswer
                                ? 'bg-green-100 border-green-500'
                                : 'bg-gray-50 opacity-50'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <Trophy className="h-16 w-16 text-orange-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Quiz Complete!</h3>
                  <p className="text-gray-600 mb-6">
                    You scored {score} out of {SAMPLE_QUIZ.length}
                  </p>
                  <button
                    onClick={() => {
                      setCurrentQuestion(0);
                      setScore(0);
                      setShowResults(false);
                    }}
                    className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Checklist Section */}
          <div className="bg-white rounded-xl shadow-lg">
            <div className="p-6 border-b">
              <div className="flex items-center gap-3">
                <ListChecks className="h-6 w-6 text-orange-600" />
                <h2 className="text-xl font-semibold">Emergency Checklist</h2>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {[
                  {
                    title: "Important Documents",
                    description: "Pack identification, insurance papers, and medical records"
                  },
                  {
                    title: "Emergency Kit",
                    description: "Prepare first aid supplies, flashlights, and battery-powered radio"
                  },
                  {
                    title: "Food and Water",
                    description: "Store at least 3 days of non-perishable food and water"
                  },
                  {
                    title: "Communication Plan",
                    description: "Establish meeting points and out-of-area contacts"
                  },
                  {
                    title: "Evacuation Routes",
                    description: "Plan and practice multiple evacuation routes"
                  }
                ].map((item, index) => (
                  <div
                    key={index}
                    onClick={() => toggleChecklistItem(item.title)}
                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <button
                      className={`mt-1 p-1 rounded-full transition-colors ${
                        checklist[item.title] ? 'text-green-600' : 'text-gray-400'
                      }`}
                    >
                      <CheckCircle2 className="h-5 w-5" />
                    </button>
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
