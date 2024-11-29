import { Test, TestingModule } from '@nestjs/testing';
import { AgentSecGestionHumanaService } from './agent-sec-gestion-humana.service';

describe('AgentSecGestionHumanaService', () => {
  let service: AgentSecGestionHumanaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AgentSecGestionHumanaService],
    }).compile();

    service = module.get<AgentSecGestionHumanaService>(
      AgentSecGestionHumanaService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
