import { ToolNode } from '@langchain/langgraph/prebuilt';
import { AzureChatOpenAI } from '@langchain/openai';
import { Provider } from '@nestjs/common';
import { AgentOrchestrator } from 'src/services/agents/agent-orchestrator/agent-orchestrator.service';
import { AgentSecInclucionSocialService } from 'src/services/agents/agent-sec-inclucion-social/agent-sec-inclucion-social.service';
import { AgentSecInovacionService } from 'src/services/agents/agent-sec-inovacion/agent-sec-inovacion.service';

export const AGENTS_PROVIDER: Provider = {
  provide: 'AGENTS_NODE',
  useFactory: (agentModel: AzureChatOpenAI, toolNode: ToolNode) => {
    const agentOrchestrator = new AgentOrchestrator(agentModel);
    const agentSecInclucion = new AgentSecInclucionSocialService(
      agentModel,
      toolNode,
    );
    const agentSecInovacion = new AgentSecInovacionService(
      agentModel,
      toolNode,
    );

    return [
      agentOrchestrator.getAgent(),
      agentSecInclucion.getAgent(),
      agentSecInovacion.getAgent(),
    ];
  },
  inject: ['AGENT_INSTANCE', 'TOOL_NODE'],
};
