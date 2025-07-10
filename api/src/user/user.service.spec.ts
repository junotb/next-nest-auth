import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "../prisma/prisma.service";
import { UserService } from "./user.service";
import { BadRequestException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { SafeUser } from "src/common/type/safe-user.type";
import { UpdateUserDto } from "./dto/update-user.dto";
import { DeleteUserDto } from "./dto/delete-user.dto";

describe('UserService', () => {
  let userService: UserService;
  let prismaService: {
    user: {
      findUnique: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    }
  }

  beforeEach(async () => {
    prismaService = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: prismaService,
        }
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it('정의되어야 합니다.', () => {
    expect(userService).toBeDefined();
  });

  describe('findById', () => {
    it('유저 ID로 유저 정보를 찾아야 합니다.', async () => {
      const existingUser = { id: 'user123', pwd: 'password123', usePwd: 0, name: 'Test User', nickname: 'testuser' };
      prismaService.user.findUnique.mockResolvedValue(existingUser);

      const user = await userService.findById('user123');
      expect(user).toEqual(existingUser);
    });

    it('유저를 찾을 수 없으면 NotFoundException을 던져야 합니다.', async () => {
      await expect(userService.findById('non-existent-user-id')).rejects.toThrow(BadRequestException);
    });
  });

  describe('create', () => {
    it('새로운 유저를 생성해야 합니다.', async () => {
      const newUser: SafeUser = {
        idx: 1,
        id: 'newuser',
        name: 'New User',
        nickname: 'newuser',
        createDate: new Date().getTime(),
        updateDate: new Date().getTime(),
        lastLoginDate: new Date().getTime(),
      };
      const createUserDto: CreateUserDto = {
        id: newUser.id,
        pwd: 'password',
        usePwd: 0,
        name: newUser.name,
        nickname: newUser.nickname
      };
      prismaService.user.create.mockResolvedValue(newUser);
      
      const createdUser = await userService.create(createUserDto);
      expect(createdUser).toEqual(newUser);
    });

    it('이미 존재하는 유저 ID로 생성 시 BadRequestException을 던져야 합니다.', async () => {
      const existingUser: CreateUserDto = {
        id: 'existingUser',
        pwd: 'password',
        usePwd: 0,
        name: 'Existing User',
        nickname: 'existinguser'
      };
      prismaService.user.findUnique.mockResolvedValue(existingUser);
      
      await expect(userService.create(existingUser)).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('유저 정보를 업데이트해야 합니다.', async () => {
      const existingUser: SafeUser = {
        idx: 1,
        id: 'existing',
        name: 'New User',
        nickname: 'newuser',
        createDate: new Date().getTime(),
        updateDate: new Date().getTime(),
        lastLoginDate: new Date().getTime(),
      };
      const updateUserDto: UpdateUserDto = {
        idx: existingUser.idx,
        nickname: 'updatednickname'
      };

      prismaService.user.findUnique.mockResolvedValue(existingUser);
      prismaService.user.update.mockResolvedValue(existingUser);
      
      const updatedUser = await userService.update(updateUserDto);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { idx: existingUser.idx } });
      expect(updatedUser).toEqual(existingUser);
    });

    it('존재하지 않는 유저 정보를 업데이트 시 NotFoundException을 던져야 합니다.', async () => {
      const nonExistentIdx = 99999;
      await expect(userService.update({ idx: nonExistentIdx, nickname: 'nickname' })).rejects.toThrow(BadRequestException);
    });
  });

  describe('delete', () => {
    it('유저를 삭제해야 합니다.', async () => {
      const existingUser: SafeUser = {
        idx: 1,
        id: 'deleteduser',
        name: 'Deleted User',
        nickname: 'deleteduser',
        createDate: new Date().getTime(),
        updateDate: new Date().getTime(),
        lastLoginDate: new Date().getTime(),
      };
      prismaService.user.findUnique.mockResolvedValue(existingUser);
      prismaService.user.delete.mockResolvedValue(existingUser);

      const deleteUserDto: DeleteUserDto = { idx: 1 };
      const deletedUser = await userService.delete(deleteUserDto);
      
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { idx: existingUser.idx } });
      expect(deletedUser).toEqual(existingUser);
    });

    it('존재하지 않는 유저 삭제 시 NotFoundException을 던져야 합니다.', async () => {
      const nonExistentIdx = 99999;
      await expect(userService.delete({ idx: nonExistentIdx })).rejects.toThrow(BadRequestException);
    });
  });
});