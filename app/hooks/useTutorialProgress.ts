import { useState, useEffect } from "react";

interface TutorialProgress {
  started: boolean;
  completed: boolean;
  stepsCompleted: string[]; // array of step IDs
}

interface ProgressData {
  tutorials: Record<string, TutorialProgress>;
}

interface TutorialProgressApi {
  progress: ProgressData;
  startTutorial: (id: string) => void;
  completeStep: (id: string, stepId: string) => void;
  completeTutorial: (id: string) => void;
  getTutorialStatus: (id: string) => TutorialProgress;
  getOverallStats: () => {
    totalTutorials: number;
    startedTutorials: number;
    completedTutorials: number;
    completedSteps: number;
  };
  resetProgress: () => void;
}

interface TutorialInstanceApi {
  progress: TutorialProgress;
  markStepCompleted: (stepId: string) => void;
  isStepCompleted: (stepId: string) => boolean;
  isTutorialCompleted: boolean;
  startTutorial: () => void;
  completeTutorial: () => void;
}

const STORAGE_KEY = "vizualni-admin-tutorial-progress";

const defaultProgress: ProgressData = {
  tutorials: {},
};

export function useTutorialProgress(): TutorialProgressApi;
export function useTutorialProgress(tutorialId: string): TutorialInstanceApi;
export function useTutorialProgress(tutorialId?: string) {
  const [progress, setProgress] = useState<ProgressData>(defaultProgress);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setProgress(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse tutorial progress from localStorage", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const updateTutorial = (
    id: string,
    updater: (prev: TutorialProgress) => TutorialProgress
  ) => {
    setProgress((prev) => ({
      ...prev,
      tutorials: {
        ...prev.tutorials,
        [id]: updater(
          prev.tutorials[id] || {
            started: false,
            completed: false,
            stepsCompleted: [],
          }
        ),
      },
    }));
  };

  const startTutorial = (id: string) => {
    updateTutorial(id, (prev) => ({ ...prev, started: true }));
  };

  const completeStep = (id: string, stepId: string) => {
    updateTutorial(id, (prev) => ({
      ...prev,
      stepsCompleted: prev.stepsCompleted.includes(stepId)
        ? prev.stepsCompleted
        : [...prev.stepsCompleted, stepId],
    }));
  };

  const completeTutorial = (id: string) => {
    updateTutorial(id, (prev) => ({ ...prev, completed: true }));
  };

  const getTutorialStatus = (id: string) => {
    return (
      progress.tutorials[id] || {
        started: false,
        completed: false,
        stepsCompleted: [],
      }
    );
  };

  const getOverallStats = () => {
    const tutorials = Object.values(progress.tutorials);
    const totalTutorials = tutorials.length;
    const startedTutorials = tutorials.filter((t) => t.started).length;
    const completedTutorials = tutorials.filter((t) => t.completed).length;
    const totalSteps = tutorials.reduce(
      (sum, t) => sum + t.stepsCompleted.length,
      0
    );
    // Assuming we need total possible steps, but since we don't have config here, maybe just completed steps
    return {
      totalTutorials,
      startedTutorials,
      completedTutorials,
      completedSteps: totalSteps,
    };
  };

  const resetProgress = () => {
    setProgress(defaultProgress);
  };

  // If tutorialId is provided, return tutorial-specific methods
  if (tutorialId) {
    const tutorialProgress = getTutorialStatus(tutorialId);

    return {
      progress: tutorialProgress,
      markStepCompleted: (stepId: string) => {
        completeStep(tutorialId, stepId);
      },
      isStepCompleted: (stepId: string) => {
        return tutorialProgress.stepsCompleted.includes(stepId);
      },
      isTutorialCompleted: tutorialProgress.completed,
      startTutorial: () => startTutorial(tutorialId),
      completeTutorial: () => completeTutorial(tutorialId),
    };
  }

  // Otherwise return the general API
  return {
    progress,
    startTutorial,
    completeStep,
    completeTutorial,
    getTutorialStatus,
    getOverallStats,
    resetProgress,
  };
}
