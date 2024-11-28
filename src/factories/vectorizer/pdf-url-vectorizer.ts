import { VectorDatabaseService } from 'src/services/vector-database/vector-database.service';
import { Vectorizer } from './vectorizer';
import { WebPDFLoader } from '@langchain/community/document_loaders/web/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { Injectable } from '@nestjs/common';
import { VectorizerInput } from 'src/models/vectorizer-input';
import { TipoMimeEnum } from 'src/models/tipo-mime-enum';

@Injectable()
export class PdfUrlVectorizer implements Vectorizer {
  constructor(private store: VectorDatabaseService) {}

  async vectorize(input: VectorizerInput) {
    await this.vectorizeUrl(input);
  }

  async vectorizeUrl(input: VectorizerInput) {
    const response = await fetch(input.content);
    const data = await response.blob();
    const nike10kPDFBlob = new Blob([data], { type: TipoMimeEnum.PDF });

    const wloader = new WebPDFLoader(nike10kPDFBlob);
    const wdata = await wloader.load();
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
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
