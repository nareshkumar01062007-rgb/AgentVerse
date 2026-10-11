export type AgentId = 
  | 'simple-reflex'
  | 'model-based'
  | 'goal-based'
  | 'utility-based'
  | 'learning';

export interface AgentPercept {
  name: string;
  description: string;
}

export interface AgentActuator {
  name: string;
  description: string;
}

export interface FlowStep {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  gameConnection: string;
}

export interface CodeLineExplanation {
  lineNumber: number;
  code: string;
  explanation: string;
  gameAction: string;
  variableState?: Record<string, string | number | boolean>;
}

export interface CodeMapping {
  codeSnippet: string;
  whatItDoes: string;
  gameEvent: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface AgentTheme {
  primary: string; // e.g. '#22D3EE'
  bgBadge: string;
  borderAccent: string;
  textAccent: string;
  gradient: string;
  glow: string;
}

export interface AgentData {
  id: AgentId;
  number: number;
  name: string;
  tagline: string;
  gameName: string;
  category: string;
  theme: AgentTheme;
  definition: string;
  poaiConcept: string;
  environment: string;
  sensors: string[];
  actuators: string[];
  limitations: string;
  realWorldExample: string;
  whatPlayerWillDo: string;
  winCondition: string;
  controlsExplanation: string[];
  pythonCode: string;
  pythonRunResult: string;
  flowSteps: FlowStep[];
  codeLines: CodeLineExplanation[];
  mapping: CodeMapping[];
  quiz: QuizQuestion[];
}

export interface UserProgress {
  completedGames: AgentId[];
  quizzesPassed: AgentId[];
  quizScores: Record<AgentId, number>;
  starsCount: number;
  lastPlayed?: AgentId;
}
