import { useState, useEffect } from 'react';

interface TutorialProgress {
  started: boolean;
  completed: boolean;
  stepsCompleted: number[]; // array of step indices
}

interface ProgressData {
  tutorials: Record<string, TutorialProgress>;
}

const STORAGE_KEY = 'vizualni-admin-tutorial-progress';

const defaultProgress: ProgressData = {
  tutorials: {},
};

export const useTutorialProgress = () => {
  const [progress, setProgress] = useState<ProgressData>(defaultProgress);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setProgress(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse tutorial progress from localStorage', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const updateTutorial = (tutorialId: string, updater: (prev: TutorialProgress) => TutorialProgress) => {
    setProgress(prev => ({
      ...prev,
      tutorials: {
        ...prev.tutorials,
        [tutorialId]: updater(prev.tutorials[tutorialId] || { started: false, completed: false, stepsCompleted: [] }),
      },
    }));
  };

  const startTutorial = (tutorialId: string) => {
    updateTutorial(tutorialId, prev => ({ ...prev, started: true }));
  };

  const completeStep = (tutorialId: string, stepIndex: number) => {
    updateTutorial(tutorialId, prev => ({
      ...prev,
      stepsCompleted: prev.stepsCompleted.includes(stepIndex) ? prev.stepsCompleted : [...prev.stepsCompleted, stepIndex].sort(),
    }));
  };

  const completeTutorial = (tutorialId: string) => {
    updateTutorial(tutorialId, prev => ({ ...prev, completed: true }));
  };

  const getTutorialStatus = (tutorialId: string) => {
    return progress.tutorials[tutorialId] || { started: false, completed: false, stepsCompleted: [] };
  };

  const getOverallStats = () => {
    const tutorials = Object.values(progress.tutorials);
    const totalTutorials = tutorials.length;
    const startedTutorials = tutorials.filter(t => t.started).length;
    const completedTutorials = tutorials.filter(t => t.completed).length;
    const totalSteps = tutorials.reduce((sum, t) => sum + t.stepsCompleted.length, 0);
    // Assuming we need total possible steps, but since we don't have config here, maybe just completed steps
    return { totalTutorials, startedTutorials, completedTutorials, completedSteps: totalSteps };
  };

  const resetProgress = () => {
    setProgress(defaultProgress);
  };

  return {
    progress,
    startTutorial,
    completeStep,
    completeTutorial,
    getTutorialStatus,
    getOverallStats,
    resetProgress,
  };
};