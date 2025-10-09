"use client";

import { getCopy } from '@/lib/copy';
import { ArrowRight, CheckCircle, Users, Zap } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const phrases = [
    "Command your attention",
    "Command your energy", 
    "Command your money"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % phrases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const copyFeatures = (getCopy("landing.features.items") as any) || [];
  
  // Map copy features to include icons
  const iconMap = {
    "Your Life Avatar": Users,
    "Domain Analysis": Zap,
    "Action Plan": CheckCircle,
  };

  const features = copyFeatures.map((feature: any) => ({
    ...feature,
    icon: iconMap[feature.title as keyof typeof iconMap] || Users
  }));

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section - Matching @Trajectory/ aesthetic */}
      <section className="pt-16 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 min-h-screen flex items-center text-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-orange-500 rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-green-500 rounded-full animate-ping"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <div className="mb-12 lg:mb-0">
              <div className="mb-8">
                <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight animate-fade-in">
                  Trajectory
                </h1>
                <h2 className="text-3xl md:text-4xl font-light text-blue-300 mb-8 h-16 flex items-center">
                  <span className="transition-all duration-500 ease-in-out transform">
                    {phrases[currentPhrase]}
                  </span>
                </h2>
              </div>
              
              <div className="space-y-6 text-lg text-gray-300 leading-relaxed mb-8">
                <p>
                  Transform from good little soldier to commander of your life.
                </p>
                <p>
                  Most men drift through life unaware of their worth—distracted by feeds, trapped in yesterday's thoughts, 
                  repeating the same inputs and getting the same results.
                </p>
                <p>
                  Trajectory2.0 exists to help you reclaim the throne of your mind and lead from within.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/assessment/landing"
                  className="bg-orange-600 text-white px-8 py-4 rounded-lg hover:bg-orange-700 hover:scale-105 transition-all duration-300 flex items-center justify-center group font-semibold shadow-lg hover:shadow-xl"
                >
                  Start Assessment
                  <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform duration-300" size={20} />
                </Link>
                <Link 
                  href="/story"
                  className="border-2 border-blue-400 text-blue-300 px-8 py-4 rounded-lg hover:border-blue-300 hover:bg-blue-900/30 hover:scale-105 transition-all duration-300 font-semibold"
                >
                  Learn More
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl p-8 relative border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-500 rounded-full opacity-20"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-500 rounded-full opacity-20"></div>
                
                <div className="flex justify-center mb-6">
                  <div className="text-center">
                    <div className="h-16 w-16 rounded-full bg-white/20 p-2 mx-auto mb-4 flex items-center justify-center">
                      <span className="text-2xl">🚀</span>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-2">Kill the Boy</h3>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <p className="text-2xl font-light text-yellow-300 animate-pulse">
                      You have infinite worth
                    </p>
                  </div>
                  
                  <blockquote className="text-xl font-light italic text-gray-200">
                    "The boy takes orders. The man commands."
                  </blockquote>
                  
                  <div className="space-y-4 text-gray-300">
                    <div className="flex items-center space-x-3 hover:text-white transition-colors duration-200 cursor-pointer">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>Command your attention</span>
                    </div>
                    <div className="flex items-center space-x-3 hover:text-white transition-colors duration-200 cursor-pointer">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Command your energy</span>
                    </div>
                    <div className="flex items-center space-x-3 hover:text-white transition-colors duration-200 cursor-pointer">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Command your money</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-white/20">
                    <p className="text-sm text-gray-400">
                      Transform 250 men by 2026
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-semibold mb-6 shadow-lg">
              <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
              DISCOVER YOUR POTENTIAL
            </div>
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-6">
              What You'll Discover
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Trajectory2.0 combines cutting-edge assessment technology with proven transformation frameworks used by top entrepreneurs and leaders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              const gradients = [
                'from-blue-500 to-cyan-500',
                'from-purple-500 to-pink-500', 
                'from-orange-500 to-red-500'
              ];
              const bgGradients = [
                'from-blue-50 to-cyan-50',
                'from-purple-50 to-pink-50',
                'from-orange-50 to-red-50'
              ];
              return (
                <div
                  key={index}
                  className={`text-center p-10 rounded-3xl bg-gradient-to-br ${bgGradients[index]} border border-white/50 hover:shadow-2xl transition-all duration-500 hover:scale-105 group relative overflow-hidden`}
                >
                  {/* Animated background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index]} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  
                  <div className={`w-20 h-20 bg-gradient-to-br ${gradients[index]} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-slate-700 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-lg relative z-10">{feature.description}</p>
                  
                  {/* Decorative element */}
                  <div className={`absolute top-4 right-4 w-8 h-8 bg-gradient-to-br ${gradients[index]} rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300`}></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About/Story Section */}
      <section className="py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-sm font-semibold mb-8 shadow-lg">
                <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                THE TRAJECTORY STORY
              </div>
              <h2 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                What Does Trajectory Mean to You?
              </h2>
              <div className="space-y-8 text-lg leading-relaxed">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <p className="text-xl font-medium text-blue-200 mb-4">
                    To me, Trajectory means meeting one person who cares about you so deeply that the relationship changes the entire path of your life.
                  </p>
                  <p className="text-gray-300">I know this because it's happened to me.</p>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-400/30">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-200"><span className="font-semibold text-white">My mentor, Rob Aquino,</span> changed the trajectory of my life. His leadership and guidance gave me direction and a sense of clarity. He helped me dream again.</p>
                  </div>
                  <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-400/30">
                    <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-200"><span className="font-semibold text-white">My uncle, Jonathan Maldonado,</span> changed the trajectory of my life. His love, his presence, his teachings on human nature… challenged my worldview and pushed me to think bigger.</p>
                  </div>
                  <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl border border-orange-400/30">
                    <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-red-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-200"><span className="font-semibold text-white">And finally, my first love, my first heartbreak,</span> changed the trajectory of my life. That relationship helped me uncover things about myself, it taught me many lessons. It broke me open and shaped who I am today.</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-2xl p-6 border border-orange-400/30">
                  <p className="text-xl font-medium text-orange-200 mb-4">
                    I wouldn't trade those experiences, those lessons — more importantly, those relationships — for anything in the world. They gave me guidance.
                  </p>
                  <p className="text-gray-300">Each of these relationships altered my path, that led me here — not through perfection, but through their presence, their care, and their influence.</p>
                </div>
              </div>
              <div className="mt-10">
                <Link href="/story" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 hover:scale-105 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl">
                  Read Full Story
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-10 border border-white/20 shadow-2xl">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                    <span className="text-white font-bold text-4xl">T</span>
                  </div>
                  <h3 className="text-4xl font-bold text-white mb-6">Your Trajectory Determines Your Destiny</h3>
                  <p className="text-xl text-blue-200 mb-8 leading-relaxed">We help you rethink, redesign, and reignite who you are—so you can shift from drift to direction.</p>
                  <Link href="/assessment/landing" className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 hover:scale-105 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl">
                    Start Your Assessment
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-32 bg-gradient-to-br from-white via-blue-50 to-purple-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-20 w-80 h-80 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-sm font-semibold mb-6 shadow-lg">
              <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
              YOUR TRANSFORMATION JOURNEY
            </div>
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-6">
              Welcome to the Trajectory Experience
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              Your trajectory determines your destiny. We help you rethink, redesign, and reignite who you are—so you can shift from drift to direction.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8 border border-blue-200/50 hover:shadow-2xl transition-all duration-500 hover:scale-105 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
              <div className="flex items-center mb-6 relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-2xl flex items-center justify-center font-bold text-xl mr-4 shadow-lg">1</div>
                <h3 className="text-2xl font-bold text-slate-900">Free Diagnosis</h3>
              </div>
              <h4 className="text-xl font-semibold text-blue-600 mb-4 relative z-10">Kill the Boy | Life Assessment</h4>
              <p className="text-slate-700 mb-6 leading-relaxed relative z-10">Find out which lane you're living in right now—SlowLane, SideLane, or FastLane. Start with our free assessment and browse 50+ curated books that inspired the Trajectory system.</p>
              <Link href="/assessment/landing" className="inline-flex items-center justify-center w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-xl hover:from-blue-600 hover:to-cyan-600 hover:scale-105 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl">
                Take Free Assessment
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
            
            {/* Step 2 - Featured */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl p-8 border-2 border-orange-300 hover:shadow-2xl transition-all duration-500 hover:scale-105 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-full opacity-20"></div>
              <div className="flex items-center mb-6 relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-2xl flex items-center justify-center font-bold text-xl mr-4 shadow-lg">2</div>
                <h3 className="text-2xl font-bold text-slate-900">Digital Application</h3>
              </div>
              <h4 className="text-xl font-semibold text-orange-600 mb-4 relative z-10">Change Your Trajectory: Rethink · Redesign · Reignite</h4>
              <p className="text-slate-700 mb-6 leading-relaxed relative z-10">A focused self-discovery journey that upgrades every part of your inner vehicle with awareness, knowledge, action, and transformation upgrades.</p>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-orange-200/50 relative z-10">
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-900 mb-2">
                    <span className="line-through text-slate-400">$199.99</span> → <span className="text-orange-600">$99.99</span>
                  </div>
                  <p className="text-sm text-slate-600">50% OFF - Limited to first 250 people</p>
                </div>
              </div>
              <Link href="/course" className="inline-flex items-center justify-center w-full bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl hover:from-orange-600 hover:to-red-600 hover:scale-105 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl">
                Get the Guide
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
            
            {/* Step 3 */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border border-green-200/50 hover:shadow-2xl transition-all duration-500 hover:scale-105 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
              <div className="flex items-center mb-6 relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-2xl flex items-center justify-center font-bold text-xl mr-4 shadow-lg">3</div>
                <h3 className="text-2xl font-bold text-slate-900">One-on-One Sessions</h3>
              </div>
              <h4 className="text-xl font-semibold text-green-600 mb-4 relative z-10">Infinite Worth Sessions | 4 Sessions · 1 Month</h4>
              <p className="text-slate-700 mb-6 leading-relaxed relative z-10">Guided transformation through the core pillars of Trajectory: Rethink, Redesign, and Reignite. Only 250 coaching spots available per year.</p>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-green-200/50 relative z-10">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 mb-2">$100 per session</div>
                  <p className="text-sm text-slate-600">4 sessions total = $400</p>
                </div>
              </div>
              <Link href="/coaching" className="inline-flex items-center justify-center w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-xl hover:from-green-600 hover:to-emerald-600 hover:scale-105 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl">
                Apply for Coaching
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-32 bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full text-sm font-semibold mb-6 shadow-lg">
              <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
              FREE RESOURCES & STORY
            </div>
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 via-purple-900 to-pink-900 bg-clip-text text-transparent mb-6">
              Free Resources & The Kill the Boy Story
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              Start your transformation journey with our free assessment and discover the story that changed everything.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-20">
            <div>
              <h3 className="text-4xl font-bold text-slate-900 mb-8">The Story: Kill the Boy</h3>
              <div className="space-y-8 text-lg leading-relaxed">
                <p className="text-xl text-slate-600">When I turned 25, my mentor told me something I'll never forget:</p>
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 border-l-4 border-purple-500 p-8 rounded-r-2xl shadow-lg">
                  <p className="text-3xl font-bold text-slate-900 mb-4">"Kill the boy."</p>
                  <p className="text-slate-700 text-lg">It wasn't about violence. It was about transformation.</p>
                </div>
                <p className="text-slate-600 text-lg">It meant letting go of the parts of me that kept me small, reactive, average — so I could rise into discipline, presence, and responsibility.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold text-red-600 mb-6">The Boy</h4>
                    <div className="space-y-3 text-slate-600">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p>The boy settles. The man insists.</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p>The boy tolerates mediocrity. The man demands excellence.</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p>The boy complains. The man is silent, steady, grounded.</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p>The boy explains himself. The man doesn't need to — his presence speaks.</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p>The boy reacts, pulled like a puppet. The man observes, cuts the strings, and chooses his response.</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p>The boy rushes. The man moves with intention.</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p>The boy asks: "What can the world offer me?"</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold text-green-600 mb-6">The Man</h4>
                    <div className="space-y-3 text-slate-600">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p>The man commands.</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p>The man creates solutions for others.</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p>The man needs no explanation. His presence speaks louder than words.</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p>The man cuts the strings and chooses every response with intention.</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p>The man moves with patience and precision, every action aligned.</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p>The man asks: "What can I offer the world?"</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 border border-purple-200">
                  <p className="text-xl font-medium text-slate-800">To kill the boy is not to reject your youth, but to lay it to rest — so the man can rise.</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 text-white rounded-3xl p-10 shadow-2xl border border-white/10">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                    <span className="text-white font-bold text-3xl">📊</span>
                  </div>
                  <h3 className="text-4xl font-bold text-white mb-6">Free Life Assessment</h3>
                  <p className="text-xl text-gray-200 mb-8 leading-relaxed">Discover what's shaping your path and how to raise your floor in 10 minutes. Get your personalized scorecard plus 1–2 micro-actions to raise your floor this week.</p>
                  <div className="space-y-6 mb-8">
                    <div className="flex items-center text-gray-200">
                      <span className="w-3 h-3 bg-gradient-to-r from-orange-400 to-red-500 rounded-full mr-4"></span>
                      <span className="text-lg">Find out which lane you're in</span>
                    </div>
                    <div className="flex items-center text-gray-200">
                      <span className="w-3 h-3 bg-gradient-to-r from-orange-400 to-red-500 rounded-full mr-4"></span>
                      <span className="text-lg">Get your Trajectory Avatar</span>
                    </div>
                    <div className="flex items-center text-gray-200">
                      <span className="w-3 h-3 bg-gradient-to-r from-orange-400 to-red-500 rounded-full mr-4"></span>
                      <span className="text-lg">Receive personalized actions</span>
                    </div>
                  </div>
                  <Link href="/assessment/landing" className="inline-flex items-center justify-center w-full bg-gradient-to-r from-orange-500 to-red-500 text-white px-10 py-5 rounded-xl hover:from-orange-600 hover:to-red-600 hover:scale-105 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl">
                    Take Free Assessment
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8 border border-blue-200/50 hover:shadow-2xl transition-all duration-500 hover:scale-105 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg relative z-10">
                <span className="text-white font-bold text-2xl">📚</span>
              </div>
              <h4 className="text-2xl font-bold text-slate-900 mb-4 relative z-10">Trajectory Books</h4>
              <p className="text-slate-600 mb-6 leading-relaxed relative z-10">A curated collection of 50+ transformational books for growth-minded men ready to command their lives.</p>
              <Link href="/resources" className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800 transition-colors relative z-10">
                Download Free List
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl p-8 border border-orange-200/50 hover:shadow-2xl transition-all duration-500 hover:scale-105 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg relative z-10">
                <span className="text-white font-bold text-2xl">🎯</span>
              </div>
              <h4 className="text-2xl font-bold text-slate-900 mb-4 relative z-10">Weekly Newsletter</h4>
              <p className="text-slate-600 mb-6 leading-relaxed relative z-10">Get weekly insights, frameworks, and practical tools to accelerate your transformation journey.</p>
              <Link href="/newsletter" className="inline-flex items-center text-orange-600 font-semibold hover:text-orange-800 transition-colors relative z-10">
                Subscribe Free
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border border-green-200/50 hover:shadow-2xl transition-all duration-500 hover:scale-105 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg relative z-10">
                <span className="text-white font-bold text-2xl">🎥</span>
              </div>
              <h4 className="text-2xl font-bold text-slate-900 mb-4 relative z-10">Video Resources</h4>
              <p className="text-slate-600 mb-6 leading-relaxed relative z-10">Access our library of transformational videos, interviews, and guided exercises.</p>
              <Link href="/videos" className="inline-flex items-center text-green-600 font-semibold hover:text-green-800 transition-colors relative z-10">
                Watch Free
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-80 h-80 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-orange-400 to-red-500 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>
        
        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-lg font-semibold mb-8 shadow-lg">
            <span className="w-3 h-3 bg-white rounded-full mr-3 animate-pulse"></span>
            READY TO TRANSFORM?
          </div>
          <h2 className="text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
            Ready to Command Your Trajectory?
          </h2>
          <p className="text-2xl text-gray-200 mb-12 leading-relaxed max-w-4xl mx-auto">
            Join 250+ men who are transforming their lives. Start with our free assessment and discover your path to command.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/assessment/landing" className="inline-flex items-center px-12 py-6 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl hover:from-orange-600 hover:to-red-600 hover:scale-105 transition-all duration-300 font-semibold shadow-2xl hover:shadow-3xl text-xl">
              Take Free Assessment
              <ArrowRight className="ml-3 w-6 h-6" />
            </Link>
            <Link href="/course" className="inline-flex items-center px-12 py-6 border-2 border-white/30 text-white rounded-2xl hover:bg-white/10 hover:border-white/50 hover:scale-105 transition-all duration-300 font-semibold backdrop-blur-sm text-xl">
              Get the Course
              <ArrowRight className="ml-3 w-6 h-6" />
            </Link>
          </div>
          
          {/* Trust indicators */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400 mb-2">250+</div>
              <div className="text-gray-300">Men Transformed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">50+</div>
              <div className="text-gray-300">Books Curated</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">2026</div>
              <div className="text-gray-300">Mission Deadline</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
