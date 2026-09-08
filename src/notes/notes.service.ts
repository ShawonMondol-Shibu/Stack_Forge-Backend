import { Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { db } from 'src/lib/database/db';
import { notes } from './entities/note.entity';
import { eq, and } from 'drizzle-orm';

@Injectable()
export class NotesService {
  async create(userId: string, createNoteDto: CreateNoteDto) {
    const [data] = await db
      .insert(notes)
      .values({ ...createNoteDto, userId })
      .returning();
    return {
      message: 'Note created successfully',
      data,
    };
  }

  async findAll() {
    const data = await db.select().from(notes);
    return {
      message: 'Notes retrieved successfully',
      data,
    };
  }

  async findOne(id: string, userId: string) {
    const [data] = await db
      .select()
      .from(notes)
      .where(and(eq(notes.id, id), eq(notes.userId, userId)))
      .limit(1);
    return {
      message: 'Note retrieved successfully',
      data,
    };
  }

  async update(id: string, userId: string, updateNoteDto: UpdateNoteDto) {
    const [data] = await db
      .update(notes)
      .set(updateNoteDto)
      .where(and(eq(notes.id, id), eq(notes.userId, userId)))
      .returning();
    return {
      message: 'Note updated successfully',
      data,
    };
  }

  async remove(id: string, userId: string) {
    const [data] = await db
      .delete(notes)
      .where(and(eq(notes.id, id), eq(notes.userId, userId)))
      .returning();
    return {
      message: 'Note removed successfully',
      data,
    };
  }
}
