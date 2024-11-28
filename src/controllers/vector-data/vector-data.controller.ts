import { Body, Controller, Post } from '@nestjs/common';
import { VectorizerInput } from 'src/models/vectorizer-input';
import { VectorDatabaseService } from 'src/services/vector-database/vector-database.service';
import { VectorizationFactoryService } from 'src/services/vectorization-factory/vectorization-factory.service';

@Controller('vector-data')
export class VectorDataController {
  constructor(
    private readonly vectorizationFactoryService: VectorizationFactoryService,
    private readonly vectorDatabaseService: VectorDatabaseService,
  ) {}

  @Post()
  async vectorizeContent(@Body() body: VectorizerInput): Promise<any> {
    const vectorizer = this.vectorizationFactoryService.createVectorizer(
      body.type,
    );

    return vectorizer.vectorize(body);
  }

  @Post('delete')
  async deleteContent(@Body() body: VectorizerInput): Promise<any> {
    return await this.vectorDatabaseService.deleteDocument(body.metadata);
  }

  @Post('get-content')
  async getContent(@Body() body: VectorizerInput): Promise<any> {
    return await this.vectorDatabaseService.getData(body.content);
  }
}
