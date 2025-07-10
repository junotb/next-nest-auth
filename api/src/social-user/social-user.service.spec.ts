import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException, NotFoundException } from "@nestjs/common/exceptions";
import { SocialUserService } from "./social-user.service";
import { PrismaService } from "../prisma/prisma.service";
import { CreateSocialUserDto } from "./dto/create-social-user.dto";
import { DeleteSocialUserDto } from "./dto/delete-social-user.dto";

describe('SocialUserService', () => {
  let socialUserService: SocialUserService;
  let prismaService: {
    socialUser: {
      findUnique: jest.Mock;
      findFirst: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    }
  }

  beforeEach(async () => {
    prismaService = {
      socialUser: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SocialUserService,
        {
          provide: PrismaService,
          useValue: prismaService,
        }
      ],
    }).compile();

    socialUserService = module.get<SocialUserService>(SocialUserService);
  });

  it('정의되어야 합니다.', () => {
    expect(socialUserService).toBeDefined();
  });

  describe('findByProvider', () => {
    it('소셜 유저를 찾을 수 있어야 합니다.', async () => {
      const provider = 'google';
      const providerAccountId = '1234567890';

      prismaService.socialUser.findFirst.mockResolvedValueOnce({ id: 1, provider, providerAccountId });

      const result = await socialUserService.findByProvider(provider, providerAccountId);
      expect(result).toEqual({ id: 1, provider, providerAccountId });
    });

    it('소셜 유저를 찾을 수 없는 경우 예외를 던져야 합니다.', async () => {
      const provider = 'google';
      const providerAccountId = '1234567890';

      prismaService.socialUser.findFirst.mockResolvedValueOnce(null);

      await expect(socialUserService.findByProvider(provider, providerAccountId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createSocialUser', () => {
    it('소셜 유저를 생성할 수 있어야 합니다.', async () => {
      const dto: CreateSocialUserDto = { userIdx: 1, provider: 'google', providerAccountId: '1234567890' };

      prismaService.socialUser.create.mockResolvedValueOnce(dto);

      const result = await socialUserService.createSocialUser(dto);
      expect(result).toEqual(dto);
    });

    it('이미 존재하는 소셜 유저인 경우 예외를 던져야 합니다.', async () => {
      const dto: CreateSocialUserDto = { userIdx: 1, provider: 'google', providerAccountId: '1234567890' };

      prismaService.socialUser.findUnique.mockResolvedValueOnce(dto);

      await expect(socialUserService.createSocialUser(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteSocialUser', () => {
    it('소셜 유저를 삭제할 수 있어야 합니다.', async () => {
      const dto: DeleteSocialUserDto = { userIdx: 1 };

      prismaService.socialUser.findUnique.mockResolvedValueOnce(dto);
      prismaService.socialUser.delete.mockResolvedValueOnce(dto);

      const result = await socialUserService.deleteSocialUser(dto);
      expect(result).toEqual(dto);
    });

    it('소셜 유저를 찾을 수 없는 경우 예외를 던져야 합니다.', async () => {
      const dto: DeleteSocialUserDto = { userIdx: 1 };

      prismaService.socialUser.findUnique.mockResolvedValueOnce(null);

      await expect(socialUserService.deleteSocialUser(dto)).rejects.toThrow(NotFoundException);
    });
  });
});