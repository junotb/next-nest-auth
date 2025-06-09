import { Controller, Post, Body, Get, Res, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthService } from './auth.service';
import { SignInAuthDto } from './dto/signin-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: any) {
    return req.user;
  }

  @Post('login')
  signIn(
    @Body() dto: SignInAuthDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { id, pwd } = dto;
    if (!id || !pwd) throw new BadRequestException('이메일과 비밀번호를 입력해주세요.');

    return this.authService.login(id, pwd, res);
  }
}
