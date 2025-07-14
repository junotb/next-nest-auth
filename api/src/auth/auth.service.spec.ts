import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { LoginRequestDto } from './dto/login-request.dto';
import * as jwt from 'jsonwebtoken';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { RefreshRequestDto } from './dto/refresh-request.dto';
import { SignUpRequestDto } from './dto/signup-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { SafeUser } from '../common/type/safe-user.type';

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
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      });
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

  describe('refreshToken', () => {
    it('토큰을 재발급해야 합니다.', () => {
      const dto: RefreshRequestDto = { refreshToken: 'validRefreshToken' };

      (jwt.verify as jest.Mock).mockReturnValue({ sub: 1 }); // Mock JWT 검증
      (jwt.sign as jest.Mock)
        .mockReturnValueOnce('newAccessToken')
        .mockReturnValueOnce('newRefreshToken');

      const result = authService.refresh(dto);
      expect(result).toEqual({
        accessToken: 'newAccessToken',
        refreshToken: 'newRefreshToken',
      });
    });
  });

  describe('signUp', () => {
    it('새 사용자를 등록하고 사용자 정보를 반환해야 합니다.', async () => {
      const dto: SignUpRequestDto = {
        id: 'user123',
        pwd: 'password123',
        usePwd: 0,
        name: 'Test User',
        nickname: 'testuser',
      };
      const newUser: SafeUser = {
        idx: 1,
        id: dto.id,
        name: dto.name,
        nickname: dto.nickname,
        createDate: new Date().getTime(),
        updateDate: new Date().getTime(),
        lastLoginDate: null,
      };
      userService.create!.mockResolvedValue(newUser);
      const result = await authService.signUp(dto);
      expect(result).toEqual({
        user: newUser
      });
    });
  });

  describe('update', () => {
    it('사용자를 업데이트하고 사용자 정보를 반환해야 합니다.', async () => {
      const dto: UpdateRequestDto = { nickname: 'updatedNickname' };
      const updatedUser: SafeUser = {
        idx: 1,
        id: 'user123',
        name: 'Test User',
        nickname: dto.nickname,
        createDate: new Date().getTime(),
        updateDate: new Date().getTime(),
        lastLoginDate: new Date().getTime(),
      };
      userService.update!.mockResolvedValue(updatedUser);
      const result = await authService.update(dto, updatedUser);
      expect(result).toEqual({
        user: updatedUser
      });
    });
  });

  describe('delete', () => {
    it('사용자를 삭제해야 합니다.', async () => {
      const deletedUser: SafeUser = {
        idx: 1,
        id: 'user123',
        name: 'Test User',
        nickname: 'testuser',
        createDate: new Date().getTime(),
        updateDate: new Date().getTime(),
        lastLoginDate: new Date().getTime(),
      };
      userService.delete!.mockResolvedValue(deletedUser);
      const result = await authService.delete(deletedUser);
      expect(result).toEqual({
        user: deletedUser
      });
    });
  });
});
