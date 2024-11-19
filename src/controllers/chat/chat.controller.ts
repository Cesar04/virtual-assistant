import { Body, Controller, Post } from '@nestjs/common';
import { WhatsappInput } from 'src/models/whatsapp-input';
import { ChatService } from 'src/services/chat/chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async chat(@Body() userInput: WhatsappInput) {
    return await this.chatService.processConversationChat(userInput);
  }
}
