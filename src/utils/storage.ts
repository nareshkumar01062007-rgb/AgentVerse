import { AgentId, UserProgress } from '../types/agent';

const STORAGE_KEY = 'agentverse_progress_v1';

const defaultProgress: UserProgress = {
  completedGames: [],
  quizzesPassed: [],
  quizScores: {
    'simple-reflex': 0,
    'model-based': 0,
    'goal-based': 0,
    'utility-based': 0,
    'learning': 0,
  },
  starsCount: 0,
};

export function getProgress(): UserProgress {
  if (typeof window === 'undefined') return defaultProgress;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress;
    return { ...defaultProgress, ...JSON.parse(raw) };
  } catch {
    return defaultProgress;
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save progress to localStorage', e);
  }
}

export function markGameCompleted(agentId: AgentId): UserProgress {
  const current = getProgress();
  const completed = new Set(current.completedGames);
  const wasCompleted = completed.has(agentId);
  completed.add(agentId);

  const updated: UserProgress = {
    ...current,
    completedGames: Array.from(completed),
    starsCount: wasCompleted ? current.starsCount : current.starsCount + 1,
    lastPlayed: agentId,
  };
  saveProgress(updated);
  return updated;
}

export function markQuizCompleted(agentId: AgentId, score: number): UserProgress {
  const current = getProgress();
  const passed = new Set(current.quizzesPassed);
  const wasPassed = passed.has(agentId);
  if (score >= 2) {
    passed.add(agentId);
  }

  const updated: UserProgress = {
    ...current,
    quizzesPassed: Array.from(passed),
    quizScores: {
      ...current.quizScores,
      [agentId]: Math.max(current.quizScores[agentId] || 0, score),
    },
    starsCount: !wasPassed && score >= 2 ? current.starsCount + 1 : current.starsCount,
  };
  saveProgress(updated);
  return updated;
}

export function resetProgress(): UserProgress {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
  return defaultProgress;
}
