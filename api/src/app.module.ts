import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { SocialUserModule } from './social-user/social-user.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [AuthModule, UserModule, SocialUserModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
