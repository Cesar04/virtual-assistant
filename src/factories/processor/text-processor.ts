import { Processor } from './processor';

export class TextProcesor implements Processor {
  processMessage(content: string) {
    return content;
  }
}
