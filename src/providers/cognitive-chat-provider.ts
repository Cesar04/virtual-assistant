import { AzureCosmosDBNoSQLVectorStore } from '@langchain/azure-cosmosdb';
import { MongoDBSaver } from '@langchain/langgraph-checkpoint-mongodb';
import { AzureChatOpenAI } from '@langchain/openai';
import { Provider } from '@nestjs/common';
import { MongoClient } from 'mongodb';
import { OllamaEmbeddings } from '@langchain/community/embeddings/ollama';

export const COGNITIVE_CHAT_PROVIDER: Provider[] = [
  {
    provide: 'AGENT_INSTANCE',
    useFactory: () =>
      new AzureChatOpenAI({
        azureOpenAIApiKey: process.env.azureOpenAIApiKey,
        azureOpenAIEndpoint: process.env.azureOpenAIEndpoint,
        model: process.env.model,
        openAIApiVersion: process.env.openAIApiVersion,
        deploymentName: process.env.deploymentName,
      }),
  },
  {
    provide: 'VECTOR_DATABASE_INSTANCE',
    useFactory: () =>
      new AzureCosmosDBNoSQLVectorStore(
        new OllamaEmbeddings({ model: 'nomic-embed-text' }),
        {
          connectionString: process.env.vectorDatabaseConnectionString,
          databaseName: process.env.vectorDatabaseId,
          containerName: process.env.vectorDatabaseContainerId,
        },
      ),
  },
  {
    provide: 'AGENT_DB_CHECKPOINTER_INSTANCE',
    useFactory: () => {
      const client = new MongoClient(
        process.env.checkpointerDatabaseConnectionString,
      );

      return new MongoDBSaver({
        client,
        dbName: process.env.checkpointerDatabaseId,
        checkpointCollectionName: process.env.checkpointerDatabaseContainerId,
      });
    },
  },
];
