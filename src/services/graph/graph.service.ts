import {
  CompiledStateGraph,
  MessagesAnnotation,
  StateGraph,
} from '@langchain/langgraph';
import { Inject, Injectable } from '@nestjs/common';
import { ToolNode, toolsCondition } from '@langchain/langgraph/prebuilt';
import { AzureChatOpenAI, ChatOpenAICallOptions } from '@langchain/openai';
import {
  AIMessageChunk,
  HumanMessage,
  SystemMessage,
  ToolMessage,
  trimMessages,
} from '@langchain/core/messages';
import { MongoDBSaver } from '@langchain/langgraph-checkpoint-mongodb';
import { BaseLanguageModelInput } from '@langchain/core/language_models/base';
import { Runnable } from '@langchain/core/runnables';

@Injectable()
export class GraphService {
  workflow: StateGraph<any, any, any, any, any, any, any>;
  agentTool: Runnable<
    BaseLanguageModelInput,
    AIMessageChunk,
    ChatOpenAICallOptions
  >;
  app: CompiledStateGraph<any, any, any, any, any, any>;

  constructor(
    @Inject('AGENT_INSTANCE')
    private readonly agentModel: AzureChatOpenAI,
    @Inject('AGENT_DB_CHECKPOINTER_INSTANCE')
    private readonly agentDbCheckpointer: MongoDBSaver,
    @Inject('TOOL_NODE')
    private readonly toolNode: ToolNode,
  ) {
    this.initializeGraph();
  }

  private initializeGraph() {
    this.agentTool = this.agentModel.bindTools(this.toolNode.tools);
    this.callModel = this.callModel.bind(this);

    this.workflow = new StateGraph(MessagesAnnotation)
      .addNode('agent', this.callModel)
      .addEdge('__start__', 'agent')
      .addNode('tools', this.toolNode)
      .addEdge('tools', 'agent')
      .addConditionalEdges('agent', toolsCondition);

    this.app = this.workflow.compile({
      checkpointer: this.agentDbCheckpointer,
    });
  }

  private async callModel(state: typeof MessagesAnnotation.State) {
    const outp = await trimMessages([...state.messages], {
      maxTokens: 5000,
      tokenCounter: this.agentModel,
      allowPartial: false,
      startOn: HumanMessage,
      endOn: [HumanMessage, ToolMessage],
    });

    const response = await this.agentTool.invoke(
      [new SystemMessage(process.env.agentPrompt)].concat(...outp),
    );

    return { messages: [response] };
  }

  public async invokeWorkflow(reqid: string, humanMessage: string) {
    const response = await this.app.invoke(
      {
        messages: [new HumanMessage(humanMessage)],
      },
      { configurable: { thread_id: reqid } },
    );

    const agentResponse = response.messages[response.messages.length - 1];

    return agentResponse.content;
  }
}
