import { AIMessage } from '@langchain/core/messages';
import { MessagesAnnotation } from '@langchain/langgraph';
import { AzureChatOpenAI } from '@langchain/openai';
import { Inject, Injectable } from '@nestjs/common';
import { AgentConfig } from 'src/models/agent-config';

@Injectable()
export class AgentOrchestrator {
  private _name: string = 'AgentOrchestrator';
  private _toolName: string = null;
  private _prompt: string = process.env.agentPrompt;
  private _maxTokens: number = 5000;
  private _isPrincipal: boolean = true;
  private _edges: string[] = [];
  AGENTS_MAP = {
    agentsechacienda: 'AgentSecHacienda',
    agentsecsalud: 'AgentSecSalud',
    agentsecgestionhumana: 'AgentSecGestionHumana',
  };

  constructor(
    @Inject('AGENT_INSTANCE')
    private readonly agentModel: AzureChatOpenAI,
  ) {}

  public getAgent() {
    return new AgentConfig(
      this._name,
      this._toolName,
      this._prompt,
      this._maxTokens,
      null,
      this.agentModel,
      this._edges,
      this._isPrincipal,
      this.whereToGo.bind(this),
    );
  }

  private whereToGo({ messages }: typeof MessagesAnnotation.State) {
    const lastMessage = this.getLastMessageContent(messages);
    const agentKey = this.cleanMessage(lastMessage);
    const agent = this.findAgent(agentKey);

    return agent || '__end__';
  }

  // Función para obtener el contenido del último mensaje
  private getLastMessageContent(messages: AIMessage[]): string {
    return messages[messages.length - 1].content.toString().toLowerCase();
  }

  // Función para limpiar el mensaje
  private cleanMessage(message: string): string {
    return message.replace(/\s /g, '').toLowerCase();
  }

  // Función para encontrar el agente
  private findAgent(agentKey: string): string | undefined {
    return this.AGENTS_MAP[agentKey];
  }
}
