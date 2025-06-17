import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { LoginRequestDto } from './dto/login-request.dto';
import * as jwt from 'jsonwebtoken';
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { RefreshRequestDto } from './dto/refresh-request.dto';
import { RegisterRequestDto } from './dto/register-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';

jest.mock('jsonwebtoken');

describe('AuthService', () => {
  let authService: AuthService;
  let userService: Partial<Record<keyof UserService, jest.Mock>>;

  beforeEach(async () => {
    userService = {
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: userService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    process.env.JWT_SECRET = 'test-secret'; // Mock JWT 비밀키
  });

  it('정의되어야 합니다.', () => {
    expect(authService).toBeDefined();
  });

  describe('getJwtSecret', () => {
    it('JWT 비밀키를 반환해야 합니다.', () => {
      const secret = authService['getJwtSecret']();
      expect(secret).toBe('test-secret');
    });

    it('JWT 비밀키가 설정되어 있지 않으면 InternalServerErrorException을 던져야 합니다.', () => {
      delete process.env.JWT_SECRET; // JWT 삭제하여 트리거 에러 발생
      expect(() => authService['getJwtSecret']()).toThrow(InternalServerErrorException);
    });
  });

  describe('login', () => {
    it('로그인 응답을 반환해야 합니다.', async () => {
      const dto: LoginRequestDto = { id: 'user123@email.com', pwd: 'password123' };
      userService.findById!.mockResolvedValue({
        id: dto.id,
        pwd: Buffer.from(dto.pwd).toString('base64'), // Mock 암호화된 비밀번호
      });

      (jwt.sign as jest.Mock)
        .mockReturnValueOnce('accessToken')
        .mockReturnValueOnce('refreshToken');
      
      const result = await authService.login(dto);
      expect(result).toEqual({
        message: '로그인 성공',
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      });
    });

    it('비밀번호가 일치하지 않으면 BadRequestException을 던져야 합니다.', async () => {
      userService.findById!.mockResolvedValue({ pwd: 'wrongPassword' });
      await expect(authService.login({ id: 'user123', pwd: 'wrongPassword' })).rejects.toThrow(BadRequestException);
    });

    it('JWT 비밀키가 설정되어 있지 않으면 InternalServerErrorException을 던져야 합니다.', async () => {
      const dto: LoginRequestDto = { id: 'user123@email.com', pwd: 'password123' };
      userService.findById!.mockResolvedValue({
        id: dto.id,
        pwd: Buffer.from(dto.pwd).toString('base64'), // Mock 암호화된 비밀번호
      });
      delete process.env.JWT_SECRET; // JWT 삭제하여 트리거 에러 발생
      await expect(authService.login({ id: 'user123', pwd: 'password123' })).rejects.toThrow(InternalServerErrorException);
    });

    it('사용자가 존재하지 않으면 NotFoundException을 던져야 합니다.', async () => {
      const dto: LoginRequestDto = { id: 'wrongid@email.com', pwd: 'password123' };
      userService.findById!.mockRejectedValue(new NotFoundException('사용자를 찾을 수 없습니다.'));
      await expect(authService.login(dto)).rejects.toThrow(new NotFoundException('사용자를 찾을 수 없습니다.'));
    });
  });

  describe('logout', () => {
    it('쿠키를 삭제하고 로그아웃 성공 메시지를 반환해야 합니다.', async () => {
      const res = { clearCookie: jest.fn() } as any; // Mock 응답 객체
      const user = {
        idx: 1,
        id: 'user123',
        name: 'Test User',
        nickname: 'testuser',
        usePwd: true,
        createDate: new Date().getTime(),
        updateDate: new Date().getTime(),
        lastLoginDate: new Date().getTime(),
      }; // Mock 사용자 객체

      const result = await authService.logout(res, user);
      expect(res.clearCookie).toHaveBeenCalledWith('ACCESS_TOKEN');
      expect(res.clearCookie).toHaveBeenCalledWith('REFRESH_TOKEN');
      expect(result).toEqual({ message: '로그아웃 성공' });
    });
  });

  describe('refreshToken', () => {
    it('토큰을 재발급하고 성공 메시지를 반환해야 합니다.', async () => {
      const dto: RefreshRequestDto = { refreshToken: 'validRefreshToken' };

      (jwt.verify as jest.Mock).mockReturnValue({ sub: 1 }); // Mock JWT 검증
      (jwt.sign as jest.Mock)
        .mockReturnValueOnce('newAccessToken')
        .mockReturnValueOnce('newRefreshToken');

      const result = await authService.refreshToken(dto);
      expect(result).toEqual({
        message: '토큰 재발급 성공',
        accessToken: 'newAccessToken',
        refreshToken: 'newRefreshToken',
      });
    });
  });

  describe('register', () => {
    it('새 사용자를 등록하고 성공 메시지를 반환해야 합니다.', async () => {
      const dto: RegisterRequestDto = {
        id: 'user123',
        pwd: 'password123',
        confirmPwd: 'password123',
        usePwd: 1,
        name: 'Test User',
        nickname: 'testuser',
      };
      userService.create!.mockResolvedValue({
        idx: 1,
        id: dto.id,
        name: dto.name,
        nickname: dto.nickname,
        usePwd: Boolean(dto.usePwd),
        createDate: new Date().getTime(),
        updateDate: new Date().getTime(),
      });
      const result = await authService.register(dto);
      expect(result).toEqual({ message: '회원가입 성공' });
    });

    it('비밀번호가 일치하지 않으면 BadRequestException을 던져야 합니다.', async () => {
      const dto: RegisterRequestDto = {
        id: 'user123',
        pwd: 'password123',
        confirmPwd: 'wrongpassword123',
        usePwd: 1,
        name: 'Test User',
        nickname: 'testuser',
      };
      await expect(authService.register(dto)).rejects.toThrow(new BadRequestException('비밀번호가 일치하지 않습니다.'));
    });
  });

  describe('update', () => {
    it('사용자를 업데이트하고 성공 메시지를 반환해야 합니다.', async () => {
      const dto: UpdateRequestDto = { nickname: 'updatedNickname' };
      const user = {
        idx: 1,
        id: 'user123',
        name: 'Test User',
        nickname: dto.nickname,
        usePwd: true,
        createDate: new Date().getTime(),
        updateDate: new Date().getTime(),
        lastLoginDate: new Date().getTime(),
      };

      userService.update!.mockResolvedValue(user);
      const result = await authService.update(dto, user);
      expect(result).toEqual({ message: '사용자 정보가 업데이트 되었습니다.' });
    });
  });

  describe('delete', () => {
    it('사용자를 삭제하고 성공 메시지를 반환해야 합니다.', async () => {
      const user = {
        idx: 1,
        id: 'user123',
        name: 'Test User',
        nickname: 'testuser',
        usePwd: true,
        createDate: new Date().getTime(),
        updateDate: new Date().getTime(),
        lastLoginDate: new Date().getTime(),
      };

      userService.delete!.mockResolvedValue(user);
      const result = await authService.delete(user);
      expect(result).toEqual({ message: '사용자 정보가 삭제되었습니다.' });
    });
  });
});
