'use client';

import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import ActivityLayout from '@/components/activity/ActivityLayout';
import { 
  InteractiveArea,
  ActivityButton,
  InputField
} from '@/components/activity/ActivityElements';
import { AnimatedSection } from '@/components/activity/AnimatedElements';
import { useActivityContext } from '@/hooks/useActivityContext';
import { additiveInverseQuestions } from '@/data/additiveInverses/questions';
import { toast } from 'react-hot-toast';

// Updated NumberLine Component
const NumberLine: React.FC<{
  number: number;
  inversePoint: number | null;
  onPlaceInverse: (value: number) => void;
}> = ({ number, inversePoint, onPlaceInverse }) => {
  const numberLineRef = useRef<HTMLDivElement>(null);

  // Number line range
  const minValue = -10;
  const maxValue = 10;

  // Function to handle clicks on the number line
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (numberLineRef.current) {
      const rect = numberLineRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const proportion = clickX / rect.width;
      const value = Math.round(minValue + proportion * (maxValue - minValue));
      onPlaceInverse(value);
    }
  };

  // Calculate positions
  const calculatePosition = (value: number) => {
    return ((value - minValue) / (maxValue - minValue)) * 100;
  };

  return (
    <div className="bg-gray-100 p-2 rounded-lg text-center">
      <div
        className="relative h-16"
        ref={numberLineRef}
        onClick={handleClick}
        style={{ cursor: 'pointer' }}
      >
        {/* Number Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-black transform -translate-y-1/2"></div>
        {/* Ticks and Labels */}
        {Array.from({ length: maxValue - minValue + 1 }, (_, i) => minValue + i).map((val) => (
          <div
            key={val}
            className="absolute"
            style={{ left: `${calculatePosition(val)}%` }}
          >
            {/* Hash Mark */}
            <div
              className={`w-px ${val === 0 ? 'h-8 bg-black' : 'h-4 bg-gray-700'}`}
              style={{ 
                position: 'absolute', 
                top: val === 0 ? '0%' : '50%', 
                transform: val === 0 ? 'translateY(0)' : 'translateY(-50%)'
              }}
            ></div>
            {/* Label */}
            <div
              className={`text-xs ${val === 0 ? 'text-base font-bold' : ''}`}
              style={{ 
                marginTop: val === 0 ? '8px' : '4px', 
                transform: 'translateX(-50%)',
                position: 'absolute',
                top: val === 0 ? '100%' : '50%',
                whiteSpace: 'nowrap'
              }}
            >
              {val}
            </div>
          </div>
        ))}
        {/* Original Number Marker */}
        <div
          className={`absolute top-1/2 w-4 h-4 rounded-full transform -translate-x-1/2 -translate-y-1/2
            ${number >= 0 ? 'bg-blue-500' : 'bg-red-500'}
          `}
          style={{ left: `${calculatePosition(number)}%` }}
        ></div>
        {/* Inverse Number Marker */}
        {inversePoint !== null && (
          <div
            className={`absolute top-1/2 w-4 h-4 rounded-full transform -translate-x-1/2 -translate-y-1/2
              ${inversePoint >= 0 ? 'bg-blue-500' : 'bg-red-500'}
            `}
            style={{ left: `${calculatePosition(inversePoint)}%` }}
          ></div>
        )}
      </div>
    </div>
  );
};

