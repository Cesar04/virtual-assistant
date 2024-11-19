import { VectorDatabaseService } from 'src/services/vector-database/vector-database.service';
import { Vectorizer } from './vectorizer';
import { CheerioWebBaseLoader } from '@langchain/community/document_loaders/web/cheerio';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UrlVectorizer implements Vectorizer {
  constructor(private store: VectorDatabaseService) {}

  async vectorize(content: string) {
    await this.vectorizeUrl(content);
  }

  async vectorizeUrl(url: string) {
    const wloader = new CheerioWebBaseLoader(url);
    const wdata = await wloader.load();
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 2000,
      chunkOverlap: 200,
    });
    const doc = await splitter.splitDocuments(wdata);
    await this.store.storeDocuments(doc);
  }
}
