import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  signIn(@Body() dto: AuthDto) {
    return this.authService.signIn(dto);
  }

  @Post('signup')
  signUp(@Body() dto: AuthDto) {
    return this.authService.signUp(dto);
  }

  @Post('forgot-password')
  forgotPassword(@Body() dto: { email: string }) {
    return this.authService.forgotPassword(dto);
  }

  @Post('verify-otp')
  verifyOtp(@Body() dto: { code: string; email: string }) {
    return this.authService.verifyOtp(dto.email, dto.code);
  }

  @Post('reset-password')
  updatePassword(
    @Body() dto: { email: string; password: string; code: string },
  ) {
    return this.authService.updatePassword(dto);
  }
}
