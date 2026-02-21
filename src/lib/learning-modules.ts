// Re-export shim — all module data now lives in src/lib/learning/
export {
  LEARNING_MODULES,
  getModuleById,
  getLessonById,
  getTotalLessonCount,
} from './learning/index';
