import Fuse from 'fuse.js';
import { SearchSuggestion } from '@/app/types/search';

export function fuzzySearch<T>(items: T[], searchTerm: string, keys: (keyof T)[]): T[] {
  const fuse = new Fuse(items, {
    keys,
    threshold: 0.3,
    shouldSort: true,
  });

  if (!searchTerm) return items;
  
  const results = fuse.search(searchTerm);
  return results.map(result => result.item);
} 