import { ToolNode } from '@langchain/langgraph/prebuilt';
import { AzureChatOpenAI } from '@langchain/openai';
import { Provider } from '@nestjs/common';
import { DependenciaPqrGestionHumanaTool } from 'src/tools/dependencia-pqr-gestion-humana-tool';
import { RegisterPqrGestionHumanaTool } from 'src/tools/register-pqr-gestion-humana-tool';

export const TOOL_SEC_GESTION_HUMANA: Provider = {
  provide: 'TOOL_SEC_GESTION_HUMANA',
  useFactory: (agentModel: AzureChatOpenAI) => {
    const registerPqrGestionHumanaTool = new RegisterPqrGestionHumanaTool();
    const dependenciaPqrGestionHumanaTool = new DependenciaPqrGestionHumanaTool(
      agentModel,
    );

    return new ToolNode([
      registerPqrGestionHumanaTool.getTool(),
      dependenciaPqrGestionHumanaTool.getTool(),
    ]);
  },
  inject: ['AGENT_INSTANCE'],
};
