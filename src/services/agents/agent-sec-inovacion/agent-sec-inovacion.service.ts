import { AIMessage } from '@langchain/core/messages';
import { MessagesAnnotation } from '@langchain/langgraph';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { AzureChatOpenAI } from '@langchain/openai';
import { Inject, Injectable } from '@nestjs/common';
import { AgentConfig } from 'src/models/agent-config';

@Injectable()
export class AgentSecInovacionService {
  private _name: string = 'AgentSecInovacion';
  private _toolName: string = 'ToolSecInovacion';
  private _prompt: string = process.env.agentPromptInovacion;
  private _maxTokens: number = 5000;
  private _isPrincipal: boolean = false;
  private _edges: string[] = ['AgentOrchestrator'];

  constructor(
    @Inject('AGENT_INSTANCE')
    private readonly agentModel: AzureChatOpenAI,
    @Inject('TOOL_NODE')
    private readonly toolNode: ToolNode,
  ) {}

  public getAgent() {
    const agentTool = this.agentModel.bindTools(this.toolNode.tools);
    return new AgentConfig(
      this._name,
      this._toolName,
      this._prompt,
      this._maxTokens,
      this.toolNode,
      agentTool,
      this._edges,
      this._isPrincipal,
      this.shouldContinue.bind(this),
    );
  }

  private shouldContinue({ messages }: typeof MessagesAnnotation.State) {
    const lastMessage = messages[messages.length - 1] as AIMessage;

    const flg = lastMessage.tool_calls?.length;

    console.log('3. shouldContinue ', this._toolName);
    console.log(lastMessage.tool_calls);

    if (flg != undefined && flg > 0) {
      return this._toolName;
    }

    return '__end__';
  }
}
