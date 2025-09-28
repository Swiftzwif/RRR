'use client';

import { useGameStore, useGameTimer } from '@/lib/game-store';
import { laneGameQuestions } from '@trajectory/content';
import { Toast } from '@trajectory/ui';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function GameInterface() {
  const router = useRouter();
  const {
    sessionId,
    questionOrder,
    currentQuestionIndex,
    answers,
    timer,
    isTimerActive,
    milestones,
    microInsights,
    startSession,
    startTimer,
    stopTimer,
    answerQuestion,
    advanceQuestion,
    timeoutQuestion,
  } = useGameStore();

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasChanged, setHasChanged] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showMicroInsight, setShowMicroInsight] = useState(false);
  const [currentQuote, setCurrentQuote] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  const [particleKey, setParticleKey] = useState(0);

  // Motivational quotes for different progress levels
  const motivationalQuotes = [
    "Every expert was once a beginner. Every pro was once an amateur.",
    "The way to get started is to quit talking and begin doing.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "Don't be pushed around by the fears in your mind. Be led by the dreams in your heart.",
    "The only impossible journey is the one you never begin.",
    "Success is walking from failure to failure with no loss of enthusiasm.",
    "The way to get started is to quit talking and begin doing.",
    "Your limitation—it's only your imagination.",
    "Great things never come from comfort zones.",
    "Dream it. Wish it. Do it.",
    "Success doesn't just find you. You have to go out and get it.",
    "The harder you work for something, the greater you'll feel when you achieve it.",
    "Dream bigger. Do bigger.",
    "Don't stop when you're tired. Stop when you're done.",
    "Wake up with determination. Go to bed with satisfaction.",
    "Do something today that your future self will thank you for.",
    "Little things make big days.",
    "It's going to be hard, but hard does not mean impossible.",
    "Don't wait for opportunity. Create it."
  ];

  // Timer hook
  useGameTimer();

  // Initialize game session on mount
  useEffect(() => {
    if (!sessionId) {
      startSession();
    }
  }, [sessionId, startSession]);

  // Set motivational quote based on progress
  useEffect(() => {
    if (questionOrder.length > 0) {
      const quoteIndex = Math.floor((currentQuestionIndex / questionOrder.length) * motivationalQuotes.length);
      setCurrentQuote(motivationalQuotes[quoteIndex] || motivationalQuotes[0]);
    }
  }, [currentQuestionIndex, questionOrder.length]);

  // Get current question
  const currentQuestionId = questionOrder[currentQuestionIndex];
  const currentQuestion = [...laneGameQuestions.questions, ...laneGameQuestions.validationQuestions]
    .find(q => q.id === currentQuestionId);

  // Progress calculation
  const progress = questionOrder.length > 0 ? ((currentQuestionIndex + 1) / questionOrder.length) * 100 : 0;

  // Start timer when component mounts
  useEffect(() => {
    if (currentQuestion && !isTimerActive) {
      startTimer();
    }
  }, [currentQuestion, isTimerActive, startTimer]);

  // Check for milestones
  useEffect(() => {
    const milestoneThresholds = [25, 50, 75, 100];
    const currentMilestone = milestoneThresholds.find(threshold => 
      progress >= threshold && !milestones.has(threshold / 100)
    );
    
    if (currentMilestone) {
      const message = laneGameQuestions.metadata.milestoneMessages[currentMilestone.toString()];
      setToastMessage(message);
      setShowToast(true);
    }
  }, [progress, milestones]);

  // Show micro insights
  useEffect(() => {
    if (microInsights.length > 0 && currentQuestionIndex > 0 && currentQuestionIndex % 3 === 0) {
      const latestInsight = microInsights[microInsights.length - 1];
      setToastMessage(latestInsight);
      setShowMicroInsight(true);
    }
  }, [microInsights, currentQuestionIndex]);

  // Handle answer selection
  const handleAnswerSelect = (value: number) => {
    if (selectedAnswer !== null && selectedAnswer !== value) {
      setHasChanged(true);
    }
    setSelectedAnswer(value);
    
    // Trigger celebration animation
    setShowCelebration(true);
    setParticleKey(prev => prev + 1);
    
    // Hide celebration after animation
    setTimeout(() => setShowCelebration(false), 2000);
  };

  // Handle submit
  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    
    stopTimer();
    answerQuestion(currentQuestionId, selectedAnswer, hasChanged);
    
    // Small delay before advancing
    setTimeout(() => {
      advanceQuestion();
      setSelectedAnswer(null);
      setHasChanged(false);
    }, 1000);
  };

  // Handle timeout
  useEffect(() => {
    if (timer === 0 && isTimerActive) {
      timeoutQuestion();
    }
  }, [timer, isTimerActive, timeoutQuestion]);

  // Show loading state while session is being initialized
  if (!sessionId || questionOrder.length === 0) {
    return (
      <div className="min-h-screen strata-gradient flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="strata-card p-12 text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-3 border-sky-200 border-t-sky-400 rounded-full mx-auto mb-8"
          />
          <h3 className="text-3xl font-display font-semibold text-sky-800 mb-4">
            Preparing Your Journey
          </h3>
          <p className="text-sky-600 text-lg">
            Setting up your personalized lane diagnostic experience...
          </p>
        </motion.div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen strata-gradient flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="strata-card p-12 text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-3 border-sky-200 border-t-sky-400 rounded-full mx-auto mb-8"
          />
          <h3 className="text-3xl font-display font-semibold text-sky-800 mb-4">
            Loading Next Question
          </h3>
          <p className="text-sky-600 text-lg">
            Preparing your next challenge...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 50%, #BAE6FD 100%)',
              'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 50%, #7DD3FC 100%)',
              'linear-gradient(135deg, #BAE6FD 0%, #7DD3FC 50%, #38BDF8 100%)',
              'linear-gradient(135deg, #7DD3FC 0%, #38BDF8 50%, #0EA5E9 100%)',
              'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 50%, #BAE6FD 100%)'
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Animated Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`particle-${i}-${particleKey}`}
              className="absolute w-2 h-2 bg-sunset rounded-full opacity-60"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: 0
              }}
              animate={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: [0, 1, 0],
                rotate: [0, 360]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* Celebration Particles */}
        {showCelebration && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={`celebration-${i}`}
                className="absolute w-3 h-3 bg-sunset rounded-full"
                initial={{
                  x: '50%',
                  y: '50%',
                  scale: 0
                }}
                animate={{
                  x: `${50 + (Math.random() - 0.5) * 200}%`,
                  y: `${50 + (Math.random() - 0.5) * 200}%`,
                  scale: [0, 1, 0],
                  rotate: [0, 720]
                }}
                transition={{
                  duration: 1.5,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Game Progress Header */}
      <div className="relative z-10 pt-8 pb-4">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="strata-card p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-8">
                <motion.div 
                  className="text-center"
                  animate={showCelebration ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-3xl font-display font-bold text-sky-800">
                    LEVEL {currentQuestionIndex + 1}
                  </p>
                  <p className="text-sm text-sky-600 font-medium">of {questionOrder.length}</p>
                </motion.div>
                
                <motion.div 
                  className="text-center"
                  animate={showCelebration ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <p className="text-3xl font-display font-bold text-sunset">
                    {Math.round(progress)}%
                  </p>
                  <p className="text-sm text-sky-600 font-medium">JOURNEY COMPLETE</p>
                </motion.div>
              </div>
              
              <motion.div 
                className="text-right"
                animate={timer <= 10 ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5, repeat: timer <= 10 ? Infinity : 0 }}
              >
                <p className="text-sm text-sky-600 mb-1 font-medium">⏰ TIME LEFT</p>
                <p className={`text-3xl font-mono font-bold ${timer <= 10 ? 'text-danger' : 'text-sky-700'}`}>
                  {timer}s
                </p>
              </motion.div>
            </div>
            
            {/* Game Progress Bar */}
            <div className="relative">
              <div className="strata-meter h-4 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-sky-400 via-sky-500 to-sunset"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                />
              </div>
              
              {/* Progress Stars */}
              <div className="absolute top-0 left-0 w-full h-full flex justify-between items-center px-2">
                {[25, 50, 75, 100].map((milestone, index) => (
                  <motion.div
                    key={milestone}
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      progress >= milestone ? 'bg-sunset text-white' : 'bg-white border-2 border-sky-300'
                    }`}
                    animate={progress >= milestone ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    ⭐
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Motivational Quote */}
      <div className="relative z-10 mb-8">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            key={currentQuote}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
          >
            <div className="strata-card p-6 text-center">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-lg font-medium text-sky-700 italic leading-relaxed">
                  "{currentQuote}"
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Game Question Card */}
      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="strata-card p-10 mb-8 relative overflow-hidden"
        >
          {/* Game Question Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div
                className="inline-block mb-4"
                animate={showCelebration ? { rotate: [0, 10, -10, 0] } : {}}
                transition={{ duration: 0.5 }}
              >
                <span className="text-2xl">🎯</span>
              </motion.div>
              
              <h1 className="text-3xl md:text-4xl font-display font-bold text-sky-800 mb-6 leading-relaxed">
                {currentQuestion.prompt}
              </h1>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="inline-flex items-center space-x-2 bg-sky-100 px-4 py-2 rounded-full"
              >
                <span className="text-sky-600 text-sm font-medium">⚡ CHOOSE YOUR PATH</span>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Game Answer Options */}
          <div className="space-y-4 mb-12">
            <AnimatePresence>
              {currentQuestion.options.map((option, index) => (
                <motion.button
                  key={option.value}
                  initial={{ opacity: 0, x: -50, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ 
                    delay: 0.5 + index * 0.15,
                    duration: 0.7,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  onClick={() => handleAnswerSelect(option.value)}
                  className={`w-full p-6 text-left rounded-2xl border-2 transition-all duration-300 group relative overflow-hidden ${
                    selectedAnswer === option.value
                      ? 'border-sunset bg-gradient-to-r from-sunset/10 to-sky-400/10 text-sky-800 shadow-lg'
                      : 'border-sky-200 bg-white text-sky-600 hover:border-sky-300 hover:bg-sky-25 hover:shadow-md'
                  }`}
                  whileHover={{ scale: 1.03, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {/* Selection Glow Effect */}
                  {selectedAnswer === option.value && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-sunset/20 to-sky-400/20 rounded-2xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                  
                  <div className="flex items-center relative z-10">
                    <motion.div
                      className={`w-10 h-10 rounded-full border-2 mr-6 flex items-center justify-center transition-all ${
                        selectedAnswer === option.value
                          ? 'border-sunset bg-sunset'
                          : 'border-sky-300 group-hover:border-sky-400'
                      }`}
                      animate={selectedAnswer === option.value ? { 
                        scale: [1, 1.2, 1],
                        rotate: [0, 360]
                      } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      {selectedAnswer === option.value ? (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2 }}
                          className="text-white text-lg"
                        >
                          ✓
                        </motion.span>
                      ) : (
                        <span className="text-sky-400 text-lg font-bold">
                          {String.fromCharCode(65 + index)}
                        </span>
                      )}
                    </motion.div>
                    
                    <div className="flex-1">
                      <span className="text-xl font-semibold">{option.text}</span>
                      {selectedAnswer === option.value && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="text-sunset text-sm font-medium mt-1"
                        >
                          🎯 SELECTED!
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
          
          {/* Game Continue Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="text-center"
          >
            <motion.button
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
              className={`px-12 py-5 rounded-2xl font-bold text-lg transition-all duration-300 relative overflow-hidden ${
                selectedAnswer === null
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-sunset to-sky-500 text-white shadow-lg hover:shadow-xl'
              }`}
              whileHover={selectedAnswer !== null ? { scale: 1.05, y: -3 } : {}}
              whileTap={selectedAnswer !== null ? { scale: 0.95 } : {}}
            >
              {/* Button Glow Effect */}
              {selectedAnswer !== null && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-sunset/20 to-sky-400/20 rounded-2xl"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
              
              <span className="relative z-10 flex items-center justify-center space-x-2">
                {currentQuestionIndex === questionOrder.length - 1 ? (
                  <>
                    <span>🏆</span>
                    <span>COMPLETE QUEST</span>
                    <span>🏆</span>
                  </>
                ) : (
                  <>
                    <span>⚡</span>
                    <span>NEXT LEVEL</span>
                    <span>⚡</span>
                  </>
                )}
              </span>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Toast Messages */}
      <AnimatePresence>
        {showToast && (
          <Toast
            message={toastMessage}
            type="info"
            onClose={() => setShowToast(false)}
          />
        )}
        
        {showMicroInsight && (
          <Toast
            message={toastMessage}
            type="success"
            onClose={() => setShowMicroInsight(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
