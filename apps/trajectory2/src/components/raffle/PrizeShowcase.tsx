'use client';

import { AnimatedDiv, AnimatedP } from '@/components/animation/AnimatedComponents';
import { DollarSign, BookOpen, Zap, Trophy, Gift, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const prizes = [
  {
    type: 'grand',
    icon: Zap,
    title: '3 Inner Mastery Sessions',
    description: 'Premium transformation coaching (Coming Soon)',
    quantity: 1,
    value: '$2,000+ value',
    color: 'from-yellow-400 to-yellow-600',
  },
  {
    type: 'premium',
    icon: Gift,
    title: 'Trajectory Gear Package',
    description: 'Exclusive merchandise and transformation tools',
    quantity: 3,
    value: '$500 value',
    color: 'from-sky-400 to-sky-600',
  },
  {
    type: 'exclusive',
    icon: Trophy,
    title: '1-on-1 Strategy Session',
    description: 'Personal breakthrough session with a coach',
    quantity: 5,
    value: '$300 each',
    color: 'from-purple-400 to-purple-600',
  },
];

export default function PrizeShowcase() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <AnimatedDiv
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <Trophy className="w-6 h-6 text-orange-500" />
            <h2 className="text-4xl md:text-5xl font-black text-sky-800">
              Win Transformation Accelerators
            </h2>
            <Trophy className="w-6 h-6 text-orange-500" />
          </div>
          <p className="text-xl text-sky-600 max-w-3xl mx-auto">
            Every entry gets you the course at 35% off PLUS a chance to win these life-changing prizes.
            <br />
            <span className="font-bold text-orange-500">16 total winners will be selected.</span>
          </p>
        </AnimatedDiv>

        {/* Prize cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {prizes.map((prize, index) => (
            <AnimatedDiv
              key={prize.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="relative h-full border-2 hover:border-orange-500/50 transition-all duration-300 hover:shadow-2xl group">
                {/* Prize type badge */}
                {prize.type === 'grand' && (
                  <div className="absolute -top-3 -right-3 z-10">
                    <AnimatedDiv
                      className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase shadow-lg"
                      animate={{
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      Grand Prize
                    </AnimatedDiv>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  {/* Icon with gradient background */}
                  <AnimatedDiv
                    className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${prize.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <prize.icon className="w-10 h-10 text-white" />
                  </AnimatedDiv>

                  <CardTitle className="text-2xl font-black text-sky-800">
                    {prize.title}
                  </CardTitle>
                  <Badge variant="secondary" className="mt-2">
                    {prize.quantity} {prize.quantity === 1 ? 'Winner' : 'Winners'}
                  </Badge>
                </CardHeader>

                <CardContent className="text-center">
                  <p className="text-sky-600 mb-4">{prize.description}</p>
                  <div className="pt-4 border-t border-sky-100">
                    <span className="text-sm text-sky-500">Value:</span>
                    <span className="text-lg font-bold text-orange-500 ml-2">{prize.value}</span>
                  </div>
                </CardContent>
              </Card>
            </AnimatedDiv>
          ))}
        </div>

        {/* Total value highlight */}
        <AnimatedDiv
          className="bg-gradient-to-r from-sky-50 to-orange-500/10 rounded-2xl p-8 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div>
              <Gift className="w-12 h-12 text-orange-500 mx-auto mb-2" />
              <div className="text-3xl font-black text-sky-800">$2,500+</div>
              <div className="text-sky-600">Total Prize Value</div>
            </div>

            <div className="hidden md:block w-px h-16 bg-sky-200" />

            <div>
              <Star className="w-12 h-12 text-orange-500 mx-auto mb-2" />
              <div className="text-3xl font-black text-sky-800">16</div>
              <div className="text-sky-600">Total Winners</div>
            </div>

            <div className="hidden md:block w-px h-16 bg-sky-200" />

            <div>
              <Zap className="w-12 h-12 text-orange-500 mx-auto mb-2" />
              <div className="text-3xl font-black text-sky-800">100%</div>
              <div className="text-sky-600">Fair Drawing</div>
            </div>
          </div>
        </AnimatedDiv>

        {/* Trust message */}
        <AnimatedP
          className="text-center text-sm text-sky-600 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Winners selected randomly via cryptographic algorithm. Drawing happens 24 hours after raffle ends.
        </AnimatedP>
      </div>
    </section>
  );
}