import Fuse from 'fuse.js';
import { SearchSuggestion } from '@/app/types/search';

const fuseOptions = {
  keys: ['value', 'type'],
  threshold: 0.3,
  distance: 100
};

export function fuzzySearch(items: SearchSuggestion[], query: string): SearchSuggestion[] {
  const fuse = new Fuse(items, fuseOptions);
  return fuse.search(query).map(result => result.item);
} 