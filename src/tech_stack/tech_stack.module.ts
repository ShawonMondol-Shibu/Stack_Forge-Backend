import { Module } from '@nestjs/common';
import { TechStackService } from './tech_stack.service';
import { TechStackController } from './tech_stack.controller';

@Module({
  controllers: [TechStackController],
  providers: [TechStackService],
})
export class TechStackModule {}
