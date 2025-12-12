"use client";

import { AnimatedDiv } from '@/components/animation/AnimatedComponents';
import { Quote } from 'lucide-react';

interface TestimonialCardProps {
  name: string;
  location: string;
  quote: string;
  index?: number;
}

export default function TestimonialCard({ name, location, quote, index = 0 }: TestimonialCardProps) {
  return (
    <AnimatedDiv
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6 relative"
    >
      <Quote className="absolute top-4 right-4 w-8 h-8 text-[#FFD700] opacity-20" />
      
      <div className="relative z-10">
        <p className="text-slate-200 leading-relaxed mb-4 italic">
          &quot;{quote}&quot;
        </p>
        
        <div className="flex items-center gap-3 pt-4 border-t border-slate-700">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center">
            <span className="text-black font-bold text-lg">
              {name.charAt(0)}
            </span>
          </div>
          <div>
            <p className="text-white font-semibold">{name}</p>
            <p className="text-slate-400 text-sm">{location}</p>
          </div>
        </div>
      </div>
    </AnimatedDiv>
  );
}
