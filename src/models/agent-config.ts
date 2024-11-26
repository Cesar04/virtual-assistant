import { BaseLanguageModelInput } from '@langchain/core/language_models/base';
import { AIMessageChunk } from '@langchain/core/messages';
import { Runnable } from '@langchain/core/runnables';
import { MessagesAnnotation } from '@langchain/langgraph';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { ChatOpenAICallOptions } from '@langchain/openai';

export class AgentConfig {
  // Usa modificadores de acceso
  private _name: string;
  private _toolName: string;
  private _prompt: string;
  private _maxTokens: number; // Cambié a number si maxTokens es un número
  private _toolNode: ToolNode;
  private _agent: Runnable<
    BaseLanguageModelInput,
    AIMessageChunk,
    ChatOpenAICallOptions
  >;
  private _edges: string[];
  private _isPrincipal: boolean;
  private _conditionalEdges:
    | ((state: typeof MessagesAnnotation.State) => string)
    | null = null;

  // Constructor con parámetros
  constructor(
    name: string,
    toolName: string,
    prompt: string,
    maxTokens: number, // Asegúrate que el tipo sea correcto
    toolNode: ToolNode,
    agent: Runnable<
      BaseLanguageModelInput,
      AIMessageChunk,
      ChatOpenAICallOptions
    >,
    edges: string[],
    isPrincipal: boolean,
    conditionalEdges?: (state: typeof MessagesAnnotation.State) => string,
  ) {
    this._name = name;
    this._toolName = toolName;
    this._prompt = prompt;
    this._maxTokens = maxTokens;
    this._toolNode = toolNode;
    this._agent = agent;
    this._isPrincipal = isPrincipal;
    this._edges = edges;
    this._conditionalEdges = conditionalEdges;
  }

  // Métodos para acceder a las propiedades si es necesario
  get name(): string {
    return this._name;
  }

  get toolName(): string {
    return this._toolName;
  }

  get prompt(): string {
    return this._prompt;
  }

  get maxTokens(): number {
    return this._maxTokens;
  }

  get toolNode(): ToolNode {
    return this._toolNode;
  }

  get agent(): Runnable<
    BaseLanguageModelInput,
    AIMessageChunk,
    ChatOpenAICallOptions
  > {
    return this._agent;
  }

  get edges(): string[] {
    return this._edges;
  }

  get isPrincipal(): boolean {
    return this._isPrincipal;
  }

  get conditionalEdges() {
    return this._conditionalEdges;
  }
}
