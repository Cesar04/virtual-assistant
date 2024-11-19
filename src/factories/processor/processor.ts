export interface Processor {
  processMessage(content: string): string;
}
