import {
  ForbiddenException,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { AuthDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { UserTransformer } from 'src/user/user.transfomer';
import * as moment from 'moment';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private userTransformer: UserTransformer,
  ) {}
  async signIn(dto: AuthDto) {
    const { email, password } = dto;
    // find user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new ForbiddenException('Invalid email or password');
    }
    // check password
    const valid = await argon.verify(user.hash, password);
    if (!valid) {
      throw new ForbiddenException('Invalid email or password');
    }
    const payload = {
      email,
      id: user.id,
    };
    const signToken = await this.jwt.signAsync(payload, {
      expiresIn: '1d',
      secret: process.env.JWT_SECRET,
    });
    return {
      user: this.userTransformer.transform(user),
      access_token: signToken,
    };
  }

  async signUp(dto: AuthDto) {
    const { email, password } = dto;
    try {
      const hash = await argon.hash(password);
      const user = await this.prisma.user.create({
        data: {
          email,
          hash,
        },
      });
      delete user.hash;
      return user;
    } catch (error) {
      console.log(error);
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already exists.');
        }
      }
      throw error;
    }
  }

  async forgotPassword(dto: { email: string }) {
    const { email } = dto;
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new ForbiddenException('User not found.');
    }
    const code = Math.floor(Math.random() * 10000).toString();

    await this.prisma.code.upsert({
      where: {
        user_id: user.id,
      },
      create: {
        user_id: user.id,
        code: code,
        expired_at: moment().add(1, 'h').toDate(),
      },
      update: {
        code: code,
        expired_at: moment().add(1, 'h').toDate(),
      },
    });

    return {
      email,
      code,
    };
  }

  async verifyOtp(email: string, code: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }
    const otp = await this.prisma.code.findFirst({
      where: {
        user_id: user.id,
        code: code,
      },
    });
    if (!otp) {
      throw new BadRequestException('Invalid otp.');
    }
    return { user, status: true, message: 'verify otp successfully' };
  }

  async updatePassword(dto: { email: string; password: string; code: string }) {
    const { email, password, code } = dto;
    const { user } = await this.verifyOtp(email, code);
    const hash = await argon.hash(password);
    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        hash,
      },
    });
    await this.prisma.code.delete({
      where: {
        user_id: user.id,
      },
    });
    return {
      user: this.userTransformer.transform(user),
    };
  }
}
