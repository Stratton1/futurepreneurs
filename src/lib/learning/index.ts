import type { LearningModule, Lesson } from '@/types/learning';

import { entrepreneurialMindset } from './modules/01-entrepreneurial-mindset';
import { theBlueprint } from './modules/02-the-blueprint';
import { craftingThePitch } from './modules/03-crafting-the-pitch';
import { budgetingFinancial } from './modules/04-budgeting-financial';
import { launchMarketing } from './modules/05-launch-marketing';
import { managingBusiness } from './modules/06-managing-business';
import { resourceLibrary } from './modules/07-resource-library';

export const LEARNING_MODULES: LearningModule[] = [
  entrepreneurialMindset,
  theBlueprint,
  craftingThePitch,
  budgetingFinancial,
  launchMarketing,
  managingBusiness,
  resourceLibrary,
];

/** Get a module by ID */
export function getModuleById(moduleId: string): LearningModule | undefined {
  return LEARNING_MODULES.find((m) => m.id === moduleId);
}

/** Get a lesson by module and lesson ID */
export function getLessonById(
  moduleId: string,
  lessonId: string
): { module: LearningModule; lesson: Lesson } | undefined {
  const mod = getModuleById(moduleId);
  if (!mod) return undefined;
  const lesson = mod.lessons.find((l) => l.id === lessonId);
  if (!lesson) return undefined;
  return { module: mod, lesson };
}

/** Get the total number of lessons across all modules */
export function getTotalLessonCount(): number {
  return LEARNING_MODULES.reduce((sum, m) => sum + m.lessons.length, 0);
}
