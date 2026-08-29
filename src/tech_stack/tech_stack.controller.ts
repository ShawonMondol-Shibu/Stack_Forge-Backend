import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TechStackService } from './tech_stack.service';
import { CreateTechStackDto } from './dto/create-tech_stack.dto';
import { UpdateTechStackDto } from './dto/update-tech_stack.dto';
import {
  AllowAnonymous,
  Roles,
  Session,
  type UserSession,
} from '@thallesp/nestjs-better-auth';

@Controller('tech-stack')
export class TechStackController {
  constructor(private readonly techStackService: TechStackService) {}

  @Post()
  @Roles(['admin'])
  create(
    @Body() createTechStackDto: CreateTechStackDto,
    @Session() session: UserSession,
  ) {
    return this.techStackService.create(createTechStackDto, session.user.id);
  }

  @Get()
  @AllowAnonymous()
  findAll() {
    return this.techStackService.findAll();
  }

  @Get(':id')
  @AllowAnonymous()
  findOne(@Param('id') id: string) {
    return this.techStackService.findOne(id);
  }

  @Patch(':id')
  @Roles(['admin'])
  update(
    @Param('id') id: string,
    @Session() session: UserSession,
    @Body() updateTechStackDto: UpdateTechStackDto,
  ) {
    return this.techStackService.update(
      id,
      session.user.id,
      updateTechStackDto,
    );
  }

  @Delete(':id')
  @Roles(['admin'])
  remove(@Param('id') id: string, @Session() session: UserSession) {
    return this.techStackService.remove(id, session.user.id);
  }
}
