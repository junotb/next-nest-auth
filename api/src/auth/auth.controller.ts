import { Controller, Post, Body, Get, UseGuards, Res, HttpCode } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { User } from '../common/decorator/user.decorator';
import { SafeUser } from '../common/type/safe-user.type';
import { RefreshRequestDto } from './dto/refresh-request.dto';
import { SignUpRequestDto } from './dto/signup-request.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateRequestDto } from './dto/update-request.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 사용자 프로필 조회
   * @returns 사용자 정보
   * @throws UnauthorizedException 인증되지 않은 사용자 접근 시
   * @throws InternalServerErrorException JWT 비밀 키가 설정되어 있지 않은 경우
   * @example
   * GET /auth/profile
   * {}
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @HttpCode(200)
  profile(@User() user: SafeUser) {
    return user;
  }

  /**
   * 사용자 로그인 처리
   * @param dto 로그인 정보 DTO
   * @return 발급된 액세스 토큰
   * @throws BadRequestException 사용자 정보가 없거나 비밀번호가 일치하지 않는 경우
   * @throws InternalServerErrorException JWT 비밀 키가 설정되어 있지 않은 경우
   * @example
   * POST /auth/login
   * {
   *  "id": "user123",
   *  "pwd": "password123"
   * }
   */
  @Post('login')
  @HttpCode(200)
  async login(
    @Body() dto: LoginRequestDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { accessToken, refreshToken } = await this.authService.login(dto);

    // 쿠키에 토큰 저장
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15분
    });

    // 쿠키에 리프레시 토큰 저장
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
    });

    return {
      accessToken,
    };
  }

  /**
   * 사용자 로그아웃 처리
   * @return 로그아웃 성공 상태 코드
   * @throws UnauthorizedException 인증되지 않은 사용자 접근 시
   * @throws InternalServerErrorException JWT 비밀 키가 설정되어 있지 않은 경우
   * @example
   * POST /auth/logout
   * {}
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(204)
  logout(@Res({ passthrough: true }) res: Response, @User() user: SafeUser) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
  }

  /**
   * 토큰 재발급 처리
   * @return 새로 발급된 액세스 토큰
   * @throws UnauthorizedException 인증되지 않은 사용자 접근 시
   * @throws InternalServerErrorException JWT 비밀 키가 설정되어 있지 않은 경우
   * @example
   * POST /auth/refresh
   * {
   *  "refreshToken": "your-refresh-token"
   * }
   */
  @Post('refresh')
  @HttpCode(200)
  async refresh(
    @Body() dto: RefreshRequestDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { accessToken, refreshToken } = await this.authService.refresh(dto);

    // 쿠키에 새 토큰 저장
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15분
    });

    // 쿠키에 새 리프레시 토큰 저장
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
    });

    return {
      accessToken,
    };
  }

  /**
   * 사용자 회원가입 처리
   * @param dto 사용자 정보 DTO
   * @return 회원가입 성공 상태 코드
   * @throws BadRequestException 사용자 정보가 유효하지 않은 경우
   * @throws InternalServerErrorException JWT 비밀 키가 설정되어 있지 않은 경우
   * @example
   * POST /auth/signup
   * {
   *  "id": "newuser",
   *  "pwd": "newpassword",
   *  "confirmPwd": "newpassword",
   *  "usePwd": 1,
   *  "name": "New User",
   *  "nickname": "newuser123"
   * }
   */
  @Post('signup')
  @HttpCode(201)
  async signup(@Body() dto: SignUpRequestDto) {
    return this.authService.signup(dto);
  }

  /**
   * 사용자 정보 수정
   * @param dto 사용자 정보 DTO
   * @return 사용자 정보 수정 성공 메시지와 상태 코드
   * @throws BadRequestException 사용자 정보가 유효하지 않은 경우
   * @throws InternalServerErrorException JWT 비밀 키가 설정되어 있지 않은 경우
   * @example
   * PUT /auth/update
   * {
   *  "nickname": "updatedNickname"
   * }
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('update')
  @HttpCode(200)
  async update(@Body() dto: UpdateRequestDto, @User() user: SafeUser) {
    return this.authService.update(dto, user);
  }

  /**
   * 사용자 회원탈퇴 처리
   * @param dto 사용자 정보 DTO
   * @return 회원탈퇴 성공 상태 코드
   * @throws BadRequestException 사용자 정보가 유효하지 않은 경우
   * @throws InternalServerErrorException JWT 비밀 키가 설정되어 있지 않은 경우
   * @example
   * DELETE /auth/delete
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('delete')
  @HttpCode(204)
  async delete(@User() user: SafeUser) {
    await this.authService.delete(user);
  }
}
