import { Controller, Post, Body, Get, UseGuards, Res } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { User } from '../common/decorator/user.decorator';
import { SafeUser } from '../common/type/safe-user.type';
import { RefreshRequestDto } from './dto/refresh-request.dto';
import { RegisterRequestDto } from './dto/register-request.dto';
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
   * GET /auth/me
   * {}
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@User() user: SafeUser) {
    return user;
  }

  /**
   * 사용자 로그인 처리
   * @param dto 로그인 정보 DTO
   * @return 로그인 성공 메시지와 토큰 정보
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
  login(@Body() dto: LoginRequestDto) {
    return this.authService.login(dto);
  }

  /**
   * 사용자 로그아웃 처리
   * @return 로그아웃 성공 메시지와 상태 코드
   * @throws UnauthorizedException 인증되지 않은 사용자 접근 시
   * @throws InternalServerErrorException JWT 비밀 키가 설정되어 있지 않은 경우
   * @example
   * POST /auth/logout
   * {}
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response, @User() user: SafeUser) {
    return this.authService.logout(res, user);
  }

  /**
   * 토큰 재발급 처리
   * @return 새로 발급된 토큰 정보
   * @throws UnauthorizedException 인증되지 않은 사용자 접근 시
   * @throws InternalServerErrorException JWT 비밀 키가 설정되어 있지 않은 경우
   * @example
   * POST /auth/refresh
   * {
   *  "refreshToken": "your-refresh-token"
   * }
   */
  @Post('refresh')
  refreshToken(@Body() dto: RefreshRequestDto) {
    return this.authService.refreshToken(dto);
  }

  /**
   * 사용자 회원가입 처리
   * @param dto 사용자 정보 DTO
   * @return 회원가입 성공 메시지와 상태 코드
   * @throws BadRequestException 사용자 정보가 유효하지 않은 경우
   * @throws InternalServerErrorException JWT 비밀 키가 설정되어 있지 않은 경우
   * @example
   * POST /auth/register
   * {
   *  "id": "newuser",
   *  "pwd": "newpassword",
   *  "confirmPwd": "newpassword",
   *  "usePwd": 1,
   *  "name": "New User",
   *  "nickname": "newuser123"
   * }
   */
  @Post('register')
  async register(@Body() dto: RegisterRequestDto) {
    return this.authService.register(dto);
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
  async update(@Body() dto: UpdateRequestDto, @User() user: SafeUser) {
    return this.authService.update(dto, user);
  }

  /**
   * 사용자 회원탈퇴 처리
   * @param dto 사용자 정보 DTO
   * @return 회원탈퇴 성공 메시지와 상태 코드
   * @throws BadRequestException 사용자 정보가 유효하지 않은 경우
   * @throws InternalServerErrorException JWT 비밀 키가 설정되어 있지 않은 경우
   * @example
   * DELETE /auth/delete
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('delete')
  async delete(@User() user: SafeUser) {
    return this.authService.delete(user);
  }
}
