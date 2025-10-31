"use client";

import AvatarBadge from "@/components/AvatarBadge";
import Meter from "@/components/Meter";
import ResultCard from "@/components/ResultCard";
import { getCopy } from "@/lib/copy";
import { Domain, getSuggestedActions } from "@/lib/scoring";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface AssessmentResults {
  domainScores: Record<Domain, number>;
  overall: number;
  avatar: "Drifter" | "Balancer" | "Architect";
  lowestTwoDomains: [Domain, Domain];
  assessmentId?: string;
}

export default function ResultsPage() {
  const [results, setResults] = useState<AssessmentResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadResults = async () => {
      try {
        // Check if user is authenticated
        const {
          data: { user },
        } = await supabase!.auth.getUser();

        if (!user) {
          // Check session storage for results
          const storedResults = sessionStorage.getItem("assessmentResults");
          if (storedResults) {
            setResults(JSON.parse(storedResults));
            setShowEmailCapture(true);
          } else {
            router.push("/assessment");
            return;
          }
        } else {
          // User is authenticated, try to get latest assessment
          const { data: assessment } = await supabase!
            .from("assessments")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

          if (assessment) {
            setResults({
              domainScores: assessment.domain_scores,
              overall: assessment.score,
              avatar: assessment.avatar,
              lowestTwoDomains: getLowestTwoDomains(assessment.domain_scores),
              assessmentId: assessment.id,
            });
          } else {
            router.push("/assessment");
            return;
          }
        }
      } catch (error) {
        console.error("Error loading results:", error);
        router.push("/assessment");
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [router]);

  const getLowestTwoDomains = (
    domainScores: Record<Domain, number>
  ): [Domain, Domain] => {
    const sorted = Object.entries(domainScores).sort((a, b) => a[1] - b[1]);
    return [sorted[0][0] as Domain, sorted[1][0] as Domain];
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !results) return;

    setIsSubmittingEmail(true);
    try {
      // Update assessment with email
      if (results.assessmentId) {
        await supabase!
          .from("assessments")
          .update({ email })
          .eq("id", results.assessmentId);
      }

      // Send assessment complete email with 7-day experience
      await fetch("/api/notify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          topic: "assessment",
          metadata: {
            avatar: results.avatar,
            overallScore: results.overall,
            lowestDomains: results.lowestTwoDomains,
          },
        }),
      });

      setShowEmailCapture(false);
    } catch (error) {
      console.error("Error saving email:", error);
    } finally {
      setIsSubmittingEmail(false);
    }
  };

  const handlePurchase = async (product: "course" | "coaching") => {
    try {
      setEmailLoading(true);

      // Create payment link via Square API
      const response = await fetch("/api/payments/square/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product,
          email: email || undefined,
          redirectUrl: window.location.href,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create payment link");
      }

      // Redirect to Square checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Unable to process payment. Please try again later.");
    } finally {
      setEmailLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-slate-600 text-lg">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-white text-2xl">📊</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-800 mb-4">
            No Results Found
          </h1>
          <p className="text-slate-600 mb-8">
            It looks like you haven&apos;t completed the assessment yet.
          </p>
          <button
            onClick={() => router.push("/assessment")}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 hover:scale-105 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
          >
            Take Assessment
          </button>
        </div>
      </div>
    );
  }

  const suggestedActions = getSuggestedActions(results.lowestTwoDomains);
  const domainLabels = getCopy("results.domains") as Record<Domain, string>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Email Capture Modal */}
        {showEmailCapture && (
          <div className="fixed inset-0 bg-slate-800/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div
              className="bg-white p-10 max-w-md w-full rounded-2xl border border-slate-200 shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">📧</span>
                </div>
                <h2 className="text-2xl font-display font-bold text-slate-800 mb-2">
                  Get Your Results
                </h2>
                <p className="text-slate-600">
                  Enter your email to view your detailed assessment results and
                  get personalized recommendations.
                </p>
              </div>
              <form onSubmit={handleEmailSubmit}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <button
                  type="submit"
                  disabled={!email || isSubmittingEmail}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmittingEmail ? "Saving..." : "View Results"}
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-sm font-semibold mb-6 shadow-lg">
            <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
            YOUR RESULTS
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-6">
            {getCopy("results.title") as string}
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">{getCopy("results.subtitle") as string}</p>
        </motion.div>

        {/* Avatar Section */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <AvatarBadge avatar={results.avatar} size="lg" />
        </motion.div>

        {/* Domain Scores */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-3xl font-display font-bold text-slate-800 mb-12 text-center">
            {getCopy("results.domains.title") as string}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.entries(results.domainScores).map(([domain, score]) => (
              <Meter
                key={domain}
                value={score}
                label={domainLabels[domain as Domain] || domain}
                className="mb-6"
              />
            ))}
          </div>
        </motion.div>

        {/* Suggested Actions */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-3xl font-display font-bold text-slate-800 mb-12 text-center">
            {getCopy("results.actions.title") as string}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ResultCard
              domain={results.lowestTwoDomains[0]}
              score={results.domainScores[results.lowestTwoDomains[0]]}
              actions={suggestedActions.sevenDay}
            />
            <ResultCard
              domain={results.lowestTwoDomains[1]}
              score={results.domainScores[results.lowestTwoDomains[1]]}
              actions={suggestedActions.thirtyDay}
            />
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-10 text-center rounded-3xl border border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-2xl">📚</span>
            </div>
            <h3 className="text-2xl font-display font-bold text-slate-800 mb-4">
              {getCopy("results.cta.course.title") as string}
            </h3>
            <p className="text-slate-600 mb-6 leading-relaxed">
              {getCopy("results.cta.course.description") as string}
            </p>
            <div className="text-4xl font-bold text-blue-600 mb-6">
              {getCopy("results.cta.course.price") as string}
            </div>
            <button
              onClick={() => handlePurchase("course")}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Get Instant Access
            </button>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-red-50 p-10 text-center rounded-3xl border border-orange-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-2xl">🎯</span>
            </div>
            <h3 className="text-2xl font-display font-bold text-slate-800 mb-4">
              {getCopy("results.cta.coaching.title") as string}
            </h3>
            <p className="text-slate-600 mb-6 leading-relaxed">
              {getCopy("results.cta.coaching.description") as string}
            </p>
            <div className="text-4xl font-bold text-orange-600 mb-6">
              {getCopy("results.cta.coaching.price") as string}
            </div>
            <button
              onClick={() => handlePurchase("coaching")}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Start Coaching
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
