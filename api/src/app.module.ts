import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { SwaggerModule } from '@nestjs/swagger';

@Module({
  imports: [AuthModule, UserModule, PrismaModule, SwaggerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
