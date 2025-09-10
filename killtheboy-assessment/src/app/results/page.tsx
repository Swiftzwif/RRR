"use client";

import AvatarBadge from "@/components/AvatarBadge";
import Meter from "@/components/Meter";
import ResultCard from "@/components/ResultCard";
import StrataDivider from "@/components/StrataDivider";
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
        } = await supabase.auth.getUser();

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
          const { data: assessment } = await supabase
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
        await supabase
          .from("assessments")
          .update({ email })
          .eq("id", results.assessmentId);
      }

      setShowEmailCapture(false);
    } catch (error) {
      console.error("Error saving email:", error);
    } finally {
      setIsSubmittingEmail(false);
    }
  };

  const handlePurchase = async (product: "course" | "coaching") => {
    // TBD: Stripe integration coming soon
    alert(`Payment integration for ${product} is coming soon! Stay tuned.`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sky-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sky-600">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sky-50">
        <div className="text-center max-w-md mx-auto px-6">
          <h1 className="text-2xl font-display font-bold text-sky-800 mb-4">
            No Results Found
          </h1>
          <p className="text-sky-600 mb-6">
            It looks like you haven't completed the assessment yet.
          </p>
          <button
            onClick={() => router.push("/assessment")}
            className="strata-button"
          >
            Take Assessment
          </button>
        </div>
      </div>
    );
  }

  const suggestedActions = getSuggestedActions(results.lowestTwoDomains);
  const domainLabels = getCopy("results.domains") as any;

  return (
    <div className="min-h-screen bg-sky-50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Email Capture Modal */}
        {showEmailCapture && (
          <div className="fixed inset-0 bg-sky-800/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div
              className="bg-white p-8 max-w-md w-full rounded-lg border border-sky-200 shadow-sm"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <h2 className="text-2xl font-display font-bold text-sky-800 mb-4">
                Get Your Results
              </h2>
              <p className="text-sky-600 mb-6">
                Enter your email to view your detailed assessment results and
                get personalized recommendations.
              </p>
              <form onSubmit={handleEmailSubmit}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="strata-input w-full mb-4"
                  required
                />
                <button
                  type="submit"
                  disabled={!email || isSubmittingEmail}
                  className="strata-button w-full"
                >
                  {isSubmittingEmail ? "Saving..." : "View Results"}
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold text-sky-800 mb-4">
            {getCopy("results.title")}
          </h1>
          <p className="text-lg text-sky-600">{getCopy("results.subtitle")}</p>
        </motion.div>

        {/* Avatar Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <AvatarBadge avatar={results.avatar} size="lg" />
        </motion.div>

        <StrataDivider />

        {/* Domain Scores */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-2xl font-display font-bold text-sky-800 mb-8 text-center">
            {getCopy("results.domains.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(results.domainScores).map(([domain, score]) => (
              <Meter
                key={domain}
                value={score}
                label={domainLabels[domain as Domain] || domain}
                className="mb-4"
              />
            ))}
          </div>
        </motion.div>

        <StrataDivider />

        {/* Suggested Actions */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-2xl font-display font-bold text-sky-800 mb-8 text-center">
            {getCopy("results.actions.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        <StrataDivider />

        {/* CTAs */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="bg-white p-8 text-center rounded-lg border border-sky-200 shadow-sm">
            <h3 className="text-xl font-display font-bold text-sky-800 mb-4">
              {getCopy("results.cta.course.title")}
            </h3>
            <p className="text-sky-600 mb-6">
              {getCopy("results.cta.course.description")}
            </p>
            <div className="text-3xl font-bold text-sky-500 mb-6">
              {getCopy("results.cta.course.price")}
            </div>
            <button
              onClick={() => handlePurchase("course")}
              className="strata-button w-full opacity-75 cursor-not-allowed"
              disabled
            >
              Coming Soon
            </button>
          </div>

          <div className="bg-white p-8 text-center rounded-lg border border-sky-200 shadow-sm">
            <h3 className="text-xl font-display font-bold text-sky-800 mb-4">
              {getCopy("results.cta.coaching.title")}
            </h3>
            <p className="text-sky-600 mb-6">
              {getCopy("results.cta.coaching.description")}
            </p>
            <div className="text-3xl font-bold text-sky-500 mb-6">
              {getCopy("results.cta.coaching.price")}
            </div>
            <button
              onClick={() => handlePurchase("coaching")}
              className="strata-button w-full opacity-75 cursor-not-allowed"
              disabled
            >
              Coming Soon
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
