import { useState, useEffect } from "react";
const STORAGE_KEY = "vizualni-admin-tutorial-progress";
const defaultProgress = {
    tutorials: {},
};
export function useTutorialProgress(tutorialId) {
    const [progress, setProgress] = useState(defaultProgress);
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setProgress(JSON.parse(stored));
            }
            catch (e) {
                console.error("Failed to parse tutorial progress from localStorage", e);
            }
        }
    }, []);
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }, [progress]);
    const updateTutorial = (id, updater) => {
        setProgress((prev) => ({
            ...prev,
            tutorials: {
                ...prev.tutorials,
                [id]: updater(prev.tutorials[id] || {
                    started: false,
                    completed: false,
                    stepsCompleted: [],
                }),
            },
        }));
    };
    const startTutorial = (id) => {
        updateTutorial(id, (prev) => ({ ...prev, started: true }));
    };
    const completeStep = (id, stepId) => {
        updateTutorial(id, (prev) => ({
            ...prev,
            stepsCompleted: prev.stepsCompleted.includes(stepId)
                ? prev.stepsCompleted
                : [...prev.stepsCompleted, stepId],
        }));
    };
    const completeTutorial = (id) => {
        updateTutorial(id, (prev) => ({ ...prev, completed: true }));
    };
    const getTutorialStatus = (id) => {
        return (progress.tutorials[id] || {
            started: false,
            completed: false,
            stepsCompleted: [],
        });
    };
    const getOverallStats = () => {
        const tutorials = Object.values(progress.tutorials);
        const totalTutorials = tutorials.length;
        const startedTutorials = tutorials.filter((t) => t.started).length;
        const completedTutorials = tutorials.filter((t) => t.completed).length;
        const totalSteps = tutorials.reduce((sum, t) => sum + t.stepsCompleted.length, 0);
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
            markStepCompleted: (stepId) => {
                completeStep(tutorialId, stepId);
            },
            isStepCompleted: (stepId) => {
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
