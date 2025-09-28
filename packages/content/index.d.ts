export interface Question {
  id: string;
  category: string;
  prompt: string;
  type: string;
  options: Array<{ value: number; text: string }>;
}

export interface GameMetadata {
  title: string;
  description: string;
  lanes: string[];
  categories: string[];
  scale: {
    min: number;
    max: number;
    labels: Record<string, string>;
  };
  gameSettings: {
    timerSeconds: number;
    totalQuestions: number;
    validationQuestions: number;
    milestoneThresholds: number[];
    microInsightInterval: number;
  };
  milestoneMessages: Record<string, string>;
  microInsights: Record<string, { high: string; low: string }>;
  badges: Record<string, { name: string; description: string; condition: string }>;
}

export interface ContentData {
  metadata: GameMetadata;
  questions: Question[];
  validationQuestions: Question[];
}

export declare const laneDiagnosticQuestions: ContentData;
export declare const laneGameQuestions: ContentData;
