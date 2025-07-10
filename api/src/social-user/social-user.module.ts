import { Module } from '@nestjs/common';
import { SocialUserService } from './social-user.service';

@Module({
  controllers: [],
  providers: [SocialUserService],
})
export class SocialUserModule {}
