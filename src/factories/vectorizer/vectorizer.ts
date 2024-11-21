import { VectorizerInput } from 'src/models/vectorizer-input';

export interface Vectorizer {
  vectorize(input: VectorizerInput): any;
}
