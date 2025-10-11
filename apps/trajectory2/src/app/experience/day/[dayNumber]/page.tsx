'use client';

import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle,
  Download,
  Lock,
} from "lucide-react";
import Link from 'next/link';
import { useParams } from "next/navigation";
import { useState } from 'react';

interface BookSummary {
  title: string;
  author: string;
  summary: string;
  keyTakeaways: string[];
}

interface Task {
  title: string;
  description: string;
  completed: boolean;
}

export default function DayPage() {
  const params = useParams();
  const dayNumber = parseInt(params.dayNumber as string);

  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  const [hasAccess] = useState(false);
  
  // Check if day is accessible (1-7 free, 8+ requires purchase)
  const isFree = dayNumber <= 7;
  const isLocked = !isFree && !hasAccess;
  
  if (isLocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center py-12">
        <motion.div
          className="max-w-2xl mx-auto px-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <Lock className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-6">
            This Day is Locked
          </h1>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            Day {dayNumber} is part of the premium experience. Unlock all 31 days after meeting with Jean to continue your transformation journey.
          </p>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 shadow-lg mb-8">
            <div className="text-4xl font-bold text-orange-600 mb-2">
              $99.99
            </div>
            <p className="text-slate-600 mb-6">Get lifetime access to all 31 days</p>
            <button
              onClick={() => alert('Payment integration coming soon!')}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
            >
              Unlock Full Experience
            </button>
          </div>
          <Link
            href="/experience"
            className="inline-flex items-center text-slate-600 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Overview
          </Link>
        </motion.div>
      </div>
    );
  }

  const dayData = getDayData(dayNumber);
  const progress = (completedTasks.length / dayData.tasks.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link
            href="/experience"
            className="inline-flex items-center text-slate-600 hover:text-orange-600 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Overview
          </Link>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center font-bold text-2xl text-white shadow-lg">
              {dayNumber}
            </div>
            {isFree && (
              <div className="px-4 py-2 bg-green-500 text-white text-sm font-bold rounded-full">
                FREE DAY
              </div>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            {dayData.title}
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed max-w-3xl">
            {dayData.description}
          </p>
        </motion.div>

        {/* Progress */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 shadow-lg mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-slate-600">
              Day Progress
            </span>
            <span className="text-sm font-bold text-orange-600">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3">
            <motion.div
              className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </motion.div>

        {/* Book Summaries */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-3xl font-bold text-slate-800 mb-8 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-orange-600" />
            Today&apos;s Book Summaries
          </h2>

          <div className="space-y-6">
            {dayData.bookSummaries.map((book, index) => (
              <motion.div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              >
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">
                      {index + 1}
                    </span>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">
                      {book.title}
                    </h3>
                    <p className="text-slate-600 mb-4">by {book.author}</p>

                    <p className="text-slate-700 leading-relaxed mb-6">
                      {book.summary}
                    </p>

                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                      <h4 className="font-semibold text-slate-800 mb-3">
                        Key Takeaways:
                      </h4>
                      <ul className="space-y-2">
                        {book.keyTakeaways.map((takeaway, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-slate-700">{takeaway}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Daily Tasks */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-slate-800 mb-8 flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-orange-600" />
            Today&apos;s Action Tasks
          </h2>

          <div className="space-y-4">
            {dayData.tasks.map((task, index) => (
              <motion.div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => {
                      if (completedTasks.includes(index)) {
                        setCompletedTasks(
                          completedTasks.filter((t) => t !== index)
                        );
                      } else {
                        setCompletedTasks([...completedTasks, index]);
                      }
                    }}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      completedTasks.includes(index)
                        ? "bg-green-500 text-white"
                        : "bg-slate-200 text-slate-400 hover:bg-slate-300"
                    }`}
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>

                  <div className="flex-1">
                    <h3
                      className={`text-xl font-bold mb-2 transition-all duration-300 ${
                        completedTasks.includes(index)
                          ? "text-slate-400 line-through"
                          : "text-slate-800"
                      }`}
                    >
                      {task.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {task.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Printable Worksheets */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-200 shadow-lg">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Download className="w-8 h-8 text-white" />
              </div>

              <div className="flex-1">
                <h3 className="text-2xl font-bold text-slate-800 mb-4">
                  Day {dayNumber} Worksheet
                </h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Download your printable worksheet to track your progress, take
                  notes, and complete reflection exercises.
                </p>
                <button
                  onClick={() => alert("Worksheet download coming soon!")}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Worksheet
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Link
            href={
              dayNumber > 1 ? `/experience/day/${dayNumber - 1}` : "/experience"
            }
            className="inline-flex items-center px-6 py-3 bg-white/80 text-slate-700 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {dayNumber > 1 ? "Previous Day" : "Overview"}
          </Link>

          {dayNumber < 31 && (
            <Link
              href={`/experience/day/${dayNumber + 1}`}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
            >
              Next Day
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          )}
        </motion.div>
      </div>
    </div>
  );
}

// Helper function to get day data
function getDayData(day: number) {
  // This would come from your database/CMS in production
  return {
    title: `Day ${day}: ${getDayTitle(day)}`,
    description: getDayDescription(day),
    bookSummaries: getBookSummaries(day),
    tasks: getDailyTasks(day),
  };
}

function getDayTitle(day: number): string {
  const titles: Record<number, string> = {
    1: 'Kill the Boy - The Awakening',
    2: 'Command Your Attention',
    3: 'Command Your Energy',
    4: 'Command Your Money',
    5: 'The Three Lanes',
    6: 'Audit Your Vehicle',
    7: 'Equipment Upgrades',
  };
  return titles[day] || `Transformation Step ${day}`;
}

function getDayDescription(day: number): string {
  const descriptions: Record<number, string> = {
    1: 'Begin your transformation by understanding the power of killing the boy and awakening the commander within. This foundational day sets the stage for your entire journey.',
    2: 'Learn to reclaim your attention from algorithms and distractions that steal your focus. Master the art of intentional awareness.',
    3: 'Master your energy management and create sustainable systems for peak performance throughout your day.',
    4: 'Transform your relationship with money and build financial command. Money becomes a tool, never a master.',
    5: 'Understand the SlowLane, SideLane, and FastLane - and consciously choose your trajectory.',
    6: 'Conduct a deep audit of your current position and identify specific areas for improvement.',
    7: 'Learn the knowledge, understanding, and wisdom upgrades that accelerate exponential growth.',
  };
  return descriptions[day] || 'Continue your journey of transformation and growth with today\'s lessons.';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getBookSummaries(_day: number): BookSummary[] {
  // This would come from your database in production
  return [
    {
      title: 'The Millionaire Fastlane',
      author: 'MJ DeMarco',
      summary: 'Discover the roadmap to wealth that doesn\'t take 40 years. DeMarco exposes why the "Get Rich Slow" mentality is flawed and introduces the Fastlane - a business and lifestyle strategy that accelerates wealth creation.',
      keyTakeaways: [
        'Wealth is a process, not an event',
        'Time is your most valuable asset',
        'Build systems that create wealth while you sleep',
      ],
    },
    {
      title: 'The 4-Hour Workweek',
      author: 'Tim Ferriss',
      summary: 'Learn to escape the 9-5 grind, live anywhere, and join the new rich. Ferriss shows you how to design your ideal lifestyle by eliminating time waste and automating income.',
      keyTakeaways: [
        'Focus on being productive, not busy',
        'Automate your income through systems',
        'Design your life around mini-retirements',
      ],
    },
    {
      title: 'Atomic Habits',
      author: 'James Clear',
      summary: 'Tiny changes lead to remarkable results. Learn the science of habit formation and how small improvements compound into major transformations over time.',
      keyTakeaways: [
        '1% better every day = 37x better in a year',
        'Focus on systems, not goals',
        'Make habits obvious, attractive, easy, and satisfying',
      ],
    },
  ];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getDailyTasks(_day: number): Task[] {
  return [
    {
      title: 'Morning Reflection Exercise',
      description: 'Spend 15 minutes journaling about how today\'s book summaries apply to your current situation. What is one insight that resonates most?',
      completed: false,
    },
    {
      title: 'Action Implementation',
      description: 'Choose ONE key takeaway from today\'s readings and implement it immediately. Take a small, concrete action that moves you forward.',
      completed: false,
    },
  ];
}
