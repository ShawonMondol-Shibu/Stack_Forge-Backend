import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './lib/auth/auth';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import 'dotenv/config';
import { UsersService } from './users/users.service';
import { ProfileController } from './profile/profile.controller';
import { ProfileModule } from './profile/profile.module';
import { ProfileService } from './profile/profile.service';

@Module({
  imports: [
    AuthModule.forRoot({
      auth,
      bodyParser: {
        json: { limit: '2mb' },
        urlencoded: { limit: '2mb', extended: true },
        rawBody: true,
      },
    }),
    UsersModule,
    ProfileModule,
  ],
  controllers: [AppController, UsersController, ProfileController],
  providers: [AppService, UsersService, ProfileService],
})
export class AppModule {}
