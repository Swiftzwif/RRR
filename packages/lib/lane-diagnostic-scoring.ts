export type Lane = 'sidewalk' | 'slowlane' | 'fastlane';
export type Category = 'financial_mindset' | 'time_freedom' | 'risk_opportunity' | 'systems_scalability';

export interface LaneDiagnosticResult {
  lane: Lane;
  confidence: number;
  categoryScores: Record<Category, number>;
  overall: number;
  subLane?: string;
  growthPotential: 'low' | 'medium' | 'high';
  nextSteps: string[];
  laneDescription: {
    name: string;
    description: string;
    characteristics: string[];
  };
}

// Lane classification thresholds
const LANE_THRESHOLDS = {
  sidewalk: { min: 1, max: 2.4 },
  slowlane: { min: 2.5, max: 3.4 },
  fastlane: { min: 3.5, max: 5 }
};

// Category weights for lane determination
const CATEGORY_WEIGHTS: Record<Category, number> = {
  financial_mindset: 0.3,
  time_freedom: 0.25,
  risk_opportunity: 0.25,
  systems_scalability: 0.2
};

export function scoreLaneDiagnostic(answers: Record<string, number>): LaneDiagnosticResult {
  const categoryScores = computeCategoryAverages(answers);
  const overall = computeOverallScore(categoryScores);
  const lane = determineLane(overall, categoryScores);
  const confidence = calculateConfidence(overall, categoryScores);
  const growthPotential = assessGrowthPotential(categoryScores, lane);
  const nextSteps = generateNextSteps(lane, categoryScores);
  
  return {
    lane,
    confidence,
    categoryScores,
    overall: Number(overall.toFixed(2)),
    growthPotential,
    nextSteps,
    laneDescription: getLaneDescription(lane)
  };
}

function computeCategoryAverages(answers: Record<string, number>): Record<Category, number> {
  // Map question IDs to categories
  const questionMap: Record<string, Category> = {
    'LD1': 'financial_mindset', 'LD2': 'financial_mindset', 'LD3': 'financial_mindset', 
    'LD4': 'financial_mindset', 'LD5': 'financial_mindset',
    'LD6': 'time_freedom', 'LD7': 'time_freedom', 'LD8': 'time_freedom', 'LD9': 'time_freedom',
    'LD10': 'risk_opportunity', 'LD11': 'risk_opportunity', 'LD12': 'risk_opportunity', 'LD13': 'risk_opportunity',
    'LD14': 'systems_scalability', 'LD15': 'systems_scalability', 'LD16': 'systems_scalability', 
    'LD17': 'systems_scalability', 'LD18': 'systems_scalability'
  };

  const byCategory: Record<Category, number[]> = {
    financial_mindset: [],
    time_freedom: [],
    risk_opportunity: [],
    systems_scalability: []
  };

  for (const [qid, val] of Object.entries(answers)) {
    const category = questionMap[qid];
    if (category) byCategory[category].push(val);
  }

  return Object.fromEntries(
    Object.entries(byCategory).map(([category, values]) => [
      category, 
      values.length ? Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(2)) : 0
    ])
  ) as Record<Category, number>;
}

function computeOverallScore(categoryScores: Record<Category, number>): number {
  let weightedSum = 0;
  let totalWeight = 0;

  for (const [category, score] of Object.entries(categoryScores)) {
    const weight = CATEGORY_WEIGHTS[category as Category];
    weightedSum += score * weight;
    totalWeight += weight;
  }

  return totalWeight > 0 ? weightedSum / totalWeight : 0;
}

function determineLane(overall: number, categoryScores: Record<Category, number>): Lane {
  // Check if any category strongly indicates a different lane
  const financialScore = categoryScores.financial_mindset;
  const systemsScore = categoryScores.systems_scalability;
  
  // If financial mindset is very low (sidewalk) but overall is higher, still classify as sidewalk
  if (financialScore <= 2.0) {
    return 'sidewalk';
  }
  
  // If systems thinking is very high, likely fastlane regardless of overall
  if (systemsScore >= 4.0 && categoryScores.risk_opportunity >= 3.5) {
    return 'fastlane';
  }
  
  // Standard lane determination based on overall score
  if (overall <= LANE_THRESHOLDS.sidewalk.max) {
    return 'sidewalk';
  } else if (overall <= LANE_THRESHOLDS.slowlane.max) {
    return 'slowlane';
  } else {
    return 'fastlane';
  }
}

function calculateConfidence(overall: number, categoryScores: Record<Category, number>): number {
  // Calculate variance in category scores
  const scores = Object.values(categoryScores);
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
  const standardDeviation = Math.sqrt(variance);
  
  // Lower variance = higher confidence
  const consistencyScore = Math.max(0, 1 - (standardDeviation / 2));
  
  // Distance from lane boundaries affects confidence
  let boundaryDistance = 1;
  if (overall <= LANE_THRESHOLDS.sidewalk.max) {
    boundaryDistance = Math.abs(overall - LANE_THRESHOLDS.sidewalk.max);
  } else if (overall <= LANE_THRESHOLDS.slowlane.max) {
    boundaryDistance = Math.min(
      Math.abs(overall - LANE_THRESHOLDS.sidewalk.max),
      Math.abs(overall - LANE_THRESHOLDS.slowlane.max)
    );
  } else {
    boundaryDistance = Math.abs(overall - LANE_THRESHOLDS.slowlane.max);
  }
  
  const boundaryScore = Math.min(1, boundaryDistance * 2);
  
  return Number(((consistencyScore + boundaryScore) / 2).toFixed(2));
}

