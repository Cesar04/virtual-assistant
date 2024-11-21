import { VectorDatabaseService } from 'src/services/vector-database/vector-database.service';
import { Vectorizer } from './vectorizer';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { Injectable } from '@nestjs/common';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { TipoMimeEnum } from 'src/models/tipo-mime-enum';
import { VectorizerInput } from 'src/models/vectorizer-input';

@Injectable()
export class PdfVectorizer implements Vectorizer {
  constructor(private store: VectorDatabaseService) {}

  async vectorize(input: VectorizerInput) {
    await this.vectorizeUrl(input);
  }

  async vectorizeUrl(input: VectorizerInput) {
    const pdfBlob = this.base64ToBlob(input.content, TipoMimeEnum.PDF);

    const wloader = new PDFLoader(pdfBlob);
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

  private base64ToBlob(base64: string, mimeType: string): Blob {
    const buffer = Buffer.from(base64, 'base64');

    return new Blob([buffer], { type: mimeType });
  }
}
