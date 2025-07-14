import { Module } from '@nestjs/common';
import { SocialUserService } from './social-user.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [SocialUserService],
  imports: [PrismaModule],
  exports: [SocialUserService],
})
export class SocialUserModule {}