function assessGrowthPotential(categoryScores: Record<Category, number>, lane: Lane): 'low' | 'medium' | 'high' {
  const riskScore = categoryScores.risk_opportunity;
  const systemsScore = categoryScores.systems_scalability;
  const timeScore = categoryScores.time_freedom;
  
  // High growth potential indicators
  if (riskScore >= 4.0 && systemsScore >= 3.5) {
    return 'high';
  }
  
  // Medium growth potential
  if (riskScore >= 3.0 || systemsScore >= 3.0 || timeScore >= 3.5) {
    return 'medium';
  }
  
  return 'low';
}

function generateNextSteps(lane: Lane, categoryScores: Record<Category, number>): string[] {
  const steps: string[] = [];
  
  switch (lane) {
    case 'sidewalk':
      steps.push(
        "Create a basic budget and track all expenses",
        "Build a $1,000 emergency fund",
        "Stop using credit cards for non-essentials",
        "Read 'The Millionaire Fastlane' by MJ DeMarco"
      );
      break;
      
    case 'slowlane':
      steps.push(
        "Increase your savings rate to 20% of income",
        "Start investing in index funds or ETFs",
        "Consider starting a side business",
        "Learn about business and entrepreneurship"
      );
      break;
      
    case 'fastlane':
      steps.push(
        "Focus on building systems and assets",
        "Look for opportunities to create leverage",
        "Consider scaling your current business",
        "Mentor others who want to enter the fastlane"
      );
      break;
  }
  
  // Add specific steps based on lowest category scores
  const sortedCategories = Object.entries(categoryScores)
    .sort(([,a], [,b]) => a - b)
    .map(([category]) => category as Category);
  
  const lowestCategory = sortedCategories[0];
  
  switch (lowestCategory) {
    case 'financial_mindset':
      steps.push("Read books on financial literacy and wealth building");
      break;
    case 'time_freedom':
      steps.push("Define what financial freedom means to you");
      break;
    case 'risk_opportunity':
      steps.push("Start taking small calculated risks");
      break;
    case 'systems_scalability':
      steps.push("Learn about business systems and automation");
      break;
  }
  
  return steps.slice(0, 5); // Return top 5 steps
}

function getLaneDescription(lane: Lane) {
  const descriptions = {
    sidewalk: {
      name: "Sidewalk Lane",
      description: "You're living in the moment, but the moment is costing you your future. You're focused on consumption rather than creation, and your financial habits are keeping you trapped in a cycle of dependency.",
      characteristics: [
        "Spends more than earns",
        "No emergency fund",
        "Consumer-focused mindset", 
        "No long-term financial plan",
        "Lives paycheck to paycheck"
      ]
    },
    slowlane: {
      name: "Slowlane",
      description: "You're building wealth, but you're trading time for money at a 1:1 ratio. You understand the importance of saving and investing, but you're still dependent on your job for income.",
      characteristics: [
        "Trades time for money",
        "Linear income growth",
        "Traditional retirement planning",
        "Security over growth",
        "Dependent on employment"
      ]
    },
    fastlane: {
      name: "Fastlane",
      description: "You understand systems, leverage, and exponential growth. You're building assets and creating multiple income streams, but you might be missing the community and support to accelerate your journey.",
      characteristics: [
        "Builds systems and assets",
        "Exponential income potential",
        "Leverage and multiplication",
        "Freedom and control",
        "Multiple income streams"
      ]
    }
  };
  
  return descriptions[lane];
}

// Helper function to get lane transition roadmap
export function getLaneTransitionRoadmap(currentLane: Lane, targetLane: Lane): string[] {
  if (currentLane === targetLane) {
    return ["You're already in your target lane! Focus on optimization and growth."];
  }
  
  const roadmaps: Record<string, string[]> = {
    'sidewalk-slowlane': [
      "Create and stick to a budget",
      "Build a $1,000 emergency fund",
      "Start saving 10% of your income",
      "Learn about compound interest",
      "Begin investing in index funds"
    ],
    'sidewalk-fastlane': [
      "Read 'The Millionaire Fastlane' by MJ DeMarco",
      "Identify a skill you can monetize",
      "Start a small side business",
      "Learn about business systems",
      "Find a mentor in your target industry"
    ],
    'slowlane-fastlane': [
      "Start a side business while keeping your job",
      "Learn about leverage and systems",
      "Build multiple income streams",
      "Invest in business education",
      "Network with other entrepreneurs"
    ]
  };
  
  const key = `${currentLane}-${targetLane}`;
  return roadmaps[key] || ["Focus on improving your current lane before transitioning."];
}
