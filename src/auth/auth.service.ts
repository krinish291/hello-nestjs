import { Injectable } from '@nestjs/common';

@Injectable({})
export class AuthService {
  signIn() {
    return { msg: 'sign in' };
  }
  signUp() {
    return { msg: 'sign up' };
  }
}
