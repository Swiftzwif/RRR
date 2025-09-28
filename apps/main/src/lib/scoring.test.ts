import { describe, it, expect } from 'vitest';
import {
  computeDomainAverages,
  overallAverage,
  avatarFromOverall,
  lowestTwoDomains,
  labelForScore,
  type Domain
} from './scoring';

describe('scoring', () => {
  const mockQMap: Record<string, Domain> = {
    'q1': 'identity',
    'q2': 'identity',
    'q3': 'health',
    'q4': 'health',
    'q5': 'finances',
    'q6': 'finances',
    'q7': 'relationships',
    'q8': 'relationships',
    'q9': 'emotions',
    'q10': 'emotions',
    'q11': 'focus',
    'q12': 'focus'
  };

  describe('avatarFromOverall', () => {
    it('should return Drifter for low scores (≈2.2 avg)', () => {
      expect(avatarFromOverall(2.2)).toBe('Drifter');
      expect(avatarFromOverall(3.1)).toBe('Drifter');
    });

    it('should return Balancer for mid scores (≈3.6 avg)', () => {
      expect(avatarFromOverall(3.6)).toBe('Balancer');
      expect(avatarFromOverall(4.1)).toBe('Balancer');
    });

    it('should return Architect for high scores (≈4.6 avg)', () => {
      expect(avatarFromOverall(4.6)).toBe('Architect');
      expect(avatarFromOverall(5.0)).toBe('Architect');
    });
  });

  describe('labelForScore', () => {
    it('should return Unacceptable for scores ≤ 3.1', () => {
      expect(labelForScore(1.0)).toBe('Unacceptable');
      expect(labelForScore(3.1)).toBe('Unacceptable');
    });

    it('should return Acceptable for scores 3.2-4.1', () => {
      expect(labelForScore(3.2)).toBe('Acceptable');
      expect(labelForScore(4.1)).toBe('Acceptable');
    });

    it('should return Desirable for scores ≥ 4.2', () => {
      expect(labelForScore(4.2)).toBe('Desirable');
      expect(labelForScore(5.0)).toBe('Desirable');
    });
  });

  describe('lowestTwoDomains', () => {
    it('should return lowest two domains with tie-break order', () => {
      const domainAverages = {
        identity: 4.0,
        health: 2.0,
        finances: 2.0,
        relationships: 3.0,
        emotions: 4.0,
        focus: 3.0
      };

      const result = lowestTwoDomains(domainAverages);
      // Both health and finances have 2.0, but health comes first in tie-break order
      expect(result).toEqual(['health', 'finances']);
    });

    it('should handle all different scores', () => {
      const domainAverages = {
        identity: 4.0,
        health: 1.0,
        finances: 2.0,
        relationships: 3.0,
        emotions: 5.0,
        focus: 4.5
      };

      const result = lowestTwoDomains(domainAverages);
      expect(result).toEqual(['health', 'finances']);
    });
  });

  describe('computeDomainAverages', () => {
    it('should compute correct averages per domain', () => {
      const answers = {
        'q1': 4, 'q2': 2, // identity: avg = 3
        'q3': 5, 'q4': 1, // health: avg = 3
        'q5': 3, 'q6': 3, // finances: avg = 3
        'q7': 2, 'q8': 4, // relationships: avg = 3
        'q9': 1, 'q10': 5, // emotions: avg = 3
        'q11': 3, 'q12': 3 // focus: avg = 3
      };

      const result = computeDomainAverages(answers, mockQMap);
      expect(result.identity).toBe(3);
      expect(result.health).toBe(3);
      expect(result.finances).toBe(3);
      expect(result.relationships).toBe(3);
      expect(result.emotions).toBe(3);
      expect(result.focus).toBe(3);
    });
  });

  describe('overallAverage', () => {
    it('should compute overall average correctly', () => {
      const domainAverages = {
        identity: 3.0,
        health: 4.0,
        finances: 2.0,
        relationships: 5.0,
        emotions: 3.0,
        focus: 4.0
      };

      const result = overallAverage(domainAverages);
      expect(result).toBe(3.5);
    });
  });
});

