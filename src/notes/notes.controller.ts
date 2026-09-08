import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(
    @Body() createNoteDto: CreateNoteDto,
    @Session() session: UserSession,
  ) {
    return this.notesService.create(session.user.id, createNoteDto);
  }

  @Get()
  findAll() {
    return this.notesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Session() session: UserSession) {
    return this.notesService.findOne(id, session.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Session() session: UserSession,
    @Body() updateNoteDto: UpdateNoteDto,
  ) {
    return this.notesService.update(id, session.user.id, updateNoteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Session() session: UserSession) {
    return this.notesService.remove(id, session.user.id);
  }
}
