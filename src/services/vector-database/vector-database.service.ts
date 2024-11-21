import { AzureCosmosDBNoSQLVectorStore } from '@langchain/azure-cosmosdb';
import { Inject, Injectable } from '@nestjs/common';
import { Parameter } from 'src/models/parameter';
import { QuerySpec } from 'src/models/query-spec';

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

  async deleteDocument(metadata: Record<string, string>) {
    const querySpec = this.buildQuerySpec(metadata);
    await this.vectorStore.delete({
      filter: querySpec,
    });
  }

  private buildQuerySpec(metadata: Record<string, string>): QuerySpec {
    const query = this.buildQuery(metadata);
    const parameters = this.buildParameters(metadata);
    return { query, parameters };
  }

  private buildQuery(metadata: Record<string, string>): string {
    const conditions = Object.keys(metadata).map((key, index) => {
      return `c.metadata.${key} = @param${index}`;
    });
    return `SELECT c.id FROM c WHERE ${conditions.join(' AND ')}`;
  }

  private buildParameters(metadata: Record<string, string>): Parameter[] {
    return Object.keys(metadata).map((key, index) => ({
      name: `@param${index}`,
      value: metadata[key],
    }));
  }
}
