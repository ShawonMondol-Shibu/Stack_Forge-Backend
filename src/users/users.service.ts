import { Injectable } from '@nestjs/common';
import { db } from '../lib/database/db';
import { user } from '../lib/database/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class UsersService {
  async findAllUsers() {
    return await db.select().from(user);
  }

  async findOneUser(id: string) {
    const res = await db.select().from(user).where(eq(user.id, id));
    return res;
  }
}
