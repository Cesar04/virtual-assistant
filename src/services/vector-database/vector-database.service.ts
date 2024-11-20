import { AzureCosmosDBNoSQLVectorStore } from '@langchain/azure-cosmosdb';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class VectorDatabaseService {
  constructor(
    @Inject('VECTOR_DATABASE_INSTANCE')
    private readonly vectorStore: AzureCosmosDBNoSQLVectorStore,
  ) {}

  async storeDocuments(document: any) {
    await this.vectorStore.addDocuments(document);
  }

  async deleteDocument() {
    const querySpec = {
      query: 'SELECT c.id FROM c WHERE c.metadata.Tema = @tema',
      parameters: [{ name: '@tema', value: 'calendario' }],
    };

    await this.vectorStore.delete({
      filter: querySpec,
    });
  }

  getInstance = () => this.vectorStore;

  getData(question: string): any {
    return this.vectorStore.similaritySearchWithScore(question);
  }
}
