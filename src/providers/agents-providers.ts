import { ToolNode } from '@langchain/langgraph/prebuilt';
import { AzureChatOpenAI } from '@langchain/openai';
import { Provider } from '@nestjs/common';
import { AgentOrchestrator } from 'src/services/agents/agent-orchestrator/agent-orchestrator.service';
import { AgentSecHaciendaService } from 'src/services/agents/agent-sec-hacienda/agent-sec-hacienda.service';
import { AgentSecInclucionSocialService } from 'src/services/agents/agent-sec-inclucion-social/agent-sec-inclucion-social.service';
import { AgentSecInovacionService } from 'src/services/agents/agent-sec-inovacion/agent-sec-inovacion.service';

export const AGENTS_PROVIDER: Provider = {
  provide: 'AGENTS_NODE',
  useFactory: (
    agentModel: AzureChatOpenAI,
    toolNode: ToolNode,
    toolSecInclucion: ToolNode,
    toolSecHacienda: ToolNode,
  ) => {
    const agentOrchestrator = new AgentOrchestrator(agentModel);
    const agentSecInclucion = new AgentSecInclucionSocialService(
      agentModel,
      toolSecInclucion,
    );
    const agentSecInovacion = new AgentSecInovacionService(
      agentModel,
      toolNode,
    );

    const agentSecHacienda = new AgentSecHaciendaService(
      agentModel,
      toolSecHacienda,
    );

    return [
      agentOrchestrator.getAgent(),
      agentSecHacienda.getAgent(),
      agentSecInclucion.getAgent(),
      agentSecInovacion.getAgent(),
    ];
  },
  inject: [
    'AGENT_INSTANCE',
    'TOOL_NODE',
    'TOOL_SEC_INCLUCION',
    'TOOL_SEC_HACIENDA',
  ],
};
