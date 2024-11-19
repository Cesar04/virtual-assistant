import { Injectable } from '@nestjs/common';
import { AudioProcessor } from 'src/factories/processor/audio-processor';
import { Processor } from 'src/factories/processor/processor';
import { TextProcesor } from 'src/factories/processor/text-processor';

@Injectable()
export class InputProcessorFactoryService {
  createProcesor(type: string): Processor {
    switch (type) {
      case 'Audio':
        return new AudioProcessor();
      case 'text':
        return new TextProcesor();
      default:
        throw new Error(`Tipo de vectorización no soportado: ${type}`);
    }
  }
}
