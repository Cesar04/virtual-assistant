import { Injectable } from '@nestjs/common';
import { TextVectorizer } from 'src/factories/vectorizer/text-vectorizer';
import { UrlVectorizer } from 'src/factories/vectorizer/url-vectorizer';
import { Vectorizer } from 'src/factories/vectorizer/vectorizer';
import { VectorDatabaseService } from '../vector-database/vector-database.service';
import { PdfVectorizer } from 'src/factories/vectorizer/pdf-vectorizer';

@Injectable()
export class VectorizationFactoryService {
  constructor(private store: VectorDatabaseService) {}

  createVectorizer(type: string): Vectorizer {
    switch (type) {
      case 'url':
        return new UrlVectorizer(this.store);
      case 'text':
        return new TextVectorizer(this.store);
      case 'pdf':
        return new PdfVectorizer(this.store);
      default:
        throw new Error(`Tipo de vectorización no soportado: ${type}`);
    }
  }
}
