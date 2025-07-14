import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { SocialLoginRequestDto } from './dto/social-login-request.dto';
import { SocialLoginResponseDto } from './dto/social-login-response.dto';
import { RefreshResponseDto } from './dto/refresh-response.dto';
import { RefreshRequestDto } from './dto/refresh-request.dto';
import { SignUpResponseDto } from './dto/signup-response.dto';
import { SignUpRequestDto } from './dto/signup-request.dto';
import { UpdateResponseDto } from './dto/update-response.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { DeleteResponseDto } from './dto/delete-response.dto';
import { UserService } from '../user/user.service';
import { SocialUserService } from '../social-user/social-user.service';
import { SafeUser } from '../common/type/safe-user.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly socialUserService: SocialUserService
  ) {}

  /**
   * JWT 비밀 키를 가져옵니다.
   * @returns JWT 비밀 키
   */
  private getJwtSecret(): string {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) throw new InternalServerErrorException('JWT 비밀 키가 설정되어 있지 않습니다.');
    return jwtSecret;
  }

  /**
   * 사용자 로그인 처리
   * @param dto 로그인 요청 DTO
   * @returns 토큰
   * @throws BadRequestException 비밀번호가 일치하지 않는 경우
   */
  async login(dto: LoginRequestDto): Promise<LoginResponseDto> {
    const { id, pwd } = dto;

    // 사용자 조회
    const user = await this.userService.findById(id);

    // 비밀번호 확인
    const encodedPassword = Buffer.from(pwd).toString('base64');
    if (user.pwd !== encodedPassword) throw new BadRequestException('비밀번호가 일치하지 않습니다.');

    // JWT 토큰 생성
    const payload = { sub: user.idx };
    const accessToken = jwt.sign(payload, this.getJwtSecret(), { expiresIn: "15m" });
    const refreshToken = jwt.sign(payload, this.getJwtSecret(), { expiresIn: "7d" });

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * 사용자 소셜 로그인 처리
   * @param dto 소셜 로그인 요청 DTO
   * @returns 토큰
   * @throws BadRequestException 소셜 로그인 정보가 유효하지 않은 경우
   * @throws InternalServerErrorException JWT 비밀 키가 설정되어 있지 않은 경우
   */
  async socialLogin(dto: SocialLoginRequestDto): Promise<SocialLoginResponseDto> {
    const { provider, providerAccountId, id, name, nickname } = dto;

    // 소셜 사용자 조회
    const exists = await this.socialUserService.findByProvider(provider, providerAccountId);

    const userIdx = exists?.userIdx;
    let socialUser = exists ? await this.userService.findByIdx(userIdx) : null;

    if (!socialUser) {
      socialUser = await this.userService.create({
        id,
        pwd: '', // 소셜 로그인은 비밀번호가 없으므로 빈 문자열
        usePwd: 1, // 소셜 로그인 사용
        name,
        nickname,
      });

      if (!userIdx) {
        await this.socialUserService.createSocialUser({
          userIdx: socialUser.idx,
          provider,
          providerAccountId,
        });
      }
    }

    const newNewUser = await this.userService.create({
      id,
      pwd: '', // 소셜 로그인은 비밀번호가 없으므로 빈 문자열
      usePwd: 1, // 소셜 로그인 사용
      name,
      nickname,
    });

    return {
      accessToken: jwt.sign({ sub: newNewUser.idx }, this.getJwtSecret(), { expiresIn: "15m" }),
      refreshToken: jwt.sign({ sub: newNewUser.idx }, this.getJwtSecret(), { expiresIn: "7d" }),
    };
  }

  /**
   * 리프레시 토큰을 사용하여 새로운 액세스 토큰을 발급합니다.
   * @param dto 리프레시 토큰 정보 DTO
   * @returns 새로운 액세스 토큰과 성공 메시지
   * @throws UnauthorizedException 리프레시 토큰이 없거나 유효하지 않은 경우
   */
  refresh(dto: RefreshRequestDto): RefreshResponseDto {
    const { refreshToken } = dto;
    if (!refreshToken) throw new UnauthorizedException('리프레시 토큰이 없습니다.');

    try {
      const payload = jwt.verify(refreshToken, this.getJwtSecret());

      const newAccessToken = jwt.sign({ sub: payload.sub }, this.getJwtSecret(), { expiresIn: "15m" });
      const newRefreshToken = jwt.sign({ sub: payload.sub }, this.getJwtSecret(), { expiresIn: "7d" });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch {
      throw new UnauthorizedException('리프레시 토큰이 유효하지 않습니다.');
    }
  }

  /**
   * 사용자 회원가입 처리
   * @param dto 사용자 정보 DTO
   * @returns 회원가입 성공 메시지
   */
  async signUp(dto: SignUpRequestDto): Promise<SignUpResponseDto> {
    const { id, pwd, usePwd, name, nickname } = dto;

    // 사용자 생성
    const encodedPassword = Buffer.from(pwd).toString('base64');
    const user = await this.userService.create({ id, pwd: encodedPassword, usePwd, name, nickname });
    return { user };
  }

  /**
   * 사용자 정보를 업데이트 합니다.
   * @param dto 업데이트할 사용자 정보 DTO
   * @param user 사용자 정보
   * @return 업데이트 성공 메시지
   */
  async update(dto: UpdateRequestDto, user: SafeUser): Promise<UpdateResponseDto> {
    const { idx } = user;
    await this.userService.update({ ...dto, idx });
    return { user };
  }

  /**
   * 사용자 정보를 삭제 합니다.
   * @param user 사용자 정보
   * @return 삭제 성공 메시지
   */
  async delete(user: SafeUser): Promise<DeleteResponseDto> {
    const { idx } = user;
    await this.userService.delete({ idx });
    return { user };
  }
}
