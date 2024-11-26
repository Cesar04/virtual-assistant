import { Test, TestingModule } from '@nestjs/testing';
import { AgentSecInclucionSocialService } from './agent-sec-inclucion-social.service';

describe('AgentSecInclucionSocialService', () => {
  let service: AgentSecInclucionSocialService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AgentSecInclucionSocialService],
    }).compile();

    service = module.get<AgentSecInclucionSocialService>(
      AgentSecInclucionSocialService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
