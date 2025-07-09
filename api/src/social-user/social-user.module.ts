import { Module } from '@nestjs/common';
import { SocialUserService } from './social-user.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [],
  providers: [SocialUserService, PrismaService],
})
export class SocialUserModule {}
