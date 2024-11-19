import { Body, Controller, Post } from '@nestjs/common';
import { VectorizerInput } from 'src/models/vectorizer-input';
import { VectorizationFactoryService } from 'src/services/vectorization-factory/vectorization-factory.service';

@Controller('vector-data')
export class VectorDataController {
  constructor(
    private readonly vectorizationFactoryService: VectorizationFactoryService,
  ) {}

  @Post()
  async vectorizeContent(@Body() body: VectorizerInput): Promise<any> {
    const vectorizer = this.vectorizationFactoryService.createVectorizer(
      body.type,
    );

    return vectorizer.vectorize(body.content);
  }
}
