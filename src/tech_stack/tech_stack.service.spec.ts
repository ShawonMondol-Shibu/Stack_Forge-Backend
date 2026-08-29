import { Test, TestingModule } from '@nestjs/testing';
import { TechStackService } from './tech_stack.service';

describe('TechStackService', () => {
  let service: TechStackService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TechStackService],
    }).compile();

    service = module.get<TechStackService>(TechStackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
