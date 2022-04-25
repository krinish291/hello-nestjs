import { Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMe(@Req() req: any) {
    return this.userService.getUser(req.user.email);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('edit')
  editUser(@Req() req: any) {
    return this.userService.editUser(req.user.email, req.body);
  }
}
