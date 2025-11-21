import { TUTORIAL_CONFIGS, getTutorialConfig, getAllTutorialIds, getTutorialsByCategory, getTutorialTitle, getTutorialDescription, TutorialConfig } from './config';

export { TUTORIAL_CONFIGS, getTutorialConfig, getAllTutorialIds, getTutorialsByCategory, getTutorialTitle, getTutorialDescription, TutorialConfig };

/**
 * Get the next tutorial in the same category
 */
export function getNextTutorial(id: string): TutorialConfig | null {
  const config = getTutorialConfig(id);
  if (!config) return null;
  const categoryTutorials = getTutorialsByCategory(config.category);
  const index = categoryTutorials.findIndex(t => t.id === id);
  if (index === -1 || index === categoryTutorials.length - 1) return null;
  return categoryTutorials[index + 1];
}

/**
 * Get the previous tutorial in the same category
 */
export function getPreviousTutorial(id: string): TutorialConfig | null {
  const config = getTutorialConfig(id);
  if (!config) return null;
  const categoryTutorials = getTutorialsByCategory(config.category);
  const index = categoryTutorials.findIndex(t => t.id === id);
  if (index === -1 || index === 0) return null;
  return categoryTutorials[index - 1];
}