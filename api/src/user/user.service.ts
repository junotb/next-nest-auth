import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { SafeUser } from '../common/type/safe-user.type';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 유저 IDX로 유저 정보를 찾습니다.
   * @param idx - 유저 IDX
   * @returns 유저 정보
   * @throws BadRequestException - 유저를 찾을 수 없는 경우
   */
  async findByIdx(idx: number): Promise<SafeUser> {
    const user = await this.prisma.user.findUnique({ where: { idx } });
    if (!user) throw new BadRequestException('유저를 찾을 수 없습니다.');
    return this.getSafeUser(user);
  }

  /**
   * 유저 ID로 유저 정보를 찾습니다.
   * @param id - 유저 ID
   * @returns 유저 정보
   * @throws BadRequestException - 유저를 찾을 수 없는 경우
   */
  async findById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new BadRequestException('유저를 찾을 수 없습니다.');
    return user;
  }

  /**
   * 유저를 생성하고 민감한 정보를 제외한 유저 정보를 반환합니다.
   * @param CreateUserDto - 유저 생성 DTO
   * @returns 민감한 정보를 제외한 유저 정보
   * @throws BadRequestException - 유저가 이미 존재하는 경우
   */
  async create(dto: CreateUserDto): Promise<SafeUser> {
    const { id, pwd, usePwd, name, nickname } = dto;

    const exists = await this.prisma.user.findUnique({ where: { id } });
    if (exists) throw new BadRequestException('이미 존재하는 유저입니다.');

    const user = await this.prisma.user.create({
      data: {
        id,
        pwd,
        usePwd,
        name,
        nickname,
        createDate: new Date().getTime(),
        updateDate: new Date().getTime(),
      },
    });
    return this.getSafeUser(user);
  }

  /**
   * 유저 정보를 업데이트하고 민감한 정보를 제외한 유저 정보를 반환합니다.
   * @param UpdateUserDto - 유저 업데이트 DTO
   * @returns 민감한 정보를 제외한 유저 정보
   * @throws BadRequestException - 유저를 찾을 수 없는 경우
   */
  async update(dto: UpdateUserDto): Promise<SafeUser> {
    const { idx, nickname } = dto;

    const exists = await this.prisma.user.findUnique({ where: { idx } });
    if (!exists) throw new BadRequestException('유저를 찾을 수 없습니다.');

    const updatedUser = await this.prisma.user.update({
      where: { idx },
      data: {
        nickname,
        updateDate: new Date().getTime(),
      },
    });
    return this.getSafeUser(updatedUser);
  }

  /**
   * 유저 정보를 삭제하고 민감한 정보를 제외한 유저 정보를 반환합니다.
   * @param DeleteUserDto - 유저 삭제 DTO
   * @returns 민감한 정보를 제외한 유저 정보
   * @throws BadRequestException - 유저를 찾을 수 없는 경우
   */
  async delete(dto: DeleteUserDto): Promise<SafeUser> {
    const { idx } = dto;

    const exists = await this.prisma.user.findUnique({ where: { idx } });
    if (!exists) throw new BadRequestException('유저를 찾을 수 없습니다.');

    const deletedUser = await this.prisma.user.delete({ where: { idx } });
    return this.getSafeUser(deletedUser);
  }

  /**
   * 민감한 정보를 제외한 안전한 유저 정보를 반환합니다.
   * @param user - 유저 정보
   * @returns 민감한 정보를 제외한 유저 정보
   */
  private getSafeUser(user: User): SafeUser {
    const { pwd: _pwd, usePwd: _usePwd, ...safeUser } = user;
    return safeUser;
  }
}