import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from 'jsonwebtoken';
import { PrismaService } from '../prisma/prisma.service';
import { SafeUser } from '../common/type/safe-user.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) throw new InternalServerErrorException('JWT 비밀 키가 설정되어 있지 않습니다.');

    // JWT 전략 설정
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Authorization 헤더에서 Bearer 토큰 추출
      ignoreExpiration: false, // 만료된 토큰은 거부
      secretOrKey: jwtSecret, // JWT 비밀 키
    });
  }

  /**
   * JWT 토큰의 유효성을 검사하고 사용자 정보를 반환합니다.
   * @param payload JWT 페이로드
   * @returns 사용자 정보
   */
  async validate(payload: JwtPayload): Promise<SafeUser> {
    const user = await this.prisma.user.findUnique({ where: { idx: Number(payload.sub) } });
    if (!user) throw new UnauthorizedException();
    const { pwd: _pwd, usePwd: _usePwd, ...safeUser } = user;
    return safeUser;
  }
}
