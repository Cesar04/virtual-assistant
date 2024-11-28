import { ToolNode } from '@langchain/langgraph/prebuilt';
import { Provider } from '@nestjs/common';
import { VectorDatabaseService } from 'src/services/vector-database/vector-database.service';
import { VectorSearchHaciendaTool } from 'src/tools/vector-search-hacienda-tool';

export const TOOL_SEC_HACIENDA: Provider = {
  provide: 'TOOL_SEC_HACIENDA',
  useFactory: (vectorDatabaseService: VectorDatabaseService) => {
    const vectorSearchHaciendaTool = new VectorSearchHaciendaTool(
      vectorDatabaseService,
    );

    return new ToolNode([vectorSearchHaciendaTool.getTool()]);
  },
  inject: [VectorDatabaseService],
};
