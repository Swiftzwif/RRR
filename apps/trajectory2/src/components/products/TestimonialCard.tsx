"use client";

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Quote } from 'lucide-react';

interface TestimonialCardProps {
  name: string;
  location: string;
  quote: string;
  index: number;
}

export default function TestimonialCard({ name, location, quote, index }: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Card className="h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-300">
        <CardContent className="p-6">
          <Quote className="w-8 h-8 text-[#FFD700] mb-4" />
          <p className="text-slate-200 leading-relaxed mb-6 italic">
            "{quote}"
          </p>
          <div className="border-t border-slate-700 pt-4">
            <p className="font-bold text-white">{name}</p>
            <p className="text-sm text-slate-400">{location}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