// Updated BalanceScale Component
const BalanceScale: React.FC<{
  number: number;
  onBalanced: () => void;
}> = ({ number, onBalanced }) => {
  const [leftItems, setLeftItems] = useState<number[]>([]);
  const [rightItems, setRightItems] = useState<number[]>([]);
  const [isBalanced, setIsBalanced] = useState<boolean>(false);

  // Determine starting side based on the sign of the number
  const startSide = number >= 0 ? 'right' : 'left';

  // Update balance status
  useEffect(() => {
    const totalLeft = leftItems.reduce((acc, val) => acc + val, 0);
    const totalRight = rightItems.reduce((acc, val) => acc + val, 0);
    const balanced = totalLeft - totalRight + number === 0;
    setIsBalanced(balanced);
    if (balanced) {
      onBalanced();
    }
  }, [leftItems, rightItems, number, onBalanced]);

  // Handle drop events
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, side: 'left' | 'right') => {
    e.preventDefault();
    const value = Number(e.dataTransfer.getData('text/plain'));
    if (side === 'left') {
      setLeftItems([...leftItems, value]);
    } else {
      setRightItems([...rightItems, value]);
    }
  };

  const allowDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Kettlebells (weights) and Balloons
  const draggableItems = [
    { value: 10, type: 'weight', label: 'Weight' },
    { value: 1, type: 'weight', label: 'Weight' },
    { value: -1, type: 'balloon', label: 'Balloon' },
    { value: -10, type: 'balloon', label: 'Balloon' },
  ];

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, value: number) => {
    e.dataTransfer.setData('text/plain', value.toString());
  };

  // Styling for items
  const getItemStyle = (value: number) => {
    if (value > 0) {
      return 'bg-blue-500 text-white';
    } else {
      return 'bg-red-500 text-white';
    }
  };

  // Starting item on the scale
  useEffect(() => {
    if (startSide === 'left') {
      setLeftItems([number]);
    } else {
      setRightItems([number]);
    }
  }, [number, startSide]);

  return (
    <div className="bg-gray-100 p-2 rounded-lg text-center">
      <div className="flex justify-center items-center">
        {/* Left Side */}
        <div
          className="w-24 h-32 border-2 border-gray-400 rounded-lg flex flex-col items-center justify-center mr-2"
          onDrop={(e) => handleDrop(e, 'left')}
          onDragOver={allowDrop}
        >
          <p className="mb-1 font-semibold">Left Side</p>
          <div className="space-y-1">
            {leftItems.map((item, index) => (
              <div
                key={index}
                className={`w-8 h-8 flex items-center justify-center ${getItemStyle(item)} rounded-full`}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Scale */}
        <div className="relative w-32 h-8">
          {/* Fulcrum */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gray-600"></div>
          {/* Beam */}
          <div
            className={`absolute top-0 left-0 right-0 h-1 bg-gray-600 transform ${
              isBalanced ? 'rotate-0' : 'rotate-6'
            }`}
            style={{ transformOrigin: 'center' }}
          ></div>
        </div>

        {/* Right Side */}
        <div
          className="w-24 h-32 border-2 border-gray-400 rounded-lg flex flex-col items-center justify-center ml-2"
          onDrop={(e) => handleDrop(e, 'right')}
          onDragOver={allowDrop}
        >
          <p className="mb-1 font-semibold">Right Side</p>
          <div className="space-y-1">
            {rightItems.map((item, index) => (
              <div
                key={index}
                className={`w-8 h-8 flex items-center justify-center ${getItemStyle(item)} rounded-full`}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Draggable Items */}
      <div className="mt-4 flex justify-center space-x-2">
        {draggableItems.map((item, index) => (
          <div
            key={index}
            className={`w-12 h-12 flex items-center justify-center ${getItemStyle(item.value)} rounded-full cursor-pointer`}
            draggable
            onDragStart={(e) => handleDragStart(e, item.value)}
          >
            {/* Replace with images/icons for weights and balloons */}
            {item.label}
            <br />
            {item.value}
          </div>
        ))}
      </div>

      <p className="mt-2">
        {isBalanced ? (
          <span className="text-green-500 font-bold">Balanced!</span>
        ) : (
          <span className="text-red-500 font-bold">Unbalanced</span>
        )}
      </p>
    </div>
  );
};

const AdditiveInverses: React.FC = () => {
  const { 
    progress, 
    updateProgress, 
    recordAttempt 
  } = useActivityContext('additive-inverses');

  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [userGuess, setUserGuess] = useState<string>(''); // Handle negative inputs
  const [feedback, setFeedback] = useState<string>('');
  const [attemptCount, setAttemptCount] = useState(0);

  // State for Number Line interaction
  const [inversePoint, setInversePoint] = useState<number | null>(null);

  // State for Balance Scale interaction
  const [balanceFeedback, setBalanceFeedback] = useState<string>('');

  // Ref for the input field
  const inputRef = useRef<HTMLInputElement>(null);

  // Function to generate a new number
  const generateNewNumber = () => {
    const availableQuestions = additiveInverseQuestions.filter(q => 
      q.difficulty === 'mild' &&
      !progress?.completedQuestions.includes(q.id)
    );

    if (availableQuestions.length === 0) {
      toast.success('You have completed all additive inverse challenges! Great job!');
      return;
    }

    const question = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    setCurrentNumber(question.number);
    setUserGuess('');
    setFeedback('');
    setAttemptCount(0);

    // Reset interactions in other columns
    setInversePoint(null);
    setBalanceFeedback('');
    setLeftItems([]);
    setRightItems([]);

    // Focus the input field
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  // Function to check the user's guess
  const checkGuess = () => {
    if (currentNumber !== null && userGuess.trim() !== '') {
      const guessNumber = Number(userGuess);
      if (isNaN(guessNumber)) {
        setFeedback('Please enter a valid number.');
        return;
      }

      const correctInverse = -currentNumber;
      if (guessNumber === correctInverse) {
        setFeedback('Correct! 🎉');
        recordAttempt(true, attemptCount);
        updateProgress({
          score: (progress?.score || 0) + 1,
          completedQuestions: [...(progress?.completedQuestions || []), currentNumber]
        });
        toast.success('Well done!');
        // Update Number Line and Balance Scale
        setInversePoint(correctInverse);
        setBalanceFeedback('Balanced! 🎉');
      } else {
        setFeedback('Incorrect. Try again.');
        setAttemptCount(prev => prev + 1);
        recordAttempt(false, attemptCount + 1);
      }
    }
  };

  // Function to handle Enter key press in input field
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      checkGuess();
    }
  };

  // Function to handle placing inverse on number line
  const handlePlaceInverse = (value: number) => {
    setInversePoint(value);
    // Update other columns (if needed)
    setUserGuess(value.toString());
    // Check if correct
    if (currentNumber !== null) {
      const correctInverse = -currentNumber;
      if (value === correctInverse) {
        setFeedback('Correct! 🎉');
        recordAttempt(true, attemptCount);
        updateProgress({
          score: (progress?.score || 0) + 1,
          completedQuestions: [...(progress?.completedQuestions || []), currentNumber]
        });
        toast.success('Well done!');
        setBalanceFeedback('Balanced! 🎉');
      } else {
        setFeedback('Incorrect. Try again.');
        setAttemptCount(prev => prev + 1);
        recordAttempt(false, attemptCount + 1);
      }
    }
  };

  // Function to handle balance scale being balanced
  const handleBalanced = () => {
    setBalanceFeedback('Balanced! 🎉');
    if (currentNumber !== null) {
      const correctInverse = -currentNumber;
      setInversePoint(correctInverse);
      setUserGuess(correctInverse.toString());
      setFeedback('Correct! 🎉');
      recordAttempt(true, attemptCount);
      updateProgress({
        score: (progress?.score || 0) + 1,
        completedQuestions: [...(progress?.completedQuestions || []), currentNumber]
      });
      toast.success('Well done!');
    }
  };

  // Function to reset the activity
  const resetActivity = () => {
    // Generate new number and reset other columns
    generateNewNumber();
  };

  useEffect(() => {
    generateNewNumber();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Styling for the current number in the text input
  const getNumberStyle = (value: number | null) => {
    if (value === null) return '';
    return value >= 0 ? 'text-blue-500' : 'text-red-500';
  };

  // Adjust column widths
  const columnClasses = [
    'md:w-1/4', // Text Input column
    'md:w-1/2', // Number Line column
    'md:w-1/4', // Balance Scale column
  ];

  return (
    <ActivityLayout
      title="Additive Inverses"
      description="Explore how numbers can cancel each other out through addition."
    >
      <AnimatedSection>
        <InteractiveArea>
          <div className="flex flex-col md:flex-row md:justify-between space-y-6 md:space-y-0 md:space-x-6">
            {/* Column 1 - Text-Based Question */}
            <div className={`space-y-4 ${columnClasses[0]}`}>
              <h3 className="text-2xl font-bold mb-2 text-center">Text Input</h3>
              <div className="text-center">
                {currentNumber !== null ? (
                  <>
                    <div className={`text-4xl font-mono mb-4 ${getNumberStyle(currentNumber)}`}>
                      {currentNumber}
                    </div>
                    <InputField
                      type="number"
                      value={userGuess}
                      onChange={(e) => setUserGuess(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Your guess"
                      className={`w-24 text-center text-xl ${getNumberStyle(Number(userGuess))}`}
                      ref={inputRef}
                      aria-label="Additive inverse input"
                    />
                    <ActivityButton
                      onClick={checkGuess}
                      disabled={userGuess.trim() === ''}
                      className="w-full mt-2 bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      Submit
                    </ActivityButton>
                    {feedback && (
                      <p className={`mt-2 text-lg ${feedback.includes('Correct') ? 'text-green-500' : 'text-red-500'}`}>
                        {feedback}
                      </p>
                    )}
                  </>
                ) : (
                  <ActivityButton onClick={generateNewNumber}>
                    Generate Number
                  </ActivityButton>
                )}
              </div>
              <ActivityButton
                onClick={resetActivity}
                className="w-full mt-2 bg-gray-200 hover:bg-gray-300"
              >
                Reset
              </ActivityButton>
            </div>

            {/* Column 2 - Number Line */}
            <div className={`space-y-4 ${columnClasses[1]}`}>
              <h3 className="text-2xl font-bold mb-2 text-center">Number Line</h3>
              {currentNumber !== null ? (
                <NumberLine
                  number={currentNumber}
                  inversePoint={inversePoint}
                  onPlaceInverse={handlePlaceInverse}
                />
              ) : (
                <ActivityButton onClick={generateNewNumber}>
                  Generate Number
                </ActivityButton>
              )}
              <ActivityButton
                onClick={resetActivity}
                className="w-full mt-2 bg-gray-200 hover:bg-gray-300"
              >
                Reset
              </ActivityButton>
            </div>

            {/* Column 3 - Balance Scale */}
            <div className={`space-y-4 ${columnClasses[2]}`}>
              <h3 className="text-2xl font-bold mb-2 text-center">Balance Scale</h3>
              {currentNumber !== null ? (
                <BalanceScale
                  number={currentNumber}
                  onBalanced={handleBalanced}
                />
              ) : (
                <ActivityButton onClick={generateNewNumber}>
                  Generate Number
                </ActivityButton>
              )}
              {balanceFeedback && (
                <p className={`mt-2 text-lg ${balanceFeedback.includes('Balanced') ? 'text-green-500' : 'text-red-500'}`}>
                  {balanceFeedback}
                </p>
              )}
              <ActivityButton
                onClick={resetActivity}
                className="w-full mt-2 bg-gray-200 hover:bg-gray-300"
              >
                Reset
              </ActivityButton>
            </div>
          </div>
        </InteractiveArea>
      </AnimatedSection>
    </ActivityLayout>
  );
};

export default AdditiveInverses;
