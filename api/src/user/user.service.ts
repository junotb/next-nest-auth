import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { SafeUser } from 'src/common/type/safe-user.type';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 사용자 ID로 사용자 정보를 찾습니다.
   * @param id - 사용자 ID
   * @returns 사용자 정보
   * @throws NotFoundException - 사용자를 찾을 수 없는 경우
   */
  async findById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.');
    return user;
  }

  /**
   * 사용자 ID로 안전한 사용자 정보를 찾습니다.
   * @param id - 사용자 ID
   * @returns 안전한 사용자 정보
   * @throws BadRequestException - 사용자가 이미 존재하는 경우
   */
  async create(createUserDto: CreateUserDto): Promise<SafeUser> {
    const { id, pwd, usePwd, name, nickname } = createUserDto;

    const exists = await this.prisma.user.findUnique({ where: { id } });
    if (exists) throw new BadRequestException('이미 존재하는 사용자입니다.');

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
   * 사용자 ID로 사용자 정보를 찾고 안전한 사용자 정보를 반환합니다.
   * @returns 안전한 사용자 정보들
   */
  async findAll() {
    const users = await this.prisma.user.findMany();
    return users.map(this.getSafeUser);
  }

  /**
   * 사용자 idx로 사용자 정보를 찾습니다.
   * @param idx - 사용자 idx
   * @returns 사용자 정보
   * @throws NotFoundException - 사용자를 찾을 수 없는 경우
   */
  async update(updateUserDto: UpdateUserDto): Promise<SafeUser> {
    const { idx, nickname } = updateUserDto;
    if (!idx) throw new BadRequestException('사용자 정보가 제공되지 않았습니다.');

    const updatedUser = await this.prisma.user.update({
      where: { idx },
      data: {
        nickname,
        updateDate: new Date().getTime(),
      },
    });
    if (!updatedUser) throw new NotFoundException('사용자를 찾을 수 없습니다.');

    return this.getSafeUser(updatedUser);
  }

  /**
   * 사용자 idx로 사용자를 삭제합니다.
   * @param idx - 사용자 idx
   * @returns 삭제 메시지와 상태 코드
   * @throws NotFoundException - 사용자를 찾을 수 없는 경우
   */
  async delete(deleteUserDto: DeleteUserDto): Promise<SafeUser> {
    const { idx } = deleteUserDto;
    if (!idx) throw new BadRequestException('사용자 정보가 제공되지 않았습니다.');

    const deletedUser = await this.prisma.user.delete({ where: { idx } });
    if (!deletedUser) throw new NotFoundException('사용자를 찾을 수 없습니다.');
    return this.getSafeUser(deletedUser);
  }

  /**
   * 사용자 정보를 안전하게 반환합니다.
   * @param user - 사용자 정보
   * @returns 안전한 사용자 정보
   */
  private getSafeUser(user: User): SafeUser {
    const { pwd, usePwd, ...safeUser } = user;
    return safeUser;
  }
}