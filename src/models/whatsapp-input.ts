export interface WhatsappInput {
  object: string;
  entry: Entry[];
}

export interface Text {
  body: string;
}

export interface Message {
  from: string;
  id: string;
  timestamp: string;
  text: Text;
}

export interface Metadata {
  display_phone_number: string;
  phone_number_id: string;
}

export interface Value {
  messaging_product: string;
  meta: Metadata;
  messages: Message[];
}

export interface Change {
  value: Value;
  field: string;
}

export interface Entry {
  id: string;
  changes: Change[];
}
