"use client";

import { AnimatedDiv } from '@/components/animation/AnimatedComponents';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface ProductCardProps {
  badge?: string;
  badgeVariant?: 'default' | 'gold' | 'silver';
  title: string;
  subtitle: string;
  features: readonly string[];
  cta: {
    text: string;
    href: string;
    external?: boolean;
  };
  children?: React.ReactNode;
  className?: string;
}

export default function ProductCard({
  badge,
  badgeVariant = 'default',
  title,
  subtitle,
  features,
  cta,
  children,
  className = ''
}: ProductCardProps) {
  const badgeStyles = {
    default: 'bg-slate-700 text-white border-slate-600',
    gold: 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black border-[#FFD700]',
    silver: 'bg-gradient-to-r from-slate-400 to-slate-500 text-white border-slate-400'
  };

  const borderStyles = {
    default: 'border-slate-700',
    gold: 'border-[#FFD700]',
    silver: 'border-slate-400'
  };

  return (
    <AnimatedDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full"
    >
      <Card className={`h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 ${borderStyles[badgeVariant]} border-2 shadow-2xl hover:shadow-[0_0_30px_rgba(255,215,0,0.3)] transition-all duration-300 ${className}`}>
        <CardHeader className="text-center pb-6">
          {badge && (
            <Badge className={`${badgeStyles[badgeVariant]} mb-4 mx-auto text-sm font-bold px-4 py-1`}>
              {badge}
            </Badge>
          )}
          <CardTitle className="text-4xl font-bold text-white mb-3">
            {title}
          </CardTitle>
          <CardDescription className="text-slate-300 text-lg">
            {subtitle}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {children}

          {/* Features List */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-[#FFD700] flex-shrink-0 mt-0.5" />
                <span className="text-slate-200 leading-relaxed">{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="pt-6">
            {cta.external ? (
              <Button
                onClick={() => window.location.href = cta.href}
                className="w-full h-14 text-lg font-bold bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#FFA500] hover:to-[#FFD700] text-black shadow-xl hover:shadow-2xl transition-all duration-300 group"
              >
                {cta.text}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Button>
            ) : (
              <Button
                asChild
                className="w-full h-14 text-lg font-bold bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#FFA500] hover:to-[#FFD700] text-black shadow-xl hover:shadow-2xl transition-all duration-300 group"
              >
                <Link href={cta.href}>
                  {cta.text}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </AnimatedDiv>
  );
}
