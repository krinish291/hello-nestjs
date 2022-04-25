import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class UserTransformer {
  transform(user: User) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }
}
