import { Test, TestingModule } from '@nestjs/testing';
import { TechStackController } from './tech_stack.controller';
import { TechStackService } from './tech_stack.service';

describe('TechStackController', () => {
  let controller: TechStackController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TechStackController],
      providers: [TechStackService],
    }).compile();

    controller = module.get<TechStackController>(TechStackController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
