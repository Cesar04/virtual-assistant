import { VectorDatabaseService } from 'src/services/vector-database/vector-database.service';
import { Vectorizer } from './vectorizer';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { VectorizerInput } from 'src/models/vectorizer-input';

export class TextVectorizer implements Vectorizer {
  constructor(private store: VectorDatabaseService) {}

  async vectorize(input: VectorizerInput) {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 2000,
      chunkOverlap: 200,
    });

    // Crea un documento que contenga el texto
    const document = {
      pageContent: input.content,
      metadata: input.metadata,
    };

    // Divide el documento en fragmentos
    const docChunks = await splitter.splitDocuments([document]);

    await this.store.deleteDocument(input.metadata);
    await this.store.storeDocuments(docChunks);
  }
}
