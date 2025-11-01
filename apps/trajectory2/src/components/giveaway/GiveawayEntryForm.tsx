'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Zap, Trophy, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  likedPost: boolean;
  sharedPost: boolean;
  taggedFriend: boolean;
}

interface FormErrors {
  email?: string;
  firstName?: string;
  lastName?: string;
  likedPost?: string;
  sharedPost?: string;
  taggedFriend?: string;
  general?: string;
}

export default function GiveawayEntryForm() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    firstName: '',
    lastName: '',
    likedPost: false,
    sharedPost: false,
    taggedFriend: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [entryNumber, setEntryNumber] = useState<number | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    // Checkbox validations
    if (!formData.likedPost) {
      newErrors.likedPost = 'You must like the Instagram post to enter';
    }

    if (!formData.sharedPost) {
      newErrors.sharedPost = 'You must share the Instagram post to enter';
    }

    if (!formData.taggedFriend) {
      newErrors.taggedFriend = 'You must tag a friend in the comments to enter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await fetch('/api/giveaway/entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          first_name: formData.firstName.trim(),
          last_name: formData.lastName.trim(),
          liked_post: formData.likedPost,
          shared_post: formData.sharedPost,
          tagged_friend: formData.taggedFriend,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors
        if (data.details) {
          setErrors(data.details);
        } else {
          setErrors({ general: data.error || 'Failed to submit entry. Please try again.' });
        }
        setIsSubmitting(false);
        return;
      }

      // Success!
      setEntryNumber(data.entry?.entryNumber || null);
      setIsSuccess(true);

      // Trigger celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      // Reset form
      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        likedPost: false,
        sharedPost: false,
        taggedFriend: false,
      });
    } catch (error) {
      console.error('Error submitting giveaway entry:', error);
      setErrors({
        general: 'An unexpected error occurred. Please try again.',
      });
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        className="py-24 px-4 bg-gradient-to-b from-white via-green-50 to-emerald-50"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <CheckCircle className="w-20 h-20 mx-auto mb-6 text-green-500" />
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            You're In! 🎉
          </h2>
          {entryNumber && (
            <p className="text-2xl font-bold text-gray-700 mb-6">
              Entry #{entryNumber}
            </p>
          )}
          <p className="text-xl text-gray-600 mb-8">
            Check your email for confirmation. Your entry will be manually verified, and only verified entries are eligible to win.
          </p>
          <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
            <h3 className="font-bold text-gray-900 mb-4">What's Next?</h3>
            <ul className="text-left space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>You've been subscribed to the Kill The Boy Weekly Newsletter</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Your Instagram actions will be verified</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Winners will be notified after the giveaway ends</span>
              </li>
            </ul>
          </div>
          <Button
            onClick={() => setIsSuccess(false)}
            variant="outline"
            size="lg"
          >
            Enter Another Entry
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-white via-orange-50 to-red-50">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 mb-6">
            Enter the Giveaway
          </h2>
          <p className="text-xl text-gray-700 mb-4">
            Complete the form below to enter and win transformation prizes worth over $2,500!
          </p>
        </motion.div>

        {/* Entry Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* General Error */}
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-red-700 text-sm">{errors.general}</p>
            </div>
          )}

          {/* Email */}
          <div className="mb-6">
            <Label htmlFor="email" className="text-sm font-semibold text-gray-700 mb-2 block">
              Email Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* First Name */}
          <div className="mb-6">
            <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700 mb-2 block">
              First Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="firstName"
              type="text"
              placeholder="John"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              className={errors.firstName ? 'border-red-500' : ''}
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="mb-8">
            <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700 mb-2 block">
              Last Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Doe"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              className={errors.lastName ? 'border-red-500' : ''}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>

          {/* Instagram Requirements */}
          <div className="mb-8 space-y-4">
            <p className="text-sm font-semibold text-gray-700 mb-4">
              Confirm you've completed these Instagram actions: <span className="text-red-500">*</span>
            </p>

            {/* Liked Post */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <Checkbox
                id="likedPost"
                checked={formData.likedPost}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, likedPost: checked === true })
                }
                className={errors.likedPost ? 'border-red-500' : ''}
              />
              <Label htmlFor="likedPost" className="flex-1 cursor-pointer">
                <span className="font-medium">I have liked the Instagram post</span>
                {errors.likedPost && (
                  <p className="text-red-500 text-sm mt-1">{errors.likedPost}</p>
                )}
              </Label>
            </div>

            {/* Shared Post */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <Checkbox
                id="sharedPost"
                checked={formData.sharedPost}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, sharedPost: checked === true })
                }
                className={errors.sharedPost ? 'border-red-500' : ''}
              />
              <Label htmlFor="sharedPost" className="flex-1 cursor-pointer">
                <span className="font-medium">I have shared the Instagram post</span>
                {errors.sharedPost && (
                  <p className="text-red-500 text-sm mt-1">{errors.sharedPost}</p>
                )}
              </Label>
            </div>

            {/* Tagged Friend */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <Checkbox
                id="taggedFriend"
                checked={formData.taggedFriend}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, taggedFriend: checked === true })
                }
                className={errors.taggedFriend ? 'border-red-500' : ''}
              />
              <Label htmlFor="taggedFriend" className="flex-1 cursor-pointer">
                <span className="font-medium">I have tagged a friend in the Instagram post comments</span>
                {errors.taggedFriend && (
                  <p className="text-red-500 text-sm mt-1">{errors.taggedFriend}</p>
                )}
              </Label>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            size="lg"
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-6 text-lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Enter Giveaway
                <Zap className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>

          {/* Disclaimer */}
          <p className="text-xs text-gray-500 text-center mt-6">
            By entering, you agree to our terms and confirm you are 18+. Your entry will be manually verified.
          </p>
        </motion.form>

        {/* Benefits */}
        <motion.div
          className="grid md:grid-cols-3 gap-6 mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="text-center p-6 bg-white rounded-xl shadow-lg border border-orange-100">
            <Trophy className="w-12 h-12 mx-auto mb-3 text-yellow-500" />
            <h3 className="font-bold text-gray-900 mb-2">Win Prizes</h3>
            <p className="text-sm text-gray-600">$2,500+ in transformation prizes</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-lg border border-orange-100">
            <Zap className="w-12 h-12 mx-auto mb-3 text-orange-500" />
            <h3 className="font-bold text-gray-900 mb-2">Stay Connected</h3>
            <p className="text-sm text-gray-600">Weekly newsletter with transformation insights</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-lg border border-orange-100">
            <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
            <h3 className="font-bold text-gray-900 mb-2">Free Entry</h3>
            <p className="text-sm text-gray-600">No purchase required to enter</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
