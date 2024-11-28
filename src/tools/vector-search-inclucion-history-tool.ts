import { tool } from '@langchain/core/tools';
import { VectorDatabaseService } from 'src/services/vector-database/vector-database.service';
import { z } from 'zod';

export class VectorSearchInclucionHistoryTool {
  constructor(private store: VectorDatabaseService) {}

  async processInput(userInput: string, validity: number) {
    console.log(userInput, ' - ', validity);
    /*
    const retriever = this.store.getInstance().asRetriever(
      { k: 10 },
      {
        //filterClause: `WHERE c.metadata.Version = ${validity}`,
        filterClause: `WHERE metadata.Version = 1`,
        includeEmbeddings: true,
      },
    );*/

    const retriever = this.store.getInstance().asRetriever({
      k: 10,
      filter: { filterClause: `WHERE c.metadata.vigencia = ${validity}` },
    });

    return await retriever.invoke(userInput);
  }

  public getTool() {
    const vectorSearchToolSchema = z.object({
      userInput: z.string().describe('consulta a realizar en la base de datos'),
      validity: z
        .number()
        .describe('Año de vigencia de la información solicitada.'),
    });

    return tool(
      async (input: { userInput?: string; validity: number }) => {
        const result = await this.processInput(input.userInput, input.validity);

        console.log(result);

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
        name: 'informacion_secretaria_inclusion_social',
        description: 'Consulta información sobre la secretaria de inclución.',
        schema: vectorSearchToolSchema,
      },
    );
  }
}
