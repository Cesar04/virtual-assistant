import { tool } from '@langchain/core/tools';
import { VectorDatabaseService } from 'src/services/vector-database/vector-database.service';
import { z } from 'zod';

export class VectorSearchTool {
  constructor(private store: VectorDatabaseService) {}

  async processInput(userInput: string) {
    const retriever = this.store.getInstance().asRetriever();
    return await retriever.invoke(userInput);
  }

  public getTool() {
    const vectorSearchToolSchema = z.object({
      userInput: z.string().describe('consulta a realizar en la base de datos'),
    });

    return tool(
      async (input: { userInput?: string }) => {
        const result = await this.processInput(input.userInput);

        return {
          success: true,
          data: result,
          metadata: {
            timestamp: new Date().toISOString(),
            description:
              'Resultado de la búsqueda en la base de datos vectorial',
            confidence: 1.0,
          },
        };
      },
      {
        name: 'vector_database_search',
        description:
          'Consulta información sobre los empleados que trabajan en ceiba',
        schema: vectorSearchToolSchema,
      },
    );
  }
}
