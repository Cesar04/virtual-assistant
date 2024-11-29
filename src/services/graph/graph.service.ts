import {
  CompiledStateGraph,
  MessagesAnnotation,
  StateGraph,
} from '@langchain/langgraph';
import { Inject, Injectable } from '@nestjs/common';
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
import { AgentConfig } from 'src/models/agent-config';

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
    @Inject('AGENTS_NODE')
    private readonly agents: AgentConfig[],
  ) {
    this.initializeGraph();
  }

  private initializeGraph() {
    this.workflow = new StateGraph(MessagesAnnotation);

    this.addNodes();
    this.addEdges();
    this.addConditionalEdges();

    /*
    this.ConfiguracionManual();*/

    this.app = this.workflow.compile({
      checkpointer: this.agentDbCheckpointer,
    });
  }

  private ConfiguracionManual() {
    const agentOrchestrator = this.agents[0];
    const agentSecHacienda = this.agents[1];
    this.callAgent = this.callAgent.bind(this);

    this.workflow.addNode(agentOrchestrator.name, (state) =>
      this.callAgent(agentOrchestrator, state),
    );

    this.workflow.addNode(agentSecHacienda.name, (state) =>
      this.callAgent(agentSecHacienda, state),
    );

    this.workflow.addNode(agentSecHacienda.toolName, agentSecHacienda.toolNode);

    this.workflow.addEdge('__start__', agentOrchestrator.name);
    this.workflow.addEdge(agentSecHacienda.toolName, agentSecHacienda.name);

    this.workflow.addConditionalEdges(agentOrchestrator.name, (state) =>
      agentOrchestrator.conditionalEdges(state),
    );

    this.workflow.addConditionalEdges(agentSecHacienda.name, (state) =>
      agentSecHacienda.conditionalEdges(state),
    );
  }

  private addNodes() {
    this.callAgent = this.callAgent.bind(this);
    this.agents.forEach((agentConfig) => {
      this.workflow.addNode(agentConfig.name, (state) =>
        this.callAgent(agentConfig, state),
      );

      if (agentConfig.toolNode != null) {
        this.workflow.addNode(agentConfig.toolName, agentConfig.toolNode);
      }
    });
  }

  private addEdges() {
    this.agents.forEach((agentConfig) => {
      if (agentConfig.isPrincipal) {
        this.workflow.addEdge('__start__', agentConfig.name);
      } else {
        if (agentConfig.toolNode != null) {
          this.workflow.addEdge(agentConfig.toolName, agentConfig.name);
        }
      }
    });
  }

  private addConditionalEdges() {
    this.agents.forEach((agentConfig) => {
      this.workflow.addConditionalEdges(agentConfig.name, (state) =>
        agentConfig.conditionalEdges(state),
      );
    });
  }

  private async callAgent(
    agentConfig: AgentConfig,
    state: typeof MessagesAnnotation.State,
  ) {
    const outp = await trimMessages([...state.messages], {
      maxTokens: agentConfig.maxTokens,
      tokenCounter: this.agentModel,
      allowPartial: false,
      startOn: HumanMessage,
      endOn: [HumanMessage, ToolMessage],
    });

    console.log('1. callAgent');
    console.log(agentConfig.name);

    const response = await agentConfig.agent.invoke(
      [new SystemMessage(agentConfig.prompt)].concat(...outp),
    );

    return { messages: [response] };
  }

  public async invokeWorkflow(reqid: string, humanMessage: string) {
    const response = await this.app.invoke(
      {
        messages: [new HumanMessage(humanMessage)],
      },
      { configurable: { thread_id: reqid }, recursionLimit: 10 },
    );

    const agentResponse = response.messages[response.messages.length - 1];

    return agentResponse.content;
  }
}
