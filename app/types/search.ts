export interface SearchSuggestion {
  id: string;
  type: 'make' | 'model' | 'chipType' | 'transponderType';
  value: string;
  category: 'Vehicle' | 'Transponder' | 'Technical';
}

export interface RecentSearch {
  id: string;
  query: string;
  timestamp: number;
  type: SearchSuggestion['type'];
} 