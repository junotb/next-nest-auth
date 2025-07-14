import { Test, TestingModule } from "@nestjs/testing";
import { Request, Response } from 'express';
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { LoginRequestDto } from "./dto/login-request.dto";
import { SignUpRequestDto } from "./dto/signup-request.dto";
import { SafeUser } from "../common/type/safe-user.type";
import { BadRequestException, UnauthorizedException } from "@nestjs/common";

describe('AuthController', () => {
  let authController: AuthController;
  let authService: Partial<Record<keyof AuthService, jest.Mock>>;

  beforeEach(async () => {
    authService = {
      login: jest.fn(),
      refresh: jest.fn(),
      signUp: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  describe('login', () => {
    it('사용자를 로그인하고 액세스 토큰을 반환해야 합니다.', async () => {
      const dto: LoginRequestDto = { id: 'user123', pwd: 'password123' };
      const res = { cookie: jest.fn() } as unknown as Response;

      authService.login!.mockResolvedValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });

      const result = await authController.login(dto, res);
      expect(result).toEqual({ accessToken: 'access-token' });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(res.cookie).toHaveBeenCalledWith('accesstoken', 'access-token', expect.any(Object));
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(res.cookie).toHaveBeenCalledWith('refreshtoken', 'refresh-token', expect.any(Object));
    });

    it('로그인 실패 시 UnauthorizedException을 던져야 합니다.', async () => {
      const dto: LoginRequestDto = { id: 'user1', pwd: 'wrongpass' };
      const res = { cookie: jest.fn() } as unknown as Response;

      authService.login!.mockRejectedValue(new UnauthorizedException('Invalid credentials'));

      await expect(authController.login(dto, res)).rejects.toThrow(UnauthorizedException);
    });

  });

  describe('logout', () => {
    it('사용자를 로그아웃하고 쿠키를 삭제해야 합니다.', () => {
      const res = { clearCookie: jest.fn() } as unknown as Response;

      authController.logout(res);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(res.clearCookie).toHaveBeenCalledWith('accesstoken');
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(res.clearCookie).toHaveBeenCalledWith('refreshtoken');
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(res.clearCookie).toHaveBeenCalledTimes(2);
    });
  });

  describe('refresh', () => {
    it('리프레시 토큰을 사용하여 새로운 액세스 토큰을 반환해야 합니다.', () => {
      const req = { cookies: { refreshtoken: 'valid-refresh-token' } } as unknown as Request;
      const res = { cookie: jest.fn() } as unknown as Response;
      authService.refresh!.mockResolvedValue({ accessToken: 'new-access-token' });

      const result = authController.refresh(req, res);
      expect(result).toEqual({ accessToken: 'new-access-token' });
    });

    it('리프레시 토큰이 없으면 UnauthorizedException을 던져야 합니다.', async () => {
      const req = { cookies: {} } as unknown as Request;
      const res = { cookie: jest.fn() } as unknown as Response;

      authService.refresh!.mockRejectedValue(new UnauthorizedException('No refresh token'));

      await expect(authController.refresh(req, res)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('signup', () => {
    it('사용자를 등록하고 user 객체를 반환해야 합니다.', async () => {
      const dto: SignUpRequestDto = {
        id: 'newuser',
        pwd: 'newpassword',
        usePwd: 0,
        name: 'New User',
        nickname: 'newuser123'
      };

      const newUser: SafeUser = {
        idx: 1,
        id: 'newuser',
        name: 'New User',
        nickname: 'newuser123',
        createDate: new Date().getTime(),
        updateDate: new Date().getTime(),
        lastLoginDate: null,
      };

      authService.signUp!.mockResolvedValue(newUser);

      const result = await authController.signup(dto);
      expect(authService.signUp).toHaveBeenCalledWith(dto);
      expect(result).toEqual(newUser);
    });

    it('회원가입 시 유효하지 않은 정보가 들어오면 BadRequestException을 던져야 합니다.', async () => {
      const dto: SignUpRequestDto = {
        id: '',
        pwd: 'newpassword',
        usePwd: 0,
        name: 'New User',
        nickname: 'newuser123'
      };

      authService.signUp!.mockRejectedValue(new BadRequestException('Invalid user information'));

      await expect(authController.signup(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('사용자를 업데이트하고 user 객체를 반환해야 합니다.', async () => {
      const dto = { nickname: 'updatedNickname' };
      const updatedUser: SafeUser = {
        idx: 1,
        id: 'user123',
        name: 'Test User',
        nickname: dto.nickname,
        createDate: new Date().getTime(),
        updateDate: new Date().getTime(),
        lastLoginDate: new Date().getTime(),
      };

      authService.update!.mockResolvedValue(updatedUser);

      const result = await authController.update(dto, updatedUser);
      expect(authService.update).toHaveBeenCalledWith(dto, updatedUser);
      expect(result).toEqual(updatedUser);
    });

    it('사용자 업데이트 시 유효하지 않은 정보가 들어오면 BadRequestException을 던져야 합니다.', async () => {
      const dto = { nickname: '' };
      const user: SafeUser = {
        idx: 1,
        id: 'user123',
        name: 'Test User',
        nickname: 'testuser',
        createDate: new Date().getTime(),
        updateDate: new Date().getTime(),
        lastLoginDate: new Date().getTime(),
      };

      authService.update!.mockRejectedValue(new BadRequestException('Invalid user information'));

      await expect(authController.update(dto, user)).rejects.toThrow(BadRequestException);
    });
  });

  describe('delete', () => {
    it('사용자를 삭제해야 합니다.', async () => {
      const user: SafeUser = {
        idx: 1,
        id: 'user123',
        name: 'Test User',
        nickname: 'testuser',
        createDate: new Date().getTime(),
        updateDate: new Date().getTime(),
        lastLoginDate: new Date().getTime(),
      };

      authService.delete!.mockResolvedValue(undefined);

      const result = await authController.delete(user);
      expect(authService.delete).toHaveBeenCalledWith(user);
      expect(result).toBeUndefined();
    });
  });

  it('회원탈퇴 실패 시 UnauthorizedException을 던져야 합니다.', async () => {
    const user: SafeUser = {
      idx: 1,
      id: 'user123',
      name: 'Test User',
      nickname: 'testuser',
      createDate: new Date().getTime(),
      updateDate: new Date().getTime(),
      lastLoginDate: new Date().getTime(),
    };

    authService.delete!.mockRejectedValue(new BadRequestException('Cannot delete user'));

    await expect(authController.delete(user)).rejects.toThrow(BadRequestException);
  });

});
