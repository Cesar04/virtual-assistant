import { VectorDatabaseService } from 'src/services/vector-database/vector-database.service';
import { Vectorizer } from './vectorizer';
import { WebPDFLoader } from '@langchain/community/document_loaders/web/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PdfVectorizer implements Vectorizer {
  constructor(private store: VectorDatabaseService) {}

  async vectorize(content: string) {
    await this.vectorizeUrl(content);
  }

  async vectorizeUrl(url: string) {
    const response = await fetch(url);
    const data = await response.blob();
    const nike10kPDFBlob = new Blob([data], { type: 'application/pdf' });

    const wloader = new WebPDFLoader(nike10kPDFBlob);
    const wdata = await wloader.load();
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 2000,
      chunkOverlap: 200,
    });

    const doc = await splitter.splitDocuments(wdata);

    doc.forEach((item) => {
      item.metadata['Tema'] = 'calendario';
    });

    await this.store.deleteDocument();
    await this.store.storeDocuments(doc);
  }
}
