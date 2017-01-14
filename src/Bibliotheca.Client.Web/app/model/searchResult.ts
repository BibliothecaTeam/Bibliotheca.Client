import { SearchDocument } from './searchDocument';
import { SearchHighlights } from './searchHighlights';

export class SearchResult {
    document: SearchDocument;
    highlights: SearchHighlights;
    score: number;
}