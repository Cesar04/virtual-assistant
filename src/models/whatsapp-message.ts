export interface TextMessage {
  body: string;
}

export interface WhatsappMessage {
  messaging_product: string;
  to: string;
  type: string;
  text: TextMessage;
}
