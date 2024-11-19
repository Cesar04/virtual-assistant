import { Processor } from './processor';

export class AudioProcessor implements Processor {
  processMessage(content: string) {
    return content;
  }
}
