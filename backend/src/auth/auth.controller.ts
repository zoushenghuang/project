import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: { username: string; password: string }) {
    return this.authService.login(loginDto);
  }

  @Get('currentUser')
  async getCurrentUser(@Request() req) {
    // 简单实现，实际应该从 token 中获取用户信息
    return this.authService.getCurrentUser();
  }

  @Post('logout')
  async logout() {
    return { success: true };
  }
}
