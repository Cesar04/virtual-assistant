import { VectorDatabaseService } from 'src/services/vector-database/vector-database.service';
import { Vectorizer } from './vectorizer';
import { CheerioWebBaseLoader } from '@langchain/community/document_loaders/web/cheerio';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { Injectable } from '@nestjs/common';
import { VectorizerInput } from 'src/models/vectorizer-input';

@Injectable()
export class UrlVectorizer implements Vectorizer {
  constructor(private store: VectorDatabaseService) {}

  async vectorize(input: VectorizerInput) {
    await this.vectorizeUrl(input);
  }

  async vectorizeUrl(input: VectorizerInput) {
    const wloader = new CheerioWebBaseLoader(input.content);
    const wdata = await wloader.load();
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 2000,
      chunkOverlap: 200,
    });

    const doc = await splitter.splitDocuments(wdata);
    doc.forEach((item) => {
      item.metadata = { ...item.metadata, ...input.metadata };
    });

    await this.store.deleteDocument(input.metadata);
    await this.store.storeDocuments(doc);
  }
}
