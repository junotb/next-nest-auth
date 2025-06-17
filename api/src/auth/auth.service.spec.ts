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
    process.env.JWT_SECRET = 'test-secret'; // Mock JWT secret for testing
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('getJwtSecret', () => {
    it('should return JWT secret from environment variables', () => {
      const secret = authService['getJwtSecret']();
      expect(secret).toBe('test-secret');
    });

    it('should throw InternalServerErrorException if JWT secret is not set', () => {
      delete process.env.JWT_SECRET; // Remove JWT secret to trigger error
      expect(() => authService['getJwtSecret']()).toThrow(InternalServerErrorException);
    });
  });

  describe('login', () => {
    it('should return login response with access and refresh tokens', async () => {
      const dto: LoginRequestDto = { id: 'user123@email.com', pwd: 'password123' };
      userService.findById!.mockResolvedValue({
        id: dto.id,
        pwd: Buffer.from(dto.pwd).toString('base64'), // Mock encoded password
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

    it('should throw BadRequestException if password does not match', async () => {
      userService.findById!.mockResolvedValue({ pwd: 'wrongPassword' });
      await expect(authService.login({ id: 'user123', pwd: 'wrongPassword' })).rejects.toThrow(BadRequestException);
    });

    it('should throw InternalServerErrorException if JWT secret is not set', async () => {
      const dto: LoginRequestDto = { id: 'user123@email.com', pwd: 'password123' };
      userService.findById!.mockResolvedValue({
        id: dto.id,
        pwd: Buffer.from(dto.pwd).toString('base64'), // Mock encoded password
      });
      delete process.env.JWT_SECRET; // Remove JWT secret to trigger error
      await expect(authService.login({ id: 'user123', pwd: 'password123' })).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      const dto: LoginRequestDto = { id: 'wrongid@email.com', pwd: 'password123' };
      userService.findById!.mockRejectedValue(new NotFoundException('사용자를 찾을 수 없습니다.'));
      await expect(authService.login(dto)).rejects.toThrow(new NotFoundException('사용자를 찾을 수 없습니다.'));
    });
  });

  describe('logout', () => {
    it('should clear cookies and return logout message', async () => {
      const res = { clearCookie: jest.fn() } as any; // Mock response object
      const user = {
        idx: 1,
        id: 'user123',
        name: 'Test User',
        nickname: 'testuser',
        usePwd: true,
        createDate: new Date().getTime(),
        updateDate: new Date().getTime(),
        lastLoginDate: new Date().getTime(),
      }; // Mock user object

      const result = await authService.logout(res, user);
      expect(res.clearCookie).toHaveBeenCalledWith('ACCESS_TOKEN');
      expect(res.clearCookie).toHaveBeenCalledWith('REFRESH_TOKEN');
      expect(result).toEqual({ message: '로그아웃 성공' });
    });
  });

  describe('refreshToken', () => {
    it('should return new access token and success message', async () => {
      const dto: RefreshRequestDto = { refreshToken: 'validRefreshToken' };

      (jwt.verify as jest.Mock).mockReturnValue({ sub: 1 }); // Mock JWT verification
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
    it('should create a new user and return safe user data', async () => {
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

    it('should throw BadRequestException if passwords do not match', async () => {
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
    it('should update user information and return safe user data', async () => {
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
    it('should delete user and return success message', async () => {
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
