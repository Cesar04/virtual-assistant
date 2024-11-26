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
    // Lógica para determinar a dónde ir
    const lastMessage = messages[messages.length - 1] as AIMessage;
    const currentMessage = lastMessage.content.toString();
    console.log('2. whereToGo');
    console.log(currentMessage);
    if (currentMessage.includes('AgentSecInovacion'))
      return 'AgentSecInovacion';
    if (currentMessage.includes('AgentSecInclucion'))
      return 'AgentSecInclucion';

    return '__end__';
  }
}
