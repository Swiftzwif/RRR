import tokens from '../../design/tokens.json';

export type DesignTokens = typeof tokens;

export const designTokens = tokens as DesignTokens;

// Helper functions for accessing tokens
export const getColor = (path: string) => {
  const keys = path.split('.');
  let value: any = designTokens.colors;
  
  for (const key of keys) {
    value = value?.[key];
    if (value === undefined) return undefined;
  }
  
  return value;
};

export const getSpacing = (size: keyof typeof designTokens.spacing) => {
  return designTokens.spacing[size];
};

export const getFontSize = (size: keyof typeof designTokens.typography.fontSize) => {
  return designTokens.typography.fontSize[size];
};

export const getDomainLabel = (domain: string, level: 'low' | 'mid' | 'high') => {
  return designTokens.gamification.domains[domain as keyof typeof designTokens.gamification.domains]?.[level];
};

export const getLevelThreshold = (level: 'low' | 'mid') => {
  return designTokens.gamification.thresholds[level];
};

// Gamification helpers
export const calculateLevel = (score: number): 'low' | 'mid' | 'high' => {
  if (score < designTokens.gamification.thresholds.low) return 'low';
  if (score < designTokens.gamification.thresholds.mid) return 'mid';
  return 'high';
};

export const getNextMilestone = (domain: string, currentLevel: 'low' | 'mid' | 'high') => {
  const labels = designTokens.gamification.domains[domain as keyof typeof designTokens.gamification.domains];
  
  switch (currentLevel) {
    case 'low':
      return `2 strong choices to ${labels?.mid}`;
    case 'mid':
      return `3 strong choices to ${labels?.high}`;
    case 'high':
      return 'Maintain excellence';
    default:
      return '';
  }
};

export const getChoicesToNext = (currentScore: number, currentLevel: 'low' | 'mid' | 'high') => {
  const thresholds = designTokens.gamification.thresholds;
  
  switch (currentLevel) {
    case 'low':
      const gapToMid = thresholds.low - currentScore;
      return Math.ceil(gapToMid / 6); // 6% per strong choice
    case 'mid':
      const gapToHigh = thresholds.mid - currentScore;
      return Math.ceil(gapToHigh / 6);
    case 'high':
      return 0;
    default:
      return 0;
  }
};

export default designTokens;
