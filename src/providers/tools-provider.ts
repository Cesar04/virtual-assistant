import { ToolNode } from '@langchain/langgraph/prebuilt';
import { Provider } from '@nestjs/common';
import { VectorDatabaseService } from 'src/services/vector-database/vector-database.service';
import { VectorSearchTool } from 'src/tools/vector-search-tool';

export const TOOLS_PROVIDER: Provider[] = [
  {
    provide: 'TOOL_NODE',
    useFactory: (vectorDatabaseService: VectorDatabaseService) => {
      const vectorSearchTool = new VectorSearchTool(vectorDatabaseService);

      return new ToolNode([vectorSearchTool.getToolDefault()]);
    },
    inject: [VectorDatabaseService],
  },
];
