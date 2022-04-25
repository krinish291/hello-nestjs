import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserTransformer } from './user.transfomer';

@Module({
  controllers: [UserController],
  providers: [UserService, UserTransformer],
  exports: [UserTransformer],
})
export class UserModule {}
