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

  getInstance = () => this.vectorStore;

  getData(question: string): any {
    return this.vectorStore.similaritySearchWithScore(question);
  }
}
