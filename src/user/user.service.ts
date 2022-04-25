import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUser(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async editUser(email: string, body: any) {
    return await this.prisma.user.update({
      where: { email },
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
      },
    });
  }
}
