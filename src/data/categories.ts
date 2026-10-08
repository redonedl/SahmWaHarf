import type { Category } from '../types/category';

export const CATEGORIES: Category[] = require('../assets/categories.json');

export const getCategoryById = (id: string): Category | undefined =>
  CATEGORIES.find((c) => c.id === id);
