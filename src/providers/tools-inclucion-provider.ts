import { ToolNode } from '@langchain/langgraph/prebuilt';
import { Provider } from '@nestjs/common';
import { VectorDatabaseService } from 'src/services/vector-database/vector-database.service';
import { VectorSearchInclucionHistoryTool } from 'src/tools/vector-search-inclucion-history-tool';
import { VectorSearchInclucionTool } from 'src/tools/vector-search-inclucion-tool';

export const TOOL_SEC_INCLUCION: Provider = {
  provide: 'TOOL_SEC_INCLUCION',
  useFactory: (vectorDatabaseService: VectorDatabaseService) => {
    const vectorSearchInclucionTool = new VectorSearchInclucionTool(
      vectorDatabaseService,
    );

    const vectorSearchInclucionHistoryTool =
      new VectorSearchInclucionHistoryTool(vectorDatabaseService);

    return new ToolNode([
      vectorSearchInclucionHistoryTool.getTool(),
      vectorSearchInclucionTool.getTool(),
    ]);
  },
  inject: [VectorDatabaseService],
};
