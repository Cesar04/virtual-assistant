import { tool } from '@langchain/core/tools';
import { VectorDatabaseService } from 'src/services/vector-database/vector-database.service';
import { z } from 'zod';

export class VectorSearchHaciendaTool {
  constructor(private store: VectorDatabaseService) {}

  async processInput(userInput: string, validity: number) {
    const retriever = this.store.getInstance().asRetriever({
      filter: { filterClause: `WHERE c.metadata.vigencia = ${validity}` },
    });

    return await retriever.invoke(userInput);
  }

  public getTool() {
    const vectorSearchToolSchema = z.object({
      userInput: z.string().describe('Consulta a realizar en la base de datos'),
      validity: z
        .number()
        .optional()
        .describe(
          'Año al que corresponde la información solicitada. "Si no se especifica, no envie ningun valor" ',
        ),
    });

    return tool(
      async (input: { userInput?: string; validity?: number }) => {
        const currentYear = new Date().getFullYear();
        const validityYear = input.validity || currentYear;

        const result = await this.processInput(input.userInput, validityYear);

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
        name: 'informacion_secretaria_hacienda',
        description:
          'Consulta información confiable sobre la Secretaría de Hacienda, incluyendo el calendario tributario y otros temas relevantes.',
        schema: vectorSearchToolSchema,
      },
    );
  }
}
