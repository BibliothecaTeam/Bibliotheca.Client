import { SearchDocument } from './search-document';
import { SearchHighlights } from './search-highlights';

export class SearchResult {
    document: SearchDocument;
    highlights: SearchHighlights;
    score: number;
}