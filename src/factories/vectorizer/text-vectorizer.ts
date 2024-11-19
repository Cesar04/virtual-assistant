import { VectorDatabaseService } from 'src/services/vector-database/vector-database.service';
import { Vectorizer } from './vectorizer';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';

export class TextVectorizer implements Vectorizer {
  constructor(private store: VectorDatabaseService) {}

  async vectorize(content: string) {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 2000,
      chunkOverlap: 200,
    });

    // Crea un documento que contenga el texto
    const document = {
      pageContent: content,
      metadata: {
        id: 'unique-document-id',
      },
    };

    // Divide el documento en fragmentos
    const docChunks = await splitter.splitDocuments([document]);
    await this.store.storeDocuments(docChunks);
  }
}
