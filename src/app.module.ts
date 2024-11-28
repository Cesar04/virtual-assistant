import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VectorDataController } from './controllers/vector-data/vector-data.controller';
import { ChatController } from './controllers/chat/chat.controller';
import { GraphService } from './services/graph/graph.service';
import { WhatsAppService } from './services/whats-app/whats-app.service';
import { InputProcessorFactoryService } from './services/input-processor-factory/input-processor-factory.service';
import { VectorizationFactoryService } from './services/vectorization-factory/vectorization-factory.service';
import { VectorDatabaseService } from './services/vector-database/vector-database.service';
import { COGNITIVE_CHAT_PROVIDER } from './providers/cognitive-chat-provider';
import { ChatService } from './services/chat/chat.service';
import { TOOLS_PROVIDER } from './providers/tools-provider';
import { ConfigModule } from '@nestjs/config';
import { AGENTS_PROVIDER } from './providers/agents-providers';
import { TOOL_SEC_INCLUCION } from './providers/tools-inclucion-provider';
import { TOOL_SEC_HACIENDA } from './providers/tools-hacienda-provider';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController, VectorDataController, ChatController],
  providers: [
    ...COGNITIVE_CHAT_PROVIDER,
    ...TOOLS_PROVIDER,
    AGENTS_PROVIDER,
    TOOL_SEC_INCLUCION,
    TOOL_SEC_HACIENDA,
    AppService,
    GraphService,
    WhatsAppService,
    InputProcessorFactoryService,
    VectorizationFactoryService,
    VectorDatabaseService,
    ChatService,
  ],
})
export class AppModule {}
