'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Target, Zap, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function TransformationCommitment() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    commitmentMessage: '',
    transformationGoal: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required for your transformation journey';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Enter a real email - real transformation needs real contact';
    }

    if (!formData.commitmentMessage || formData.commitmentMessage.length < 10) {
      newErrors.commitmentMessage = 'Share your commitment (min 10 characters)';
    }

    if (!formData.transformationGoal || formData.transformationGoal.length < 20) {
      newErrors.transformationGoal = 'Describe what you want to transform (min 20 characters)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Create payment link with raffle entry
      const response = await fetch('/api/payments/raffle-entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.existingEntry) {
          alert('You\'ve already entered this raffle! Check your email for confirmation.');
        } else {
          alert(data.error || 'Something went wrong. Try again.');
        }
        return;
      }

      // Redirect to payment
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      }
    } catch (error) {
      console.error('Error submitting raffle entry:', error);
      alert('Technical issue - but your transformation is meant to be. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="commitment" className="py-20 px-4 bg-gradient-to-b from-sky-50 to-white">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="border-2 border-sunset/20 shadow-2xl">
            <CardHeader className="text-center pb-8 pt-10">
              <motion.div
                className="w-20 h-20 bg-gradient-to-br from-sunset to-sunset-dark rounded-full flex items-center justify-center mx-auto mb-4"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Heart className="w-10 h-10 text-white" />
              </motion.div>

              <CardTitle className="text-3xl md:text-4xl font-black text-sky-800 mb-4">
                Ready to Kill The Boy?
              </CardTitle>
              <CardDescription className="text-lg text-sky-600 max-w-2xl mx-auto">
                This isn&apos;t just a raffle entry. It&apos;s your commitment to transformation.
                <br />
                <span className="font-bold text-sunset">
                  Get the course for $97 (35% off) + enter to win prizes.
                </span>
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email field */}
                <div>
                  <Label htmlFor="email" className="text-sky-800 font-bold mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Your Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="warrior@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={errors.email ? 'border-red-500' : ''}
                    disabled={isSubmitting}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Phone field (optional) */}
                <div>
                  <Label htmlFor="phone" className="text-sky-800 font-bold mb-2">
                    Phone (Optional)
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={isSubmitting}
                  />
                  <p className="text-sm text-sky-600 mt-1">
                    For winner notification only
                  </p>
                </div>

                {/* Commitment message */}
                <div>
                  <Label htmlFor="commitment" className="text-sky-800 font-bold mb-2 flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Your Commitment
                  </Label>
                  <Textarea
                    id="commitment"
                    placeholder="I'm ready to kill the boy because..."
                    value={formData.commitmentMessage}
                    onChange={(e) => setFormData({ ...formData, commitmentMessage: e.target.value })}
                    className={`min-h-[80px] ${errors.commitmentMessage ? 'border-red-500' : ''}`}
                    disabled={isSubmitting}
                  />
                  {errors.commitmentMessage && (
                    <p className="text-red-500 text-sm mt-1">{errors.commitmentMessage}</p>
                  )}
                </div>

                {/* Transformation goal */}
                <div>
                  <Label htmlFor="goal" className="text-sky-800 font-bold mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    What Do You Want to Transform?
                  </Label>
                  <Textarea
                    id="goal"
                    placeholder="I want to transform my finances/health/relationships/mindset by..."
                    value={formData.transformationGoal}
                    onChange={(e) => setFormData({ ...formData, transformationGoal: e.target.value })}
                    className={`min-h-[100px] ${errors.transformationGoal ? 'border-red-500' : ''}`}
                    disabled={isSubmitting}
                  />
                  {errors.transformationGoal && (
                    <p className="text-red-500 text-sm mt-1">{errors.transformationGoal}</p>
                  )}
                  <p className="text-sm text-sky-600 mt-1">
                    Your goal will inspire other warriors (displayed anonymously)
                  </p>
                </div>

                {/* Value summary */}
                <div className="bg-gradient-to-r from-sky-50 to-sunset/10 rounded-xl p-6">
                  <h3 className="font-bold text-sky-800 mb-3">What You Get:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <span className="text-sky-700">
                        <strong>Full Trajectory Course</strong> - 31-day transformation journey ($149 value for $97)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <span className="text-sky-700">
                        <strong>Raffle Entry</strong> - Chance to win $2,500+ in prizes (16 winners)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <span className="text-sky-700">
                        <strong>Instant Access</strong> - Begin your transformation immediately
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-to-r from-sunset to-sunset-dark hover:from-sunset-dark hover:to-sunset text-white py-6 text-lg font-bold shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <motion.div
                        className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Processing Your Transformation...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Commit to Transform for $97
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  )}
                </Button>

                {/* Trust indicators */}
                <div className="text-center space-y-2 text-sm text-sky-600">
                  <p>🔒 Secure payment via Square</p>
                  <p>✅ Instant access after payment</p>
                  <p>📧 Confirmation email with everything you need</p>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Final urgency message */}
        <motion.p
          className="text-center mt-8 text-sky-600"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          Every transformation starts with a single decision.
          <br />
          <span className="font-bold text-sunset text-lg">This is yours.</span>
        </motion.p>
      </div>
    </section>
  );
}