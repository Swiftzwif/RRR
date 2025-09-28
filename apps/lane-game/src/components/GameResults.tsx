'use client';

import { useGameStore } from '@/lib/game-store';
import { laneGameQuestions } from '@trajectory/content';
import { calculateBadges, calculateConfidence, classifyLane, type LaneResult } from '@trajectory/lib';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@trajectory/ui';
import { RotateCcw, Share2, Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function GameResults() {
  const router = useRouter();
  const {
    sessionId,
    answers,
    events,
    timeouts,
    answerChanges,
    results,
    resetGame,
  } = useGameStore();

  const [laneResult, setLaneResult] = useState<LaneResult | null>(null);
  const [badges, setBadges] = useState<string[]>([]);
  const [confidence, setConfidence] = useState(0);

  useEffect(() => {
    if (!sessionId || Object.keys(answers).length === 0) {
      router.push('/');
      return;
    }

    // Calculate category scores
    const categoryScores = {
      financial_mindset: 0,
      time_freedom: 0,
      risk_opportunity: 0,
      systems_scalability: 0,
    };

    let categoryCounts = { ...categoryScores };

    // Calculate scores from answers
    Object.entries(answers).forEach(([questionId, answer]) => {
      const question = [...laneGameQuestions.questions, ...laneGameQuestions.validationQuestions]
        .find(q => q.id === questionId);
      
      if (question && question.category in categoryScores) {
        categoryScores[question.category as keyof typeof categoryScores] += answer;
        categoryCounts[question.category as keyof typeof categoryCounts] += 1;
      }
    });

    // Average the scores
    Object.keys(categoryScores).forEach(category => {
      const count = categoryCounts[category as keyof typeof categoryCounts];
      if (count > 0) {
        categoryScores[category as keyof typeof categoryScores] /= count;
      }
    });

    // Classify lane
    const result = classifyLane(categoryScores);
    setLaneResult(result);

    // Calculate confidence
    const validationConsistency = 0.8; // Simplified for now
    const confidenceScore = calculateConfidence({
      avgAnswerTime: events.reduce((sum, e) => sum + e.durationMs, 0) / events.length,
      answerChanges,
      timeouts,
      validationConsistency,
    });
    setConfidence(confidenceScore);

    // Calculate badges
    const sessionData = {
      id: sessionId,
      completedAt: new Date().toISOString(),
      questionOrder: [],
      consistencyScore: validationConsistency,
      avgAnswerMs: events.reduce((sum, e) => sum + e.durationMs, 0) / events.length,
      timeouts,
      version: '1.0',
    };
    
    const earnedBadges = calculateBadges(sessionData, events, validationConsistency);
    setBadges(earnedBadges);
  }, [sessionId, answers, events, timeouts, answerChanges, router]);

  const handleShare = async () => {
    const shareData = {
      title: 'Lane Diagnostic Results',
      text: `I just discovered I'm in the ${laneResult?.lane} lane! Take the assessment to find your financial lane.`,
      url: window.location.origin,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback to copying to clipboard
      await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      alert('Results copied to clipboard!');
    }
  };

  const handleRetake = () => {
    resetGame();
    router.push('/');
  };

  if (!laneResult) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-400 mx-auto mb-4"></div>
          <p className="text-sky-600">Calculating your results...</p>
        </div>
      </div>
    );
  }

  const laneInfo = laneGameQuestions.metadata.laneDescriptions[laneResult.lane];

  return (
    <div className="min-h-screen bg-sky-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 strata-text">
            Assessment Complete
          </h1>
          <p className="text-xl text-sky-600">
            Your financial lane has been revealed
          </p>
        </div>

        {/* Lane Result */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-sky-600">
              {laneInfo.name}
            </CardTitle>
            <p className="text-lg text-sky-500">
              {laneInfo.description}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Key Characteristics:</h3>
              <ul className="space-y-2">
                {laneInfo.characteristics.map((characteristic, index) => (
                  <li key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-sky-400 rounded-full mr-3"></div>
                    {characteristic}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Confidence Score */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Assessment Confidence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-sky-600 mb-2">
                {confidence}%
              </div>
              <p className="text-sky-500">
                {confidence >= 80 
                  ? "High confidence - your results are reliable"
                  : confidence >= 60
                  ? "Moderate confidence - consider retaking for more accuracy"
                  : "Low confidence - please retake the assessment"
                }
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Badges */}
        {badges.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="w-6 h-6 mr-2 text-sunset" />
                Achievements Earned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {badges.map((badgeCode) => {
                  const badge = laneGameQuestions.metadata.badges[badgeCode];
                  return (
                    <div key={badgeCode} className="flex items-center p-4 bg-sky-50 rounded-lg">
                      <Trophy className="w-8 h-8 text-sunset mr-4" />
                      <div>
                        <h4 className="font-semibold">{badge.name}</h4>
                        <p className="text-sm text-sky-600">{badge.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Next Steps */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {laneResult.nextSteps.map((step, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-8 h-8 bg-sky-400 text-white rounded-full flex items-center justify-center font-semibold mr-4 flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-sky-700">{step}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleShare}
            variant="outline"
            size="lg"
            className="flex items-center"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Share Results
          </Button>
          
          <Button
            onClick={handleRetake}
            variant="secondary"
            size="lg"
            className="flex items-center"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Retake Assessment
          </Button>
        </div>
      </div>
    </div>
  );
}
