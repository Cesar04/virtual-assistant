import { Injectable } from '@nestjs/common';
import { InputProcessorFactoryService } from '../input-processor-factory/input-processor-factory.service';
import { GraphService } from '../graph/graph.service';
import { WhatsappInput } from 'src/models/whatsapp-input';

@Injectable()
export class ChatService {
  constructor(
    private readonly inputProcessorFactoryService: InputProcessorFactoryService,
    private readonly graphService: GraphService,
  ) {}

  async processConversationChat(userInput: WhatsappInput) {
    const message = userInput.entry[0].changes[0].value.messages[0].text.body;
    const reqid = userInput.entry[0].changes[0].value.meta.phone_number_id;
    const processor = this.inputProcessorFactoryService.createProcesor('text');

    const messageOut = processor.processMessage(message);

    const agentResponse = await this.graphService.invokeWorkflow(
      reqid,
      messageOut,
    );

    return agentResponse;
  }
}
