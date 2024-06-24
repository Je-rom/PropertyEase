import { Injectable } from '@nestjs/common';

@Injectable({})
export class AuthService {
  signup() {
    return {
      message: 'i am signed up',
    };
  }

  signin() {
    return {
      message: 'i am signed in',
    };
  }
}
