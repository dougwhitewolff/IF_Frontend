// src/app/coded-messages/page.tsx

'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ActivityLayout from '@/components/activity/ActivityLayout';
import {
  InteractiveArea,
  ActivityButton,
  InputField,
} from '@/components/activity/ActivityElements';
import { AnimatedSection } from '@/components/activity/AnimatedElements';
import { useActivityContext } from '@/hooks/useActivityContext';
import { useAssistant } from '@/hooks/useAssistant';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { categories, questions, Question } from '@/data/codedMessages/questions';
import { toast } from 'react-hot-toast';
import IntroductionOverlay from '@/components/activity/IntroductionOverlay';
import AIErrorBoundary from '@/components/AIErrorBoundary';
import ErrorFallback from '@/app/error';

const MAX_HISTORY_ITEMS = 50;
const SCROLL_HEIGHT = 400;
const WELCOME_MESSAGE =
  "In this activity, you'll select a category and use the coded messages to solve the puzzle.";

const ProgressHistoryFallback = () => (
  <div className="p-4 text-red-500 bg-red-50 rounded-lg">
    Unable to display progress. Please refresh the page.
  </div>
);

const CodedMessages: React.FC = () => {
  // Context and hooks
  const { progress, updateProgress, recordAttempt } = useActivityContext('coded-messages');

  // State declarations
  const [showIntro, setShowIntro] = useState(true);
  const [userGuess, setUserGuess] = useState('');
  const [currentCategory, setCurrentCategory] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [encodedAnswer, setEncodedAnswer] = useState('');
  const [progressHistory, setProgressHistory] = useState<string[]>([]);
  const [attemptCount, setAttemptCount] = useState(0);

  // Refs
  const progressContainerRef = useRef<HTMLDivElement | null>(null);

  // Initialize the useAssistant hook with appropriate IDs
  const { getAssistantResponse, isLoading: isAIResponseLoading, error: aiError } = useAssistant({
    assistantId: 'assistant-cm', // Replace with your actual assistantId
    activityId: 'coded-messages', // Replace with your actual activityId
  });

  // Speech Recognition hook
  const {
    isListening,
    isSpeaking,
    error: speechError,
    speak,
    isSpeechSupported,
    updateOnSpeechResult,
  } = useSpeechRecognition({
    onSpeechResult: undefined, // Initialize without a callback
    autoStart: !showIntro && currentQuestion !== null, // Start only after intro is closed and question is loaded
  });

  // Handle AI responses
  const handleSpeechResult = useCallback(
    async (text: string) => {
      if (!getAssistantResponse) return;

      try {
        let prompt = `User said: "${text}".`;

        if (currentCategory) {
          prompt += ` Current category: "${currentCategory}".`;
        } else {
          prompt += ` No category has been selected. Available categories are: ${categories
            .map((cat) => cat.name)
            .join(', ')}.`;
        }

        if (currentQuestion) {
          prompt += ` Current question hint: "${currentQuestion.hint}".`;
        } else if (currentCategory) {
          prompt += ` No question is currently loaded for the selected category.`;
        }

        prompt += ` User's progress: ${progressHistory.join(', ') || 'No progress yet'}.`;

        // Encourage the user to select a category if none is selected
        if (!currentCategory) {
          prompt += ` Please encourage the user to select a category or ask which category they are most interested in.`;
        }

        prompt += ` Provide assistance accordingly.`;

        console.log('Prompt to AI assistant:', prompt);

        const response = await getAssistantResponse(prompt);
        if (response && speak) {
          await speak(response);
        }
      } catch (error) {
        console.error('Error in handleSpeechResult:', error);
        toast.error('Failed to get AI response');
      }
    },
    [
      getAssistantResponse,
      currentCategory,
      currentQuestion,
      progressHistory,
      speak,
      categories,
    ]
  );

  // Set the onSpeechResult callback in useSpeechRecognition
  useEffect(() => {
    if (updateOnSpeechResult) {
      updateOnSpeechResult(handleSpeechResult);
    }
  }, [handleSpeechResult, updateOnSpeechResult]);

  // Notify if speech is not supported
  useEffect(() => {
    if (!isSpeechSupported) {
      toast.error('Speech recognition is not supported in your browser');
    }
  }, [isSpeechSupported]);

  // Handle intro close
  const handleIntroClose = useCallback(async () => {
    setShowIntro(false);
    if (!isAIResponseLoading && !aiError && speak) {
      await speak(WELCOME_MESSAGE);
    }
  }, [isAIResponseLoading, aiError, speak]);

  // Letter coding functions
  const letterToCode = (letter: string): string => {
    return letter === ' ' ? '0' : (letter.charCodeAt(0) - 64).toString();
  };

  const encodeAnswer = (text: string): string => {
    return text
      .toUpperCase()
      .split('')
      .map(letterToCode)
      .join('-');
  };

  // Progress tracking
  const addProgressEntry = (entry: string) => {
    setProgressHistory((prev) => [...prev.slice(-MAX_HISTORY_ITEMS), entry]);
  };

  // Question handling
  const loadNewQuestion = useCallback(
    async (categoryId: string) => {
      const availableQuestions = questions.filter(
        (q) =>
          q.category === categoryId &&
          q.difficulty === progress?.difficulty &&
          !progress?.completedQuestions.includes(q.id)
      );

      if (availableQuestions.length === 0) {
        toast.success(
          'You have completed all challenges in this category! Try another one.'
        );
        return;
      }

      const question =
        availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
      setCurrentQuestion(question);
      setEncodedAnswer(encodeAnswer(question.answer));
      setUserGuess('');
      setProgressHistory([]);
      setAttemptCount(0);
    },
    [progress]
  );

  const handleCategorySelect = useCallback(
    async (categoryId: string) => {
      try {
        if (currentCategory === categoryId) {
          await loadNewQuestion(categoryId);
        } else {
          setCurrentCategory(categoryId);
          updateProgress({ currentCategory: categoryId });
          toast(`Selected category: ${categoryId}`);
          await loadNewQuestion(categoryId);
        }
      } catch (error) {
        toast.error('Failed to load challenge. Please try again.');
      }
    },
    [currentCategory, loadNewQuestion, updateProgress]
  );

  const checkGuess = useCallback(() => {
    if (!userGuess.trim() || !currentQuestion) return;

    const guess = userGuess.toUpperCase();
    const answer = currentQuestion.answer.toUpperCase();

    let newEntry = '';
    for (let i = 0; i < answer.length; i++) {
      const userChar = guess[i] || '';
      const correctChar = answer[i];

      if (userChar === correctChar) {
        newEntry += correctChar;
      } else {
        const encodedNum = letterToCode(correctChar);
        newEntry += `<span class="text-red-500 font-bold">${encodedNum}</span>`;
      }

      if (i < answer.length - 1) {
        newEntry += '-';
      }
    }

    addProgressEntry(newEntry);

    const isCorrect = guess === answer;
    setAttemptCount((prev) => prev + 1);

    if (isCorrect) {
      recordAttempt(true, attemptCount);
      const scoreIncrease = Math.max(3 - attemptCount, 1);
      updateProgress({
        score: (progress?.score || 0) + scoreIncrease,
        completedQuestions: [...(progress?.completedQuestions || []), currentQuestion.id],
      });
      addProgressEntry(
        `<span class="text-green-500 font-bold">${currentQuestion.answer.toUpperCase()}</span>`
      );

      if (typeof window !== 'undefined') {
        import('canvas-confetti').then((module) => {
          const confetti = module.default;
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        });
      }

      toast.success('Correct!');
    } else {
      toast.error('Incorrect answer. Please try again.');
    }
  }, [
    userGuess,
    currentQuestion,
    attemptCount,
    recordAttempt,
    updateProgress,
    progress,
  ]);

  // Initial category setup
  useEffect(() => {
    if (progress && !currentCategory) {
      const savedCategory = progress.currentCategory || categories[0].id;
      setCurrentCategory(savedCategory);
    }
  }, [progress, currentCategory]);

  // Progress scroll handling
  useEffect(() => {
    if (progressContainerRef.current) {
      progressContainerRef.current.scrollTop = progressContainerRef.current.scrollHeight;
    }
  }, [progressHistory]);

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => {
        console.error('ErrorBoundary caught an error:', error, info);
        toast.error('An unexpected error occurred.');
      }}
    >
      <ActivityLayout
        title="Coded Messages Activity"
        description="Use the hints and your expertise to solve each puzzle and crack the hidden code"
      >
        <AnimatedSection>
          {showIntro && (
            <IntroductionOverlay
              activityName="Coded Messages"
              description="Welcome to Coded Messages! In this activity, you'll decode secret messages while learning about inverse operations. Each message contains a hidden meaning that you'll need to uncover using mathematical thinking."
              onClose={handleIntroClose}
            />
          )}

          <AIErrorBoundary>
            <InteractiveArea className="relative">
              <div className="grid grid-cols-[300px_1fr_300px] gap-x-6">
                {/* Categories Column */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold mb-2">Choose a Category</h3>
                  {categories.map((category) => (
                    <ActivityButton
                      key={category.id}
                      onClick={() => handleCategorySelect(category.id)}
                      className={`
                          w-full h-20 rounded-lg transition-colors duration-200
                          flex flex-col items-center justify-center
                          ${
                            currentCategory === category.id
                              ? 'bg-orange-500 text-white'
                              : 'bg-white border-2 border-gray-200 hover:border-orange-400 hover:bg-orange-50'
                          }
                        `}
                    >
                      <span className="text-lg font-semibold">{category.name}</span>
                      {currentCategory === category.id && currentQuestion && (
                        <span className="text-sm mt-1 opacity-80">↻ Next</span>
                      )}
                    </ActivityButton>
                  ))}
                </div>

                {/* Challenge Column */}
                <div className="w-full space-y-4">
                  <h3 className="text-2xl font-bold mb-2">Current Challenge</h3>
                  {currentQuestion ? (
                    <>
                      <div className="text-xl p-4 bg-white rounded-lg">
                        {currentQuestion.hint}
                      </div>
                      <div className="text-xl font-mono p-4 bg-blue-50 rounded-lg text-center">
                        {encodedAnswer}
                      </div>
                      <InputField
                        value={userGuess}
                        onChange={(e) => setUserGuess(e.target.value)}
                        placeholder="Enter your answer"
                        className="text-lg"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            checkGuess();
                          }
                        }}
                      />
                      <ActivityButton
                        onClick={checkGuess}
                        disabled={!userGuess.trim()}
                        className="w-full text-lg bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center"
                      >
                        Check Answer
                      </ActivityButton>
                      <div className="text-gray-700 text-lg">
                        Click the <strong>{currentCategory}</strong> category again or pick a
                        different category for another challenge.
                      </div>
                    </>
                  ) : (
                    <div className="text-gray-500 text-lg text-center">
                      Choose a category to start
                    </div>
                  )}
                </div>

                {/* Progress Column */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold mb-2">Your Progress</h3>
                  <ErrorBoundary FallbackComponent={ProgressHistoryFallback}>
                    <div
                      ref={progressContainerRef}
                      className="overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400"
                      style={{
                        height: `${SCROLL_HEIGHT}px`,
                        maxHeight: `${SCROLL_HEIGHT}px`,
                      }}
                    >
                      {progressHistory.length > 0 ? (
                        <div className="space-y-2">
                          {progressHistory.map((progressItem, index) => (
                            <div
                              key={index}
                              className="font-mono text-xl bg-white p-4 rounded-lg text-center tracking-wide break-words"
                              dangerouslySetInnerHTML={{ __html: progressItem }}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="text-gray-500 text-center p-4">
                          Your progress will appear here
                        </div>
                      )}
                    </div>
                  </ErrorBoundary>
                </div>
              </div>

              {/* Status Indicators */}
              {isAIResponseLoading && (
                <div className="absolute bottom-4 right-4 flex items-center space-x-2 bg-white/90 px-4 py-2 rounded-full shadow-md">
                  <svg
                    className="animate-spin h-5 w-5 text-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                  <span>AI Assistant is processing...</span>
                </div>
              )}

              {isSpeaking && (
                <div className="absolute bottom-4 left-4 flex items-center space-x-2 bg-white/90 px-4 py-2 rounded-full shadow-md">
                  <svg
                    className="h-5 w-5 text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414L8.414 15H7a1 1 0 11-2 0v-1.414l8.293-8.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Assistant is speaking...</span>
                </div>
              )}

              {isListening && (
                <div className="absolute bottom-4 left-4 flex items-center space-x-2 bg-white/90 px-4 py-2 rounded-full shadow-md">
                  <svg
                    className="animate-pulse h-5 w-5 text-red-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2a3 3 0 00-3 3v6a3 3 0 006 0V5a3 3 0 00-3-3zM7 9a1 1 0 112 0 1 1 0 01-2 0zm6 0a1 1 0 112 0 1 1 0 01-2 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Listening...</span>
                </div>
              )}

              {/* Error Messages */}
              {(aiError || speechError) && (
                <div className="absolute top-4 right-4 p-4 bg-red-100 text-red-700 rounded-lg shadow-md max-w-xs">
                  <p className="text-sm font-medium">
                    {speechError ? 'Speech Recognition Error' : 'AI Service Error'}
                  </p>
                  <p className="text-xs mt-1 opacity-75">Please try again in a moment</p>
                </div>
              )}
            </InteractiveArea>
          </AIErrorBoundary>
        </AnimatedSection>
      </ActivityLayout>
    </ErrorBoundary>
  );
};

export default CodedMessages;
